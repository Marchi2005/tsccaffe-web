import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/** Render the complete quote preview as one image so email attachments keep the same layout. */
export async function createQuotePdfBase64(root: HTMLElement): Promise<string> {
    await document.fonts.ready;
    await Promise.all(Array.from(root.querySelectorAll('img')).map(image => image.decode().catch(() => undefined)));

    const originalShadow = root.style.boxShadow;
    const signatureSpaces = Array.from(root.querySelectorAll<HTMLElement>('[data-signature-space]'));
    const originalSignatureHeights = signatureSpaces.map(element => element.style.height);

    try {
        root.style.boxShadow = 'none';

        // Reclaim space from the signature areas as the quote grows, before scaling
        // the complete page down to fit A4. Keep a small minimum for both signatures.
        const pageCssHeight = root.getBoundingClientRect().width * (297 / 210);
        const minSignatureHeight = 24;
        const signatureHeights = signatureSpaces.map(element => element.getBoundingClientRect().height);
        const reducibleHeight = signatureHeights.reduce(
            (total, height) => total + Math.max(0, height - minSignatureHeight),
            0,
        );
        const overflow = Math.max(0, root.scrollHeight - pageCssHeight);
        const heightToReclaim = Math.min(overflow, reducibleHeight);

        if (heightToReclaim > 0 && signatureSpaces.length > 0) {
            const reductionPerSignature = heightToReclaim / signatureSpaces.length;
            signatureSpaces.forEach((element, index) => {
                element.style.height = `${Math.max(minSignatureHeight, signatureHeights[index] - reductionPerSignature)}px`;
            });
            await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        }

        const canvas = await html2canvas(root, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: Math.max(root.scrollWidth, root.clientWidth),
            windowHeight: Math.max(root.scrollHeight, root.clientHeight),
            scrollX: 0,
            scrollY: 0,
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
        const imageWidth = canvas.width * ratio;
        const imageHeight = canvas.height * ratio;
        const x = (pageWidth - imageWidth) / 2;
        const y = (pageHeight - imageHeight) / 2;

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, imageWidth, imageHeight, undefined, 'FAST');
        return pdf.output('datauristring').split(',')[1];
    } finally {
        root.style.boxShadow = originalShadow;
        signatureSpaces.forEach((element, index) => {
            element.style.height = originalSignatureHeights[index];
        });
    }
}
/** Set the PDF's suggested name when printing or saving it from the browser. */
export function printQuoteWithFilename(quoteNumber: string, customerName: string): void {
    const originalTitle = document.title;
    const safePart = (value: string) => value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
        .trim()
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 80);
    const filename = `${safePart(quoteNumber || 'Preventivo')}_${safePart(customerName || 'Cliente')}_LunaEvents`;

    document.title = filename;
    try {
        window.print();
    } finally {
        document.title = originalTitle;
    }
}