import {ElementRef, Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class SalePrintService {

  async print(sale: ElementRef) {
    const head = document.head.innerHTML;
    const classList = Array.from(document.body.classList).join(" ");
    const baseTag = `<base href="${window.location.origin}/">`;

    document.querySelectorAll("iframe[data-sale-print]").forEach(node => node.remove());

    const iframe = document.createElement("iframe");
    iframe.setAttribute("data-sale-print", "");
    iframe.style.position = "fixed";
    iframe.style.top = "-10000px";
    iframe.style.left = "0";
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = "none";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      console.error("Cannot access iframe document");
      iframe.remove();
      return;
    }
    const fullHtml = `
      <html>
        <head>
          ${baseTag}
          ${head}
        <style>
             @page {
              size: A4;
              margin: 0;
            }

            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              min-width: 8.27in !important;
              height: auto !important;
              overflow: visible !important;
            }

            .print-root {
              display: flex;
              justify-content: center;
              align-items: flex-start;
              width: 100%;
              min-height: 100%;
              box-sizing: border-box;
              overflow: visible;
            }


          </style>
        </head>
        <body class="${classList}">
         <div class="print-root">
              ${sale.nativeElement.innerHTML}
         </div>
        </body>
      </html>
    `;

    doc.open();
    doc.write(fullHtml);
    doc.close();

    const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    await Promise.all(
      links.map(link =>
        new Promise<void>(resolve => {
          if ((link as any).sheet) return resolve();
          link.addEventListener('load', () => resolve());
          link.addEventListener('error', () => resolve());
        })
      )
    );

    const images = Array.from(doc.images);
    await Promise.all(
      images.map(img =>
        new Promise<void>(resolve => {
          if (img.complete) return resolve();
          img.addEventListener('load', () => resolve());
          img.addEventListener('error', () => resolve());
        })
      )
    );

    if ((doc as any).fonts?.ready) {
      await (doc as any).fonts.ready;
    }

    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    await new Promise<void>(resolve => setTimeout(resolve, 200));

    this.fitToPageWidth(doc);

    const win = iframe.contentWindow!;

    let cleanedUp = false;
    const cleanup = () => {
      if (cleanedUp) {
        return;
      }
      cleanedUp = true;
      win.removeEventListener("afterprint", cleanup);
      iframe.remove();
    };
    win.addEventListener("afterprint", cleanup);

    win.focus();
    win.print();
  }

  private fitToPageWidth(doc: Document) {
    const root = doc.querySelector(".print-root") as HTMLElement | null;
    if (!root) {
      return;
    }

    const probe = doc.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;height:0;width:210mm";
    doc.body.appendChild(probe);
    const pageWidth = probe.getBoundingClientRect().width;
    probe.remove();

    const contentWidth = Array.from(root.children)
      .reduce((widest, child) => Math.max(widest, this.neededWidth(doc, child as HTMLElement)), 0);

    if (pageWidth > 0 && contentWidth > pageWidth + 1) {
      root.style.zoom = `${pageWidth / contentWidth}`;
    }
  }

  private neededWidth(doc: Document, element: HTMLElement): number {
    const paddingRight = parseFloat(doc.defaultView?.getComputedStyle(element).paddingRight ?? "") || 0;
    return Math.max(element.scrollWidth + paddingRight, element.getBoundingClientRect().width);
  }

}
