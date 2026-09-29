(function (root) {
  'use strict';
  const layout = Object.freeze({ pageWidth: 297, pageHeight: 210, width: 85, height: 55, gap: 5, marginX: 61, marginY: 47.5 });
  // Landscape duplex, flip on the SHORT edge: mirror the column positions
  // on the reverse. Artwork stays upright; never mirror the artwork itself.
  function createPdf(jsPDF, front, back) {
    if (!front || !back) throw new Error('Les deux faces sont nécessaires.');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
    pdf.viewerPreferences({ PrintScaling: 'None', Duplex: 'DuplexFlipShortEdge' });
    for (let side = 0; side < 2; side++) {
      if (side) pdf.addPage('a4', 'landscape');
      pdf.setDrawColor(130);
      pdf.setLineWidth(0.1);
      for (let row = 0; row < 2; row++) for (let col = 0; col < 2; col++) {
        const frontX = layout.marginX + col * (layout.width + layout.gap);
        const x = side ? layout.pageWidth - frontX - layout.width : frontX;
        const y = layout.marginY + row * (layout.height + layout.gap);
        pdf.addImage(side ? back : front, 'PNG', x, y, layout.width, layout.height, side ? 'card-back' : 'card-front', 'FAST');
        for (const edgeX of [x, x + layout.width]) {
          pdf.line(edgeX, y - 2, edgeX, y - .5);
          pdf.line(edgeX, y + layout.height + .5, edgeX, y + layout.height + 2);
        }
        for (const edgeY of [y, y + layout.height]) {
          pdf.line(x - 2, edgeY, x - .5, edgeY);
          pdf.line(x + layout.width + .5, edgeY, x + layout.width + 2, edgeY);
        }
      }
    }
    return pdf;
  }
  root.KirbyCardSheet = { createPdf, layout };
})(typeof window === 'undefined' ? globalThis : window);
