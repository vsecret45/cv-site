(function exposeKirbyCvMedia(globalScope) {
    'use strict';

    const MEDIA_SCHEMA_VERSION = 1;
    const DEFAULT_MAX_FILE_BYTES = 30 * 1024 * 1024;
    const DEFAULT_MAX_SOURCE_PIXELS = 12_000_000;
    const DEFAULT_MAX_DATA_URL_LENGTH = 420_000;
    const DEFAULT_MAX_OUTPUT_DIMENSION = 720;
    const DEFAULT_MIN_PORTRAIT_SCORE = 68;
    const DEFAULT_OBJECT_TIMEOUT_MS = 3_000;
    const ALLOWED_DATA_URL_PATTERN = /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i;
    const ALLOWED_MEDIA_SOURCES = new Set(['user-upload', 'pdf-import', 'word-import']);

    const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
    const finiteNumber = (value, fallback = 0) => {
        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
    };
    const round = (value, precision = 4) => {
        const multiplier = 10 ** precision;
        return Math.round(finiteNumber(value) * multiplier) / multiplier;
    };

    const multiplyMatrices = (left = [1, 0, 0, 1, 0, 0], right = [1, 0, 0, 1, 0, 0]) => [
        left[0] * right[0] + left[2] * right[1],
        left[1] * right[0] + left[3] * right[1],
        left[0] * right[2] + left[2] * right[3],
        left[1] * right[2] + left[3] * right[3],
        left[0] * right[4] + left[2] * right[5] + left[4],
        left[1] * right[4] + left[3] * right[5] + left[5],
    ];

    const transformPoint = (matrix, x, y) => ({
        x: matrix[0] * x + matrix[2] * y + matrix[4],
        y: matrix[1] * x + matrix[3] * y + matrix[5],
    });

    const getImagePlacement = (matrix, pageWidth, pageHeight) => {
        const points = [
            transformPoint(matrix, 0, 0),
            transformPoint(matrix, 1, 0),
            transformPoint(matrix, 0, 1),
            transformPoint(matrix, 1, 1),
        ];
        const xs = points.map((point) => point.x);
        const ys = points.map((point) => point.y);
        const minimumX = Math.min(...xs);
        const maximumX = Math.max(...xs);
        const minimumY = Math.min(...ys);
        const maximumY = Math.max(...ys);
        const width = Math.max(0, maximumX - minimumX);
        const height = Math.max(0, maximumY - minimumY);
        const safePageWidth = Math.max(1, finiteNumber(pageWidth, 1));
        const safePageHeight = Math.max(1, finiteNumber(pageHeight, 1));
        // PDF content coordinates start at the bottom-left. KirbyCV exposes a
        // top-origin placement because that is what the preview and scoring use.
        const top = safePageHeight - maximumY;

        return {
            x: round(minimumX, 2),
            y: round(top, 2),
            width: round(width, 2),
            height: round(height, 2),
            xRatio: round(clamp(minimumX / safePageWidth, 0, 1)),
            yRatio: round(clamp(top / safePageHeight, 0, 1)),
            widthRatio: round(clamp(width / safePageWidth, 0, 1)),
            heightRatio: round(clamp(height / safePageHeight, 0, 1)),
            areaRatio: round(clamp((width * height) / (safePageWidth * safePageHeight), 0, 1)),
        };
    };

    const getOperationNameMatcher = (ops = {}) => ({
        save: ops.save,
        restore: ops.restore,
        transform: ops.transform,
        setTransform: ops.setTransform,
        paintImageXObject: ops.paintImageXObject,
        paintInlineImageXObject: ops.paintInlineImageXObject,
    });

    const collectPdfImageOccurrences = (operatorList, ops, pageWidth, pageHeight) => {
        const functions = Array.isArray(operatorList?.fnArray) ? operatorList.fnArray : [];
        const argumentsList = Array.isArray(operatorList?.argsArray) ? operatorList.argsArray : [];
        const names = getOperationNameMatcher(ops);
        const stack = [];
        const occurrences = [];
        let matrix = [1, 0, 0, 1, 0, 0];

        functions.forEach((operation, index) => {
            const args = argumentsList[index];
            if (operation === names.save) {
                stack.push([...matrix]);
                return;
            }
            if (operation === names.restore) {
                matrix = stack.pop() || [1, 0, 0, 1, 0, 0];
                return;
            }
            if (operation === names.transform && Array.isArray(args) && args.length >= 6) {
                matrix = multiplyMatrices(matrix, args.slice(0, 6).map(Number));
                return;
            }
            if (operation === names.setTransform && Array.isArray(args) && args.length >= 6) {
                matrix = args.slice(0, 6).map(Number);
                return;
            }
            if (operation === names.paintImageXObject) {
                const objectId = Array.isArray(args) ? args[0] : '';
                if (typeof objectId === 'string' && objectId) {
                    occurrences.push({
                        objectId,
                        inlineImage: null,
                        placement: getImagePlacement(matrix, pageWidth, pageHeight),
                        operationIndex: index,
                    });
                }
                return;
            }
            if (operation === names.paintInlineImageXObject) {
                const inlineImage = Array.isArray(args) ? args[0] : null;
                if (inlineImage && typeof inlineImage === 'object') {
                    occurrences.push({
                        objectId: '',
                        inlineImage,
                        placement: getImagePlacement(matrix, pageWidth, pageHeight),
                        operationIndex: index,
                    });
                }
            }
        });

        return occurrences;
    };

    const resolvePdfPageObject = (page, objectId, timeoutMs = DEFAULT_OBJECT_TIMEOUT_MS) => {
        if (!page?.objs || !objectId) {
            return Promise.resolve(null);
        }

        try {
            if (typeof page.objs.has === 'function' && page.objs.has(objectId)) {
                return Promise.resolve(page.objs.get(objectId));
            }
        } catch (error) {
            return Promise.resolve(null);
        }

        return new Promise((resolve) => {
            let settled = false;
            const finish = (value) => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                resolve(value || null);
            };
            const timer = setTimeout(() => finish(null), Math.max(100, timeoutMs));

            try {
                page.objs.get(objectId, finish);
            } catch (error) {
                finish(null);
            }
        });
    };

    const getRawImageChannelCount = (image) => {
        const width = Math.max(0, Math.round(finiteNumber(image?.width)));
        const height = Math.max(0, Math.round(finiteNumber(image?.height)));
        const pixelCount = width * height;
        const length = finiteNumber(image?.data?.length);
        if (!pixelCount || !length) return 0;
        if (length >= pixelCount * 4) return 4;
        if (length >= pixelCount * 3) return 3;
        return 0;
    };

    const analyzeRawImage = (image, sampleLimit = 4096) => {
        const width = Math.max(0, Math.round(finiteNumber(image?.width)));
        const height = Math.max(0, Math.round(finiteNumber(image?.height)));
        const channels = getRawImageChannelCount(image);
        const data = image?.data;
        const pixelCount = width * height;
        if (!channels || !data || pixelCount < 64) {
            return null;
        }

        const step = Math.max(1, Math.floor(pixelCount / Math.max(64, sampleLimit)));
        const colors = new Set();
        let sampleCount = 0;
        let luminanceTotal = 0;
        let luminanceSquaredTotal = 0;
        let midtoneCount = 0;

        for (let pixel = 0; pixel < pixelCount; pixel += step) {
            const offset = pixel * channels;
            const red = data[offset];
            const green = data[offset + 1];
            const blue = data[offset + 2];
            if (![red, green, blue].every(Number.isFinite)) continue;
            const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
            colors.add(((red >> 3) << 10) | ((green >> 3) << 5) | (blue >> 3));
            luminanceTotal += luminance;
            luminanceSquaredTotal += luminance * luminance;
            if (luminance > 24 && luminance < 232) midtoneCount += 1;
            sampleCount += 1;
        }

        if (!sampleCount) return null;
        const mean = luminanceTotal / sampleCount;
        const variance = Math.max(0, luminanceSquaredTotal / sampleCount - mean * mean);
        return {
            sampleCount,
            colorDiversity: round(colors.size / sampleCount),
            luminanceStdDev: round(Math.sqrt(variance), 2),
            midtoneRatio: round(midtoneCount / sampleCount),
        };
    };

    const createCanvas = (width, height, canvasFactory) => {
        let canvas = null;
        if (typeof canvasFactory === 'function') {
            canvas = canvasFactory(width, height);
        } else if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
            canvas = document.createElement('canvas');
        }
        if (!canvas) return null;
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };

    const analyzeBitmapImage = (image, canvasFactory) => {
        if (!image?.bitmap) return null;
        const canvas = createCanvas(64, 64, canvasFactory);
        const context = canvas?.getContext?.('2d', { willReadFrequently: true });
        if (!context?.drawImage || !context?.getImageData) return null;
        try {
            context.drawImage(image.bitmap, 0, 0, 64, 64);
            return analyzeRawImage({ width: 64, height: 64, data: context.getImageData(0, 0, 64, 64).data });
        } catch (error) {
            return null;
        }
    };

    const getPortraitVisualStats = (image, canvasFactory) =>
        analyzeRawImage(image) || analyzeBitmapImage(image, canvasFactory);

    const closeness = (value, target, distance) =>
        clamp(1 - Math.abs(value - target) / Math.max(distance, 0.0001), 0, 1);

    const isPlausiblePortraitPlacement = (placement = {}) => {
        const widthRatio = finiteNumber(placement.widthRatio);
        const heightRatio = finiteNumber(placement.heightRatio);
        const areaRatio = finiteNumber(placement.areaRatio, widthRatio * heightRatio);
        const topRatio = finiteNumber(placement.yRatio, 1);
        const displayAspect = finiteNumber(placement.height) > 0
            ? finiteNumber(placement.width) / finiteNumber(placement.height)
            : (heightRatio ? widthRatio / heightRatio : 0);
        return (
            displayAspect >= 0.42 && displayAspect <= 1.55 &&
            widthRatio >= 0.055 && widthRatio <= 0.42 &&
            heightRatio >= 0.045 && heightRatio <= 0.45 &&
            areaRatio >= 0.0025 && areaRatio <= 0.16 &&
            topRatio <= 0.5
        );
    };

    const scorePortraitCandidate = (candidate = {}) => {
        const pixelWidth = Math.max(0, finiteNumber(candidate.pixelWidth || candidate.image?.width));
        const pixelHeight = Math.max(0, finiteNumber(candidate.pixelHeight || candidate.image?.height));
        const placement = candidate.placement || {};
        const widthRatio = finiteNumber(placement.widthRatio);
        const heightRatio = finiteNumber(placement.heightRatio);
        const areaRatio = finiteNumber(placement.areaRatio, widthRatio * heightRatio);
        const topRatio = finiteNumber(placement.yRatio, 1);
        const rawAspect = pixelHeight ? pixelWidth / pixelHeight : 0;
        const displayAspect = finiteNumber(placement.height) > 0
            ? finiteNumber(placement.width) / finiteNumber(placement.height)
            : (heightRatio ? widthRatio / heightRatio : 0);

        if (
            pixelWidth < 96 || pixelHeight < 96 ||
            rawAspect < 0.48 || rawAspect > 1.35 ||
            !isPlausiblePortraitPlacement(placement)
        ) {
            return Number.NEGATIVE_INFINITY;
        }

        const stats = candidate.visualStats;
        if (stats?.sampleCount >= 64) {
            const looksPhotographic = (
                stats.colorDiversity >= 0.015 &&
                stats.luminanceStdDev >= 20 &&
                stats.midtoneRatio >= 0.08
            ) || (
                stats.luminanceStdDev >= 38 &&
                stats.midtoneRatio >= 0.18
            );
            if (!looksPhotographic) {
                return Number.NEGATIVE_INFINITY;
            }
        }

        let score = 20;
        score += closeness(rawAspect, 0.78, 0.7) * 18;
        score += closeness(displayAspect, 0.78, 0.8) * 8;
        score += clamp(Math.log2(Math.max(1, Math.min(pixelWidth, pixelHeight) / 96)), 0, 2.5) / 2.5 * 10;
        score += closeness(widthRatio, 0.14, 0.25) * 10;
        score += closeness(areaRatio, 0.018, 0.14) * 7;
        score += clamp((0.5 - topRatio) / 0.5, 0, 1) * 14;
        score += candidate.pageNumber === 1 ? 6 : Math.max(0, 4 - finiteNumber(candidate.pageNumber));
        if (stats) {
            score += clamp(stats.colorDiversity / 0.08, 0, 1) * 4;
            score += clamp(stats.luminanceStdDev / 60, 0, 1) * 3;
        }
        if (rawAspect <= 1.05 && displayAspect <= 1.1) score += 4;

        return round(score, 2);
    };

    const pickBestPortraitCandidate = (candidates = [], minimumScore = DEFAULT_MIN_PORTRAIT_SCORE) => {
        const ranked = candidates
            .map((candidate) => ({ ...candidate, score: scorePortraitCandidate(candidate) }))
            .filter((candidate) => Number.isFinite(candidate.score) && candidate.score >= minimumScore)
            .sort((left, right) => right.score - left.score);

        if (!ranked.length) return null;
        const best = ranked[0];
        const runnerUp = ranked.find((candidate) => candidate.objectId !== best.objectId);
        if (runnerUp && best.score - runnerUp.score < 4 && best.score < 86) {
            return null;
        }
        return best;
    };

    const copyRawImageToCanvas = (image, canvas, canvasFactory) => {
        const width = Math.round(finiteNumber(image?.width));
        const height = Math.round(finiteNumber(image?.height));
        const channels = getRawImageChannelCount(image);
        if (!width || !height || !channels) return false;
        const context = canvas?.getContext?.('2d');
        if (!context?.createImageData || !context?.putImageData) return false;

        const imageData = context.createImageData(width, height);
        const output = imageData.data;
        const input = image.data;
        for (let pixel = 0; pixel < width * height; pixel += 1) {
            const inputOffset = pixel * channels;
            const outputOffset = pixel * 4;
            output[outputOffset] = input[inputOffset];
            output[outputOffset + 1] = input[inputOffset + 1];
            output[outputOffset + 2] = input[inputOffset + 2];
            output[outputOffset + 3] = channels === 4 ? input[inputOffset + 3] : 255;
        }
        context.putImageData(imageData, 0, 0);
        return true;
    };

    const encodePortraitDataUrl = (image, options = {}) => {
        const sourceWidth = Math.round(finiteNumber(image?.width || image?.bitmap?.width));
        const sourceHeight = Math.round(finiteNumber(image?.height || image?.bitmap?.height));
        const sourcePixels = sourceWidth * sourceHeight;
        const maximumSourcePixels = Math.max(1, finiteNumber(options.maxSourcePixels, DEFAULT_MAX_SOURCE_PIXELS));
        if (!sourceWidth || !sourceHeight || sourcePixels > maximumSourcePixels) return null;

        const canvasFactory = options.canvasFactory;
        let sourceCanvas = null;
        if (!image.bitmap) {
            sourceCanvas = createCanvas(sourceWidth, sourceHeight, canvasFactory);
            if (!sourceCanvas || !copyRawImageToCanvas(image, sourceCanvas, canvasFactory)) return null;
        }

        const maximumDimension = clamp(
            Math.round(finiteNumber(options.maxOutputDimension, DEFAULT_MAX_OUTPUT_DIMENSION)),
            160,
            1200,
        );
        const maximumDataUrlLength = clamp(
            Math.round(finiteNumber(options.maxDataUrlLength, DEFAULT_MAX_DATA_URL_LENGTH)),
            20_000,
            DEFAULT_MAX_DATA_URL_LENGTH,
        );
        let scale = Math.min(1, maximumDimension / Math.max(sourceWidth, sourceHeight));

        for (let resizeAttempt = 0; resizeAttempt < 5; resizeAttempt += 1) {
            const width = Math.max(96, Math.round(sourceWidth * scale));
            const height = Math.max(96, Math.round(sourceHeight * scale));
            const canvas = createCanvas(width, height, canvasFactory);
            const context = canvas?.getContext?.('2d');
            if (!canvas || !context?.drawImage || typeof canvas.toDataURL !== 'function') return null;

            context.save?.();
            if ('fillStyle' in context) context.fillStyle = '#ffffff';
            context.fillRect?.(0, 0, width, height);
            if ('imageSmoothingEnabled' in context) context.imageSmoothingEnabled = true;
            if ('imageSmoothingQuality' in context) context.imageSmoothingQuality = 'high';
            context.drawImage(image.bitmap || sourceCanvas, 0, 0, width, height);
            context.restore?.();

            for (const quality of [0.88, 0.8, 0.72, 0.64]) {
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                if (ALLOWED_DATA_URL_PATTERN.test(dataUrl) && dataUrl.length <= maximumDataUrlLength) {
                    return { dataUrl, mimeType: 'image/jpeg', width, height };
                }
            }
            scale *= 0.8;
        }
        return null;
    };

    const sanitizeMediaState = (value) => {
        const source = value && typeof value === 'object' && !Array.isArray(value) ? value : null;
        const dataUrl = String(source?.dataUrl || '').trim();
        if (!source || !ALLOWED_DATA_URL_PATTERN.test(dataUrl) || dataUrl.length > DEFAULT_MAX_DATA_URL_LENGTH) {
            return null;
        }

        const width = Math.round(finiteNumber(source.width));
        const height = Math.round(finiteNumber(source.height));
        if (width < 48 || height < 48 || width > 1200 || height > 1200) return null;
        const originalWidth = clamp(Math.round(finiteNumber(source.originalWidth, width)), width, 20_000);
        const originalHeight = clamp(Math.round(finiteNumber(source.originalHeight, height)), height, 20_000);
        const placement = source.placement && typeof source.placement === 'object' ? source.placement : {};

        return {
            schemaVersion: MEDIA_SCHEMA_VERSION,
            type: 'profile-photo',
            source: ALLOWED_MEDIA_SOURCES.has(source.source) ? source.source : 'pdf-import',
            dataUrl,
            mimeType: `image/${dataUrl.match(ALLOWED_DATA_URL_PATTERN)?.[1]?.toLowerCase() || 'jpeg'}`,
            width,
            height,
            originalWidth,
            originalHeight,
            pageNumber: clamp(Math.round(finiteNumber(source.pageNumber, 1)), 1, 20),
            placement: {
                xRatio: round(clamp(finiteNumber(placement.xRatio), 0, 1)),
                yRatio: round(clamp(finiteNumber(placement.yRatio), 0, 1)),
                widthRatio: round(clamp(finiteNumber(placement.widthRatio), 0, 1)),
                heightRatio: round(clamp(finiteNumber(placement.heightRatio), 0, 1)),
            },
            score: round(clamp(finiteNumber(source.score), 0, 100), 2),
        };
    };

    const getContainedImageRect = (sourceWidth, sourceHeight, frame = {}) => {
        const width = finiteNumber(frame.width);
        const height = finiteNumber(frame.height);
        const x = finiteNumber(frame.x);
        const y = finiteNumber(frame.y);
        const maximumPadding = Math.max(0, Math.min(width, height) / 2 - 0.01);
        const padding = clamp(finiteNumber(frame.padding, 0), 0, maximumPadding);
        const availableWidth = width - padding * 2;
        const availableHeight = height - padding * 2;
        const imageWidth = finiteNumber(sourceWidth);
        const imageHeight = finiteNumber(sourceHeight);

        if (imageWidth <= 0 || imageHeight <= 0 || availableWidth <= 0 || availableHeight <= 0) {
            return null;
        }

        const scale = Math.min(availableWidth / imageWidth, availableHeight / imageHeight);
        const renderedWidth = imageWidth * scale;
        const renderedHeight = imageHeight * scale;

        return {
            x: round(x + padding + (availableWidth - renderedWidth) / 2, 3),
            y: round(y + padding + (availableHeight - renderedHeight) / 2, 3),
            width: round(renderedWidth, 3),
            height: round(renderedHeight, 3),
        };
    };

    const normalizeRgbChannels = (value, fallback) => {
        const source = Array.isArray(value) && value.length >= 3 ? value : fallback;
        return source.slice(0, 3).map((channel) => clamp(Math.round(finiteNumber(channel)), 0, 255));
    };

    const drawJsPdfProfilePhoto = (doc, value, frame = {}, options = {}) => {
        const photo = sanitizeMediaState(value);
        const format = photo?.mimeType === 'image/png'
            ? 'PNG'
            : photo?.mimeType === 'image/jpeg'
                ? 'JPEG'
                : '';
        const frameWidth = finiteNumber(frame.width);
        const frameHeight = finiteNumber(frame.height);
        const frameX = finiteNumber(frame.x);
        const frameY = finiteNumber(frame.y);
        const radius = clamp(finiteNumber(frame.radius, 2), 0, Math.min(frameWidth, frameHeight) / 2);
        const imageRect = photo && format
            ? getContainedImageRect(photo.width, photo.height, frame)
            : null;

        if (!doc?.addImage || !imageRect || frameWidth <= 0 || frameHeight <= 0) {
            return false;
        }

        const background = normalizeRgbChannels(options.backgroundRgb, [255, 255, 255]);
        const border = normalizeRgbChannels(options.borderRgb, [217, 222, 234]);
        const drawFrame = (style) => {
            if (typeof doc.roundedRect === 'function') {
                doc.roundedRect(frameX, frameY, frameWidth, frameHeight, radius, radius, style);
            } else if (typeof doc.rect === 'function') {
                doc.rect(frameX, frameY, frameWidth, frameHeight, style);
            }
        };

        try {
            doc.setFillColor?.(...background);
            drawFrame('F');
            doc.addImage(
                photo.dataUrl,
                format,
                imageRect.x,
                imageRect.y,
                imageRect.width,
                imageRect.height,
                undefined,
                'FAST',
            );
            doc.setDrawColor?.(...border);
            doc.setLineWidth?.(Math.max(0.1, finiteNumber(options.lineWidth, 0.25)));
            drawFrame('S');
            return true;
        } catch (error) {
            if (typeof options.onError === 'function') {
                options.onError(error);
            }
            return false;
        }
    };

    const toPdfBytes = async (file) => {
        if (file instanceof Uint8Array) return file;
        if (file instanceof ArrayBuffer) return new Uint8Array(file);
        if (ArrayBuffer.isView(file)) {
            return new Uint8Array(file.buffer, file.byteOffset, file.byteLength);
        }
        if (typeof file?.arrayBuffer === 'function') {
            return new Uint8Array(await file.arrayBuffer());
        }
        return null;
    };

    const extractPdfPortraitFromDocument = async (documentProxy, pdfjs, options = {}) => {
        if (!documentProxy?.getPage || !pdfjs?.OPS) return null;
        try {
            const maximumPages = clamp(Math.round(finiteNumber(options.maxPages, 2)), 1, 3);
            const maximumCandidates = clamp(Math.round(finiteNumber(options.maxCandidates, 24)), 1, 50);
            const candidates = [];

            for (let pageNumber = 1; pageNumber <= Math.min(documentProxy.numPages, maximumPages); pageNumber += 1) {
                const page = await documentProxy.getPage(pageNumber);
                const viewport = page.getViewport({ scale: 1 });
                const operatorList = await page.getOperatorList();
                const occurrences = collectPdfImageOccurrences(
                    operatorList,
                    pdfjs.OPS,
                    viewport.width,
                    viewport.height,
                )
                    .filter((occurrence) => isPlausiblePortraitPlacement(occurrence.placement))
                    .slice(0, maximumCandidates - candidates.length);

                for (const occurrence of occurrences) {
                    const image = occurrence.inlineImage || await resolvePdfPageObject(
                        page,
                        occurrence.objectId,
                        finiteNumber(options.objectTimeoutMs, DEFAULT_OBJECT_TIMEOUT_MS),
                    );
                    const pixelWidth = Math.round(finiteNumber(image?.width || image?.bitmap?.width));
                    const pixelHeight = Math.round(finiteNumber(image?.height || image?.bitmap?.height));
                    if (!image || !pixelWidth || !pixelHeight || pixelWidth * pixelHeight > finiteNumber(options.maxSourcePixels, DEFAULT_MAX_SOURCE_PIXELS)) {
                        continue;
                    }
                    candidates.push({
                        ...occurrence,
                        image,
                        pixelWidth,
                        pixelHeight,
                        pageNumber,
                        visualStats: getPortraitVisualStats(image, options.canvasFactory),
                    });
                }

                if (candidates.length >= maximumCandidates) break;
            }

            const best = pickBestPortraitCandidate(
                candidates,
                finiteNumber(options.minimumScore, DEFAULT_MIN_PORTRAIT_SCORE),
            );
            if (!best) return null;
            const encoded = encodePortraitDataUrl(best.image, options);
            if (!encoded) return null;

            return sanitizeMediaState({
                schemaVersion: MEDIA_SCHEMA_VERSION,
                type: 'profile-photo',
                source: 'pdf-import',
                ...encoded,
                originalWidth: best.pixelWidth,
                originalHeight: best.pixelHeight,
                pageNumber: best.pageNumber,
                placement: best.placement,
                score: best.score,
            });
        } catch (error) {
            return null;
        }
    };

    const extractPdfPortrait = async (file, pdfjs, options = {}) => {
        if (!pdfjs?.getDocument || !pdfjs?.OPS) return null;
        if (finiteNumber(file?.size) > finiteNumber(options.maxFileBytes, DEFAULT_MAX_FILE_BYTES)) return null;

        let documentProxy = null;
        try {
            const data = await toPdfBytes(file);
            if (!data?.length || data.length > finiteNumber(options.maxFileBytes, DEFAULT_MAX_FILE_BYTES)) return null;
            documentProxy = await pdfjs.getDocument({ data }).promise;
            return await extractPdfPortraitFromDocument(documentProxy, pdfjs, options);
        } catch (error) {
            return null;
        } finally {
            try {
                await documentProxy?.destroy?.();
            } catch (error) {
                // PDF.js cleanup must never make a successful import fail.
            }
        }
    };

    const api = {
        MEDIA_SCHEMA_VERSION,
        sanitizeMediaState,
        normalizeMediaState: sanitizeMediaState,
        multiplyMatrices,
        getImagePlacement,
        collectPdfImageOccurrences,
        analyzeRawImage,
        isPlausiblePortraitPlacement,
        scorePortraitCandidate,
        pickBestPortraitCandidate,
        getContainedImageRect,
        drawJsPdfProfilePhoto,
        extractPdfPortraitFromDocument,
        extractPdfPortrait,
    };

    globalScope.KirbyCvMedia = api;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})(typeof window !== 'undefined' ? window : globalThis);
