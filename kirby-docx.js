(function exposeKirbyDocx(globalScope) {
    'use strict';

    const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const DOCX_FINGERPRINT_PREFIX = 'SACW_CV_DOCX_FINGERPRINT_V1_';
    // Keep this contract aligned with KirbyCvMedia.DEFAULT_MAX_DATA_URL_LENGTH.
    // The photo is stored once as a DOCX media part, never duplicated inside
    // the hidden round-trip JSON marker.
    const MAX_PROFILE_PHOTO_DATA_URL_LENGTH = 420_000;
    const MAX_PROFILE_PHOTO_BYTES = Math.ceil(MAX_PROFILE_PHOTO_DATA_URL_LENGTH / 4) * 3;
    const PROFILE_PHOTO_RELATIONSHIP_ID = 'rId4';
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();

    const toUint8Array = (value) => {
        if (value instanceof Uint8Array) {
            return value;
        }
        if (value instanceof ArrayBuffer) {
            return new Uint8Array(value);
        }
        if (ArrayBuffer.isView(value)) {
            return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
        }
        return textEncoder.encode(String(value ?? ''));
    };

    const concatBytes = (parts = []) => {
        const normalized = parts.map(toUint8Array);
        const output = new Uint8Array(normalized.reduce((total, part) => total + part.length, 0));
        let offset = 0;
        normalized.forEach((part) => {
            output.set(part, offset);
            offset += part.length;
        });
        return output;
    };

    const decodeBase64Bytes = (value = '') => {
        const encoded = String(value || '').replace(/\s+/g, '');
        const maxEncodedLength = Math.ceil(MAX_PROFILE_PHOTO_BYTES / 3) * 4;
        if (
            !encoded ||
            encoded.length > maxEncodedLength ||
            encoded.length % 4 !== 0 ||
            !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded) ||
            typeof globalScope.atob !== 'function'
        ) {
            return null;
        }

        try {
            const binary = globalScope.atob(encoded);
            if (!binary.length || binary.length > MAX_PROFILE_PHOTO_BYTES) {
                return null;
            }
            const bytes = new Uint8Array(binary.length);
            for (let index = 0; index < binary.length; index += 1) {
                bytes[index] = binary.charCodeAt(index);
            }
            return bytes;
        } catch (error) {
            return null;
        }
    };

    const hasBytePrefix = (bytes, prefix) => prefix.every((byte, index) => bytes[index] === byte);

    const readPngDimensions = (bytes) => {
        if (bytes.length < 24 || !hasBytePrefix(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
            return null;
        }
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const width = view.getUint32(16, false);
        const height = view.getUint32(20, false);
        return width && height ? { width, height } : null;
    };

    const readJpegDimensions = (bytes) => {
        if (bytes.length < 11 || !hasBytePrefix(bytes, [0xff, 0xd8, 0xff])) {
            return null;
        }

        const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
        let offset = 2;
        while (offset + 8 < bytes.length) {
            if (bytes[offset] !== 0xff) {
                offset += 1;
                continue;
            }
            while (offset < bytes.length && bytes[offset] === 0xff) {
                offset += 1;
            }
            const marker = bytes[offset];
            offset += 1;
            if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) {
                continue;
            }
            if (marker === 0xda || marker === 0xd9 || offset + 1 >= bytes.length) {
                break;
            }
            const segmentLength = (bytes[offset] << 8) | bytes[offset + 1];
            if (segmentLength < 2 || offset + segmentLength > bytes.length) {
                return null;
            }
            if (sofMarkers.has(marker) && segmentLength >= 7) {
                const height = (bytes[offset + 3] << 8) | bytes[offset + 4];
                const width = (bytes[offset + 5] << 8) | bytes[offset + 6];
                return width && height ? { width, height } : null;
            }
            offset += segmentLength;
        }
        return null;
    };

    const getProfilePhotoExtent = (dimensions) => {
        const maxWidth = 914400;
        const maxHeight = 914400;
        if (!dimensions?.width || !dimensions?.height) {
            return { cx: maxWidth, cy: maxHeight };
        }
        const scale = Math.min(maxWidth / dimensions.width, maxHeight / dimensions.height);
        return {
            cx: Math.max(1, Math.round(dimensions.width * scale)),
            cy: Math.max(1, Math.round(dimensions.height * scale)),
        };
    };

    const parseProfilePhotoDataUrl = (value = '') => {
        const source = String(value || '').trim();
        if (!source || source.length > MAX_PROFILE_PHOTO_DATA_URL_LENGTH) {
            return null;
        }

        // WebP is intentionally ignored: PNG and JPEG have substantially more
        // predictable rendering across desktop Word, Word Online and LibreOffice.
        const match = source.match(/^data:image\/(png|jpe?g);base64,([A-Za-z0-9+/=\s]+)$/i);
        if (!match) {
            return null;
        }
        const bytes = decodeBase64Bytes(match[2]);
        if (!bytes) {
            return null;
        }

        const declaredType = match[1].toLowerCase();
        const isPng = declaredType === 'png';
        const dimensions = isPng ? readPngDimensions(bytes) : readJpegDimensions(bytes);
        if (!dimensions) {
            return null;
        }

        const extension = isPng ? 'png' : 'jpeg';
        return {
            bytes,
            contentType: isPng ? 'image/png' : 'image/jpeg',
            extension,
            extent: getProfilePhotoExtent(dimensions),
            name: `word/media/profile-photo.${extension}`,
            target: `media/profile-photo.${extension}`,
            relationshipId: PROFILE_PHOTO_RELATIONSHIP_ID,
        };
    };

    const makeCrc32Table = () => {
        const table = new Uint32Array(256);
        for (let index = 0; index < 256; index += 1) {
            let value = index;
            for (let bit = 0; bit < 8; bit += 1) {
                value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
            }
            table[index] = value >>> 0;
        }
        return table;
    };

    const crc32Table = makeCrc32Table();
    const crc32 = (bytes) => {
        let checksum = 0xffffffff;
        toUint8Array(bytes).forEach((byte) => {
            checksum = crc32Table[(checksum ^ byte) & 0xff] ^ (checksum >>> 8);
        });
        return (checksum ^ 0xffffffff) >>> 0;
    };

    const setUint16 = (view, offset, value) => view.setUint16(offset, value, true);
    const setUint32 = (view, offset, value) => view.setUint32(offset, value >>> 0, true);

    const getDosTimestamp = (date = new Date()) => {
        const safeYear = Math.max(1980, Math.min(2107, date.getFullYear()));
        return {
            time: ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | ((Math.floor(date.getSeconds() / 2)) & 0x1f),
            date: (((safeYear - 1980) & 0x7f) << 9) | (((date.getMonth() + 1) & 0x0f) << 5) | (date.getDate() & 0x1f),
        };
    };

    // DOCX is a ZIP package. Stored (uncompressed) entries are deliberately
    // used here: Word, LibreOffice and Google Docs all accept them, and this
    // keeps the export local, deterministic and independent from a CDN.
    const createZip = (files = []) => {
        const localParts = [];
        const centralParts = [];
        const timestamp = getDosTimestamp();
        let localOffset = 0;

        files.forEach(({ name, content }) => {
            const nameBytes = textEncoder.encode(name);
            const dataBytes = toUint8Array(content);
            const checksum = crc32(dataBytes);
            const localHeader = new Uint8Array(30);
            const localView = new DataView(localHeader.buffer);
            setUint32(localView, 0, 0x04034b50);
            setUint16(localView, 4, 20);
            setUint16(localView, 6, 0x0800);
            setUint16(localView, 8, 0);
            setUint16(localView, 10, timestamp.time);
            setUint16(localView, 12, timestamp.date);
            setUint32(localView, 14, checksum);
            setUint32(localView, 18, dataBytes.length);
            setUint32(localView, 22, dataBytes.length);
            setUint16(localView, 26, nameBytes.length);
            setUint16(localView, 28, 0);
            localParts.push(localHeader, nameBytes, dataBytes);

            const centralHeader = new Uint8Array(46);
            const centralView = new DataView(centralHeader.buffer);
            setUint32(centralView, 0, 0x02014b50);
            setUint16(centralView, 4, 20);
            setUint16(centralView, 6, 20);
            setUint16(centralView, 8, 0x0800);
            setUint16(centralView, 10, 0);
            setUint16(centralView, 12, timestamp.time);
            setUint16(centralView, 14, timestamp.date);
            setUint32(centralView, 16, checksum);
            setUint32(centralView, 20, dataBytes.length);
            setUint32(centralView, 24, dataBytes.length);
            setUint16(centralView, 28, nameBytes.length);
            setUint16(centralView, 30, 0);
            setUint16(centralView, 32, 0);
            setUint16(centralView, 34, 0);
            setUint16(centralView, 36, 0);
            setUint32(centralView, 38, 0);
            setUint32(centralView, 42, localOffset);
            centralParts.push(centralHeader, nameBytes);
            localOffset += localHeader.length + nameBytes.length + dataBytes.length;
        });

        const centralDirectory = concatBytes(centralParts);
        const end = new Uint8Array(22);
        const endView = new DataView(end.buffer);
        setUint32(endView, 0, 0x06054b50);
        setUint16(endView, 4, 0);
        setUint16(endView, 6, 0);
        setUint16(endView, 8, files.length);
        setUint16(endView, 10, files.length);
        setUint32(endView, 12, centralDirectory.length);
        setUint32(endView, 16, localOffset);
        setUint16(endView, 20, 0);
        return concatBytes([...localParts, centralDirectory, end]);
    };

    const isValidXmlCodePoint = (codePoint) => codePoint === 0x09
        || codePoint === 0x0a
        || codePoint === 0x0d
        || (codePoint >= 0x20 && codePoint <= 0xd7ff)
        || (codePoint >= 0xe000 && codePoint <= 0xfffd)
        || (codePoint >= 0x10000 && codePoint <= 0x10ffff);

    const cleanXmlText = (value = '') => Array.from(String(value ?? ''))
        .filter((character) => isValidXmlCodePoint(character.codePointAt(0)))
        .join('');

    const escapeXml = (value = '') => cleanXmlText(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    const unescapeXml = (value = '') => String(value || '')
        .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
        .replace(/&#([0-9]+);/g, (_, number) => String.fromCodePoint(Number.parseInt(number, 10)))
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&');

    const normalizeVisibleText = (value = '') => String(value || '')
        .replace(/\s+/g, ' ')
        .trim();

    const fingerprintVisibleText = (value = '') => {
        const bytes = textEncoder.encode(normalizeVisibleText(value));
        let hash = 0xcbf29ce484222325n;
        bytes.forEach((byte) => {
            hash ^= BigInt(byte);
            hash = BigInt.asUintN(64, hash * 0x100000001b3n);
        });
        return `${bytes.length.toString(16)}-${hash.toString(16).padStart(16, '0')}`;
    };

    const normalizeHex = (value, fallback = '2F3F7F') => {
        const hex = String(value || '').replace(/^#/, '').trim();
        return /^[0-9a-f]{6}$/i.test(hex) ? hex.toUpperCase() : fallback;
    };

    const mixHex = (left, right, weight = 0.9) => {
        const first = normalizeHex(left);
        const second = normalizeHex(right, 'FFFFFF');
        const ratio = Math.max(0, Math.min(1, Number(weight) || 0));
        return [0, 2, 4].map((offset) => {
            const start = Number.parseInt(first.slice(offset, offset + 2), 16);
            const end = Number.parseInt(second.slice(offset, offset + 2), 16);
            return Math.round(start * (1 - ratio) + end * ratio).toString(16).padStart(2, '0');
        }).join('').toUpperCase();
    };

    const getContrastColor = (hex) => {
        const color = normalizeHex(hex);
        const channels = [0, 2, 4].map((offset) => Number.parseInt(color.slice(offset, offset + 2), 16));
        const luminance = (0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]) / 255;
        return luminance < 0.58 ? 'FFFFFF' : '172033';
    };

    const getWordFont = (fontFamily = '', template = '') => {
        if (/elegant/i.test(template) || /baskerville|playfair|times|georgia/i.test(fontFamily)) {
            return 'Georgia';
        }
        if (/roboto|lato|inter|manrope|ibm plex|arial/i.test(fontFamily)) {
            return 'Arial';
        }
        return 'Aptos';
    };

    const makeRun = (text = '', options = {}) => {
        if (text === '') {
            return '';
        }
        const properties = [
            options.bold ? '<w:b/>' : '',
            options.italic ? '<w:i/>' : '',
            options.hidden ? '<w:vanish/>' : '',
            options.color ? `<w:color w:val="${normalizeHex(options.color, '172033')}"/>` : '',
            options.size ? `<w:sz w:val="${Math.round(Number(options.size) * 2)}"/><w:szCs w:val="${Math.round(Number(options.size) * 2)}"/>` : '',
        ].join('');
        return `<w:r>${properties ? `<w:rPr>${properties}</w:rPr>` : ''}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`;
    };

    const makeParagraph = (text = '', options = {}) => {
        const properties = [
            options.style ? `<w:pStyle w:val="${escapeXml(options.style)}"/>` : '',
            options.keepNext ? '<w:keepNext/>' : '',
            options.keepLines ? '<w:keepLines/>' : '',
            options.numId ? `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="${Number(options.numId)}"/></w:numPr>` : '',
            options.borderBottom ? `<w:pBdr><w:bottom w:val="single" w:sz="${options.borderBottom.size || 8}" w:space="${options.borderBottom.space || 2}" w:color="${normalizeHex(options.borderBottom.color, 'D9DEEA')}"/></w:pBdr>` : '',
            options.shading ? `<w:shd w:val="clear" w:color="auto" w:fill="${normalizeHex(options.shading, 'FFFFFF')}"/>` : '',
            options.spacing ? `<w:spacing ${options.spacing}/>` : '',
            options.indent ? `<w:ind w:left="${Number(options.indent)}"/>` : '',
            options.align ? `<w:jc w:val="${escapeXml(options.align)}"/>` : '',
        ].filter(Boolean).join('');
        const runs = options.runs
            ? options.runs.map((run) => makeRun(run.text, run)).join('')
            : makeRun(text, options);
        return `<w:p>${properties ? `<w:pPr>${properties}</w:pPr>` : ''}${runs}</w:p>`;
    };

    const makeInlineImageParagraph = (photo) => {
        if (!photo?.relationshipId || !photo?.extent) {
            return '<w:p/>';
        }
        const cx = Math.max(1, Math.round(Number(photo.extent.cx) || 914400));
        const cy = Math.max(1, Math.round(Number(photo.extent.cy) || 914400));
        const imageName = `profile-photo.${photo.extension || 'png'}`;
        return [
            '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:drawing>',
            '<wp:inline distT="0" distB="0" distL="0" distR="0">',
            `<wp:extent cx="${cx}" cy="${cy}"/>`,
            '<wp:effectExtent l="0" t="0" r="0" b="0"/>',
            '<wp:docPr id="1" name="Profile photo" descr="Profile photo"/>',
            '<wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>',
            '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">',
            '<pic:pic><pic:nvPicPr>',
            `<pic:cNvPr id="0" name="${escapeXml(imageName)}" descr="Profile photo"/>`,
            '<pic:cNvPicPr/></pic:nvPicPr>',
            `<pic:blipFill><a:blip r:embed="${escapeXml(photo.relationshipId)}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>`,
            `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>`,
            '</pic:pic></a:graphicData></a:graphic>',
            '</wp:inline></w:drawing></w:r></w:p>',
        ].join('');
    };

    const makeCell = (content, width, options = {}) => {
        const cellContent = Array.isArray(content) ? content.join('') : String(content || '');
        const cellProperties = [
            `<w:tcW w:w="${Number(width)}" w:type="dxa"/>`,
            options.gridSpan ? `<w:gridSpan w:val="${Number(options.gridSpan)}"/>` : '',
            options.shading ? `<w:shd w:val="clear" w:color="auto" w:fill="${normalizeHex(options.shading, 'FFFFFF')}"/>` : '',
            '<w:tcMar><w:top w:w="70" w:type="dxa"/><w:left w:w="95" w:type="dxa"/><w:bottom w:w="70" w:type="dxa"/><w:right w:w="95" w:type="dxa"/></w:tcMar>',
            '<w:vAlign w:val="center"/>',
        ].filter(Boolean).join('');
        return `<w:tc><w:tcPr>${cellProperties}</w:tcPr>${cellContent || '<w:p/>'}</w:tc>`;
    };

    const makeTable = (rows, widths, options = {}) => {
        const totalWidth = widths.reduce((total, width) => total + width, 0);
        const borderColor = normalizeHex(options.borderColor, 'D9DEEA');
        const borderSize = options.borderSize ?? 5;
        const borders = options.borders === false
            ? '<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>'
            : `<w:tblBorders><w:top w:val="single" w:sz="${borderSize}" w:color="${borderColor}"/><w:left w:val="single" w:sz="${borderSize}" w:color="${borderColor}"/><w:bottom w:val="single" w:sz="${borderSize}" w:color="${borderColor}"/><w:right w:val="single" w:sz="${borderSize}" w:color="${borderColor}"/><w:insideH w:val="${options.insideBorders ? 'single' : 'nil'}" w:sz="${borderSize}" w:color="${borderColor}"/><w:insideV w:val="${options.insideBorders ? 'single' : 'nil'}" w:sz="${borderSize}" w:color="${borderColor}"/></w:tblBorders>`;
        return [
            '<w:tbl>',
            `<w:tblPr><w:tblW w:w="${totalWidth}" w:type="dxa"/><w:tblInd w:w="0" w:type="dxa"/>${borders}<w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="0" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar><w:tblLook w:val="0000" w:firstRow="0" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="1" w:noVBand="1"/></w:tblPr>`,
            `<w:tblGrid>${widths.map((width) => `<w:gridCol w:w="${width}"/>`).join('')}</w:tblGrid>`,
            ...rows.map((cells) => `<w:tr><w:trPr><w:cantSplit/></w:trPr>${cells.join('')}</w:tr>`),
            '</w:tbl>',
        ].join('');
    };

    const makeSectionTitle = (title, palette) => makeParagraph(title, {
        style: 'SectionTitle',
        keepNext: true,
        borderBottom: { color: palette.accent, size: 9, space: 2 },
    });

    const makeTwoColumnList = (items = [], palette) => {
        const rows = [];
        for (let index = 0; index < items.length; index += 2) {
            rows.push([
                makeCell(makeParagraph(items[index] || '', { style: 'ListBullet', numId: 1 }), 5188, { shading: palette.soft }),
                makeCell(items[index + 1] ? makeParagraph(items[index + 1], { style: 'ListBullet', numId: 1 }) : '<w:p/>', 5188, { shading: palette.soft }),
            ]);
        }
        return makeTable(rows, [5188, 5188], { borders: false });
    };

    const makeTimeline = (entries = [], palette, compact = false) => entries.map((entry) => {
        const rows = [[
            makeCell(makeParagraph(entry.title || '', { style: compact ? 'EntryTitleCompact' : 'EntryTitle', keepNext: true }), 7900, { shading: palette.card }),
            makeCell(makeParagraph(entry.date || '', { style: 'EntryDate', align: 'right', keepNext: true }), 2476, { shading: palette.card }),
        ]];
        if (entry.meta) {
            rows.push([makeCell(makeParagraph(entry.meta, { style: 'EntryMeta', keepNext: true }), 10376, { gridSpan: 2, shading: palette.card })]);
        }
        (entry.bullets || []).forEach((bullet) => {
            rows.push([makeCell(makeParagraph(bullet, { style: 'ListBulletCompact', numId: 1 }), 10376, { gridSpan: 2, shading: palette.card })]);
        });
        return `${makeTable(rows, [7900, 2476], { borderColor: palette.frame, borderSize: 4 })}${makeParagraph('', { spacing: 'w:after="28" w:line="20" w:lineRule="exact"' })}`;
    }).join('');

    const makeHeader = (data, palette, profilePhoto = null) => {
        const richHeader = ['modern', 'digital', 'holographic', 'premium', 'creative'].includes(String(data.template || '').toLowerCase());
        const fill = richHeader ? palette.accent : palette.paper;
        const primaryColor = richHeader ? getContrastColor(fill) : '172033';
        const secondaryColor = richHeader ? getContrastColor(fill) : palette.accent;
        const contents = [
            makeParagraph(data.fullName || '', {
                style: 'DocumentTitle',
                runs: [{ text: data.fullName || '', bold: true, color: primaryColor, size: 21 }],
                keepNext: true,
            }),
            data.metaParts?.length ? makeParagraph(data.metaParts.join(' | '), {
                style: 'ContactLine',
                runs: [{ text: data.metaParts.join(' | '), color: primaryColor, size: 8.5 }],
                keepNext: true,
            }) : '',
            makeParagraph(data.headline || '', {
                style: 'Headline',
                runs: [{ text: data.headline || '', bold: true, color: secondaryColor, size: 11 }],
                keepNext: true,
            }),
        ].filter(Boolean).join('');
        const rows = profilePhoto
            ? [[
                makeCell(contents, 8626, { shading: fill }),
                makeCell(makeInlineImageParagraph(profilePhoto), 1750, { shading: fill }),
            ]]
            : [[makeCell(contents, 10376, { shading: fill })]];
        const widths = profilePhoto ? [8626, 1750] : [10376];
        return `${makeTable(rows, widths, { borderColor: palette.frame, borderSize: 5 })}${makeParagraph('', { spacing: 'w:after="55" w:line="20" w:lineRule="exact"' })}`;
    };

    const getPalette = (data = {}) => {
        const accent = normalizeHex(data.accent, '2F3F7F');
        const paper = normalizeHex(data.paper, 'FFFFFF');
        const frame = normalizeHex(data.frame, 'D9DEEA');
        return {
            accent,
            paper,
            frame,
            soft: normalizeHex(data.soft, mixHex(accent, 'FFFFFF', 0.9)),
            card: mixHex(accent, paper, 0.96),
        };
    };

    const getOrderedSectionKeys = (data = {}) => {
        const available = ['summary', 'skills', 'experience', 'projects', 'education', 'languages', 'activities'];
        const requested = Array.isArray(data.sectionOrder) ? data.sectionOrder : [];
        return [...new Set([...requested.filter((key) => available.includes(key)), ...available])];
    };

    const makeCvBody = (data, palette) => {
        const labels = data.labels || {};
        const builders = {
            summary: () => data.summary
                ? `${makeSectionTitle(labels.summary || 'Profile', palette)}${makeParagraph(data.summary, { style: 'BodyText' })}`
                : '',
            skills: () => data.skills?.length
                ? `${makeSectionTitle(labels.skills || 'Skills', palette)}${makeTwoColumnList(data.skills, palette)}`
                : '',
            experience: () => data.experiences?.length
                ? `${makeSectionTitle(labels.experience || 'Professional experience', palette)}${makeTimeline(data.experiences, palette)}`
                : '',
            projects: () => data.projects?.length
                ? `${makeSectionTitle(labels.projects || 'Projects', palette)}${makeTimeline(data.projects, palette, true)}`
                : '',
            education: () => data.education?.length
                ? `${makeSectionTitle(labels.education || 'Education', palette)}${makeTimeline(data.education, palette, true)}`
                : '',
            languages: () => data.languages?.length
                ? `${makeSectionTitle(labels.languages || 'Languages', palette)}${makeTwoColumnList(data.languages, palette)}`
                : '',
            activities: () => data.activities?.length
                ? `${makeSectionTitle(labels.activities || 'Activities', palette)}${makeTwoColumnList(data.activities, palette)}`
                : '',
        };
        return getOrderedSectionKeys(data).map((key) => builders[key]()).join('');
    };

    const makeHiddenRoundTripParagraphs = (marker = '') => {
        const compactMarker = String(marker || '').replace(/\s+/g, '');
        return compactMarker
            ? makeParagraph('', {
                spacing: 'w:before="0" w:after="0" w:line="20" w:lineRule="exact"',
                runs: [{ text: compactMarker, hidden: true, size: 1 }],
            })
            : '';
    };

    const buildStylesXml = (font, palette) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${escapeXml(font)}" w:hAnsi="${escapeXml(font)}" w:eastAsia="${escapeXml(font)}"/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="172033"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="20" w:line="225" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:rPr><w:rFonts w:ascii="${escapeXml(font)}" w:hAnsi="${escapeXml(font)}"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="DocumentTitle"><w:name w:val="CV Name"/><w:basedOn w:val="Normal"/><w:next w:val="ContactLine"/><w:qFormat/><w:pPr><w:spacing w:before="0" w:after="18" w:line="430" w:lineRule="exact"/></w:pPr><w:rPr><w:b/><w:sz w:val="42"/><w:szCs w:val="42"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="ContactLine"><w:name w:val="CV Contact"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="0" w:after="20" w:line="190" w:lineRule="exact"/></w:pPr><w:rPr><w:sz w:val="17"/><w:szCs w:val="17"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Headline"><w:name w:val="CV Headline"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="0" w:after="0" w:line="245" w:lineRule="exact"/></w:pPr><w:rPr><w:b/><w:color w:val="${palette.accent}"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="SectionTitle"><w:name w:val="CV Section"/><w:basedOn w:val="Normal"/><w:next w:val="BodyText"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="72" w:after="30" w:line="220" w:lineRule="exact"/></w:pPr><w:rPr><w:b/><w:caps/><w:color w:val="${palette.accent}"/><w:sz w:val="19"/><w:szCs w:val="19"/><w:spacing w:val="16"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="BodyText"><w:name w:val="CV Body"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="0" w:after="35" w:line="220" w:lineRule="auto"/></w:pPr><w:rPr><w:color w:val="3D4658"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="EntryTitle"><w:name w:val="CV Entry Title"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="0" w:after="8" w:line="205" w:lineRule="exact"/></w:pPr><w:rPr><w:b/><w:color w:val="172033"/><w:sz w:val="19"/><w:szCs w:val="19"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="EntryTitleCompact"><w:name w:val="CV Entry Title Compact"/><w:basedOn w:val="EntryTitle"/><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="EntryDate"><w:name w:val="CV Entry Date"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="0" w:after="8" w:line="190" w:lineRule="exact"/></w:pPr><w:rPr><w:b/><w:color w:val="${palette.accent}"/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="EntryMeta"><w:name w:val="CV Entry Meta"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="0" w:after="8" w:line="190" w:lineRule="exact"/></w:pPr><w:rPr><w:b/><w:color w:val="5A6375"/><w:sz w:val="17"/><w:szCs w:val="17"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="CV Bullet"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="0" w:after="10" w:line="205" w:lineRule="auto"/><w:ind w:left="250" w:hanging="170"/></w:pPr><w:rPr><w:color w:val="3D4658"/><w:sz w:val="17"/><w:szCs w:val="17"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="ListBulletCompact"><w:name w:val="CV Bullet Compact"/><w:basedOn w:val="ListBullet"/><w:pPr><w:spacing w:before="0" w:after="5" w:line="190" w:lineRule="auto"/><w:ind w:left="250" w:hanging="170"/></w:pPr><w:rPr><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr></w:style>
</w:styles>`;

    const buildNumberingXml = (accent) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="250"/></w:tabs><w:ind w:left="250" w:hanging="170"/></w:pPr><w:rPr><w:color w:val="${accent}"/><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/></w:rPr></w:lvl></w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>`;

    const buildDocumentXml = (data, marker = '', profilePhoto = null) => {
        const palette = getPalette(data);
        const visibleBody = `${makeHeader(data, palette, profilePhoto)}${makeCvBody(data, palette)}`;
        const visibleText = extractDocumentTextFromXml(`<w:body>${visibleBody}</w:body>`);
        const roundTripData = marker
            ? `${DOCX_FINGERPRINT_PREFIX}${fingerprintVisibleText(visibleText)}\n${marker}`
            : '';
        const body = `${visibleBody}${makeHiddenRoundTripParagraphs(roundTripData)}`;
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:background w:color="${palette.paper}"/><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="680" w:right="765" w:bottom="680" w:left="765" w:header="360" w:footer="360" w:gutter="0"/><w:pgBorders w:offsetFrom="page"><w:top w:val="single" w:sz="8" w:space="18" w:color="${palette.frame}"/><w:left w:val="single" w:sz="8" w:space="18" w:color="${palette.frame}"/><w:bottom w:val="single" w:sz="8" w:space="18" w:color="${palette.frame}"/><w:right w:val="single" w:sz="8" w:space="18" w:color="${palette.frame}"/></w:pgBorders><w:docGrid w:linePitch="280"/></w:sectPr></w:body></w:document>`;
    };

    const buildLetterDocumentXml = (data, marker = '') => {
        const palette = getPalette(data);
        const bodyParagraphs = String(data.body || '')
            .split(/\r?\n/)
            .map((line) => line.trim() ? makeParagraph(line, { style: 'BodyText' }) : makeParagraph(''))
            .join('');
        const content = [
            makeParagraph(data.fullName || '', { style: 'DocumentTitle' }),
            makeParagraph(data.headline || '', { style: 'Headline' }),
            makeParagraph('', { spacing: 'w:after="160"' }),
            makeParagraph(data.subject || '', { runs: [{ text: data.subject || '', bold: true, color: palette.accent, size: 11 }], keepNext: true }),
            makeParagraph('', { spacing: 'w:after="85"' }),
            bodyParagraphs,
            data.contactFooter ? makeParagraph(data.contactFooter, { borderBottom: { color: palette.frame }, align: 'center' }) : '',
            makeHiddenRoundTripParagraphs(marker),
        ].filter(Boolean).join('');
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:background w:color="${palette.paper}"/><w:body>${content}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1020" w:right="1020" w:bottom="1020" w:left="1020" w:header="360" w:footer="360" w:gutter="0"/></w:sectPr></w:body></w:document>`;
    };

    const buildContentTypesXml = (media = []) => {
        const imageDefaults = [...new Map(media.map((item) => [item.extension, item.contentType])).entries()]
            .map(([extension, contentType]) => `<Default Extension="${escapeXml(extension)}" ContentType="${escapeXml(contentType)}"/>`)
            .join('');
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${imageDefaults}<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`;
    };

    const rootRelationshipsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`;

    const buildDocumentRelationshipsXml = (media = []) => {
        const mediaRelationships = media.map((item) => `<Relationship Id="${escapeXml(item.relationshipId)}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${escapeXml(item.target)}"/>`).join('');
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>${mediaRelationships}</Relationships>`;
    };

    const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:displayBackgroundShape/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`;

    const buildCorePropertiesXml = (title) => {
        const createdAt = new Date().toISOString();
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${escapeXml(title)}</dc:title><dc:creator>SA Création Web</dc:creator><cp:lastModifiedBy>SA Création Web</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${createdAt}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${createdAt}</dcterms:modified></cp:coreProperties>`;
    };

    const appPropertiesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>SA Création Web - KirbyCV</Application><AppVersion>1.0</AppVersion></Properties>`;

    const createDocxBytes = ({ documentXml, stylesXml, numberingXml, title, media = [] }) => createZip([
        { name: '[Content_Types].xml', content: buildContentTypesXml(media) },
        { name: '_rels/.rels', content: rootRelationshipsXml },
        { name: 'docProps/core.xml', content: buildCorePropertiesXml(title) },
        { name: 'docProps/app.xml', content: appPropertiesXml },
        { name: 'word/document.xml', content: documentXml },
        { name: 'word/styles.xml', content: stylesXml },
        { name: 'word/numbering.xml', content: numberingXml },
        { name: 'word/settings.xml', content: settingsXml },
        { name: 'word/_rels/document.xml.rels', content: buildDocumentRelationshipsXml(media) },
        ...media.map((item) => ({ name: item.name, content: item.bytes })),
    ]);

    const createCvDocxBytes = (data = {}, marker = '') => {
        const palette = getPalette(data);
        const font = getWordFont(data.fontFamily, data.template);
        const profilePhoto = parseProfilePhotoDataUrl(data.profilePhotoDataUrl);
        const media = profilePhoto ? [profilePhoto] : [];
        return createDocxBytes({
            documentXml: buildDocumentXml(data, marker, profilePhoto),
            stylesXml: buildStylesXml(font, palette),
            numberingXml: buildNumberingXml(palette.accent),
            title: `CV - ${data.fullName || ''}`.trim(),
            media,
        });
    };

    const createLetterDocxBytes = (data = {}, marker = '') => {
        const palette = getPalette(data);
        const font = getWordFont(data.fontFamily, data.template);
        return createDocxBytes({
            documentXml: buildLetterDocumentXml(data, marker),
            stylesXml: buildStylesXml(font, palette),
            numberingXml: buildNumberingXml(palette.accent),
            title: `Lettre de motivation - ${data.fullName || ''}`.trim(),
        });
    };

    const findEndOfCentralDirectory = (bytes) => {
        for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65557); offset -= 1) {
            if (new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0, true) === 0x06054b50) {
                return offset;
            }
        }
        return -1;
    };

    const getZipEntry = (source, requestedName) => {
        const bytes = toUint8Array(source);
        const endOffset = findEndOfCentralDirectory(bytes);
        if (endOffset < 0) {
            return null;
        }
        const endView = new DataView(bytes.buffer, bytes.byteOffset + endOffset, 22);
        const entryCount = endView.getUint16(10, true);
        let offset = endView.getUint32(16, true);

        for (let index = 0; index < entryCount; index += 1) {
            const view = new DataView(bytes.buffer, bytes.byteOffset + offset, 46);
            if (view.getUint32(0, true) !== 0x02014b50) {
                return null;
            }
            const compression = view.getUint16(10, true);
            const compressedSize = view.getUint32(20, true);
            const uncompressedSize = view.getUint32(24, true);
            const nameLength = view.getUint16(28, true);
            const extraLength = view.getUint16(30, true);
            const commentLength = view.getUint16(32, true);
            const localHeaderOffset = view.getUint32(42, true);
            const name = textDecoder.decode(bytes.slice(offset + 46, offset + 46 + nameLength));
            if (name === requestedName) {
                const localView = new DataView(bytes.buffer, bytes.byteOffset + localHeaderOffset, 30);
                if (localView.getUint32(0, true) !== 0x04034b50) {
                    return null;
                }
                const localNameLength = localView.getUint16(26, true);
                const localExtraLength = localView.getUint16(28, true);
                const dataOffset = localHeaderOffset + 30 + localNameLength + localExtraLength;
                return {
                    compression,
                    compressedSize,
                    uncompressedSize,
                    bytes: bytes.slice(dataOffset, dataOffset + compressedSize),
                };
            }
            offset += 46 + nameLength + extraLength + commentLength;
        }
        return null;
    };

    const inflateRaw = async (bytes) => {
        if (typeof DecompressionStream !== 'function') {
            throw new Error('docx_decompression_unavailable');
        }
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        return new Uint8Array(await new Response(stream).arrayBuffer());
    };

    const readDocxEntryBytes = async (source, name) => {
        const entry = getZipEntry(source, name);
        if (!entry) {
            return new Uint8Array();
        }
        if (entry.compression === 0) {
            return entry.bytes;
        }
        if (entry.compression === 8) {
            return inflateRaw(entry.bytes);
        }
        throw new Error('docx_compression_not_supported');
    };

    const readDocxXmlEntry = async (source, name) => textDecoder.decode(
        await readDocxEntryBytes(source, name)
    );

    const encodeBase64Bytes = (bytes) => {
        const source = toUint8Array(bytes);
        if (!source.length || source.length > MAX_PROFILE_PHOTO_BYTES || typeof globalScope.btoa !== 'function') {
            return '';
        }

        let binary = '';
        const chunkSize = 0x8000;
        for (let offset = 0; offset < source.length; offset += chunkSize) {
            binary += String.fromCharCode(...source.subarray(offset, offset + chunkSize));
        }
        return globalScope.btoa(binary);
    };

    const getXmlAttribute = (xml = '', attributeName = '') => {
        const escapedName = String(attributeName || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const match = String(xml || '').match(new RegExp(`\\b${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'));
        return unescapeXml(match?.[1] ?? match?.[2] ?? '');
    };

    const getProfilePhotoRelationshipId = (documentXml = '') => {
        const inlineDrawings = String(documentXml || '').match(/<wp:inline\b[\s\S]*?<\/wp:inline>/gi) || [];
        for (const drawing of inlineDrawings) {
            const docProperties = drawing.match(/<wp:docPr\b[^>]*\/?\s*>/i)?.[0] || '';
            const name = getXmlAttribute(docProperties, 'name').trim().toLowerCase();
            const description = getXmlAttribute(docProperties, 'descr').trim().toLowerCase();
            if (name !== 'profile photo' && description !== 'profile photo') {
                continue;
            }
            const imageReference = drawing.match(/<a:blip\b[^>]*\/?\s*>/i)?.[0] || '';
            const relationshipId = getXmlAttribute(imageReference, 'r:embed').trim();
            if (relationshipId) {
                return relationshipId;
            }
        }
        return '';
    };

    const resolveProfilePhotoEntryName = (relationshipsXml = '', relationshipId = '') => {
        if (!relationshipId) {
            return '';
        }
        const relationships = String(relationshipsXml || '').match(/<Relationship\b[^>]*\/?\s*>/gi) || [];
        const relationship = relationships.find((entry) => (
            getXmlAttribute(entry, 'Id') === relationshipId &&
            /\/relationships\/image$/i.test(getXmlAttribute(entry, 'Type'))
        ));
        if (!relationship) {
            return '';
        }

        const target = getXmlAttribute(relationship, 'Target')
            .replace(/\\/g, '/')
            .replace(/^\.\//, '');
        const entryName = target.startsWith('/word/')
            ? target.slice(1)
            : target.startsWith('media/')
                ? `word/${target}`
                : '';
        return /^word\/media\/[^/]+\.(?:png|jpe?g)$/i.test(entryName) ? entryName : '';
    };

    const extractProfilePhoto = async (source, documentXml = '') => {
        const xml = documentXml || await readDocxXmlEntry(source, 'word/document.xml');
        const relationshipId = getProfilePhotoRelationshipId(xml);
        if (!relationshipId) {
            return null;
        }

        const relationshipsXml = await readDocxXmlEntry(source, 'word/_rels/document.xml.rels');
        const entryName = resolveProfilePhotoEntryName(relationshipsXml, relationshipId);
        if (!entryName) {
            return null;
        }

        const bytes = await readDocxEntryBytes(source, entryName);
        if (!bytes.length || bytes.length > MAX_PROFILE_PHOTO_BYTES) {
            return null;
        }

        const isPng = /\.png$/i.test(entryName);
        const dimensions = isPng ? readPngDimensions(bytes) : readJpegDimensions(bytes);
        if (!dimensions) {
            return null;
        }
        const encoded = encodeBase64Bytes(bytes);
        const mimeType = isPng ? 'image/png' : 'image/jpeg';
        const dataUrl = encoded ? `data:${mimeType};base64,${encoded}` : '';
        if (!dataUrl || dataUrl.length > MAX_PROFILE_PHOTO_DATA_URL_LENGTH) {
            return null;
        }

        return {
            schemaVersion: 1,
            type: 'profile-photo',
            source: 'word-import',
            dataUrl,
            mimeType,
            width: dimensions.width,
            height: dimensions.height,
            originalWidth: dimensions.width,
            originalHeight: dimensions.height,
            pageNumber: 1,
            placement: { xRatio: 0, yRatio: 0, widthRatio: 0, heightRatio: 0 },
            score: 100,
        };
    };

    const extractDocumentTextFromXml = (xml = '') => unescapeXml(String(xml || '')
        .replace(/<w:tab\b[^>]*\/>/gi, '\t')
        .replace(/<w:br\b[^>]*\/>/gi, '\n')
        .replace(/<\/w:tc>/gi, '\t')
        .replace(/<\/w:tr>/gi, '\n')
        .replace(/<\/w:p>/gi, '\n')
        .replace(/<[^>]+>/g, ''))
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    const removeHiddenRunsFromXml = (xml = '') => String(xml || '').replace(
        /<w:r\b[^>]*>[\s\S]*?<\/w:r>/gi,
        (runXml) => /<w:vanish\b[^>]*\/>/i.test(runXml) ? '' : runXml
    );

    const extractVisibleDocumentTextFromXml = (xml = '') => extractDocumentTextFromXml(
        removeHiddenRunsFromXml(xml)
    );

    const extractDocumentText = async (source) => extractDocumentTextFromXml(
        await readDocxXmlEntry(source, 'word/document.xml')
    );

    const inspectRoundTrip = async (source, startMarker = 'SACW_CV_DATA_V1_START', endMarker = 'SACW_CV_DATA_V1_END') => {
        const xml = await readDocxXmlEntry(source, 'word/document.xml');
        const allText = extractDocumentTextFromXml(xml);
        const visibleText = extractVisibleDocumentTextFromXml(xml);
        const profilePhoto = await extractProfilePhoto(source, xml);
        const markerMatch = allText.match(new RegExp(`${startMarker}\\s*([A-Za-z0-9+/=\\s]+?)\\s*${endMarker}`));

        if (!markerMatch) {
            return { state: 'none', marker: '', visibleText, profilePhoto };
        }

        const fingerprintMatch = allText.match(new RegExp(`${DOCX_FINGERPRINT_PREFIX}([0-9a-f]+-[0-9a-f]{16})`, 'i'));
        const expectedFingerprint = fingerprintMatch?.[1]?.toLowerCase() || '';
        const currentFingerprint = fingerprintVisibleText(visibleText).toLowerCase();
        if (!expectedFingerprint || expectedFingerprint !== currentFingerprint) {
            return { state: 'modified', marker: '', visibleText, profilePhoto };
        }

        return {
            state: 'valid',
            marker: `${startMarker}\n${markerMatch[1].replace(/\s+/g, '')}\n${endMarker}`,
            visibleText,
            profilePhoto,
        };
    };

    const extractRoundTripMarker = async (source, startMarker = 'SACW_CV_DATA_V1_START', endMarker = 'SACW_CV_DATA_V1_END') => {
        const inspection = await inspectRoundTrip(source, startMarker, endMarker);
        return inspection.state === 'valid' ? inspection.marker : '';
    };

    const makeDocxBlob = (bytes) => new Blob([bytes], { type: DOCX_MIME });

    globalScope.KirbyDocx = Object.freeze({
        DOCX_MIME,
        MAX_PROFILE_PHOTO_DATA_URL_LENGTH,
        createCvDocxBytes,
        createLetterDocxBytes,
        createCvDocxBlob: (data, marker) => makeDocxBlob(createCvDocxBytes(data, marker)),
        createLetterDocxBlob: (data, marker) => makeDocxBlob(createLetterDocxBytes(data, marker)),
        extractDocumentText,
        extractDocumentTextFromXml,
        extractVisibleDocumentTextFromXml,
        fingerprintVisibleText,
        inspectRoundTrip,
        extractProfilePhoto,
        extractRoundTripMarker,
        readDocxEntryBytes,
        readDocxXmlEntry,
    });
}(typeof window !== 'undefined' ? window : globalThis));
