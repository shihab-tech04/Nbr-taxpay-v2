import type { PaymentCertificateRecord } from './certificateUtils';

export async function exportCertificateElementToPdf(
  cert: PaymentCertificateRecord,
  paperElement: HTMLElement | null,
  variant: 'certificate' | 'receipt' = 'certificate'
): Promise<boolean> {
  if (typeof document === 'undefined' || !paperElement) {
    return false;
  }

  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas-pro'),
      import('jspdf'),
    ]);

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const scale = 2;
    const canvas = await html2canvas(paperElement, {
      backgroundColor: '#ffffff',
      logging: false,
      scale,
      ignoreElements: (el) => el.matches('button, .no-print'),
      onclone: (_clonedDoc, clonedPaper) => {
        clonedPaper.querySelectorAll<HTMLElement>('[data-pdf-scroll="true"]').forEach((viewport) => {
          viewport.style.overflow = 'visible';
          viewport.style.maxWidth = 'none';
          const table = viewport.querySelector('table');
          if (table) {
            table.style.minWidth = '0';
            table.style.width = '100%';
            table.querySelectorAll<HTMLElement>('th, td').forEach((cell) => {
              cell.style.minWidth = '0';
              cell.style.whiteSpace = 'normal';
              cell.style.overflowWrap = 'anywhere';
            });
          }
        });
      },
    });

    if (!canvas.width || !canvas.height) {
      return false;
    }

    const pdf = new jsPDF({ format: 'a4', unit: 'mm', compress: true });
    const margin = 12;
    const contentWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    const pixelsPerMm = canvas.width / contentWidth;
    const pageHeightPx = Math.floor((pdf.internal.pageSize.getHeight() - margin * 2) * pixelsPerMm);
    const paperTop = paperElement.getBoundingClientRect().top;

    const breaks = Array.from(paperElement.querySelectorAll('tr, article, header, section'))
      .map((el) => Math.floor((el.getBoundingClientRect().bottom - paperTop) * scale))
      .filter((pos) => pos > 0 && pos < canvas.height)
      .sort((a, b) => b - a);

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    const ctx = pageCanvas.getContext('2d');
    if (!ctx) {
      return false;
    }

    for (let start = 0; start < canvas.height; ) {
      const limit = Math.min(start + pageHeightPx, canvas.height);
      const end =
        limit === canvas.height
          ? limit
          : breaks.find((pos) => pos <= limit && pos >= start + pageHeightPx / 2) ?? limit;
      const sliceHeight = Math.max(1, end - start);
      pageCanvas.height = sliceHeight;
      ctx.clearRect(0, 0, canvas.width, sliceHeight);
      ctx.drawImage(canvas, 0, start, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
      if (start > 0) pdf.addPage();
      pdf.addImage(pageCanvas, 'PNG', margin, margin, contentWidth, sliceHeight / pixelsPerMm);
      start = end;
    }

    const prefix = variant === 'certificate' ? 'Payment-certificate-' : 'Payment-receipt-';
    const safeId = (variant === 'certificate' ? cert.certificateId : cert.challanNumber)
      .replace(/[^a-zA-Z0-9-]/g, '')
      .slice(0, 80);
    pdf.setProperties({
      title: `Sohojkor ${variant === 'certificate' ? 'Payment Certificate' : 'Sample Challan Receipt'} ${safeId}`,
    });
    pdf.save(`${prefix}${safeId}.pdf`);
    return true;
  } catch {
    return false;
  }
}
