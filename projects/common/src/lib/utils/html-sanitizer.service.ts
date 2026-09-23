import {Injectable} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import createDOMPurify, {Config, DOMPurify} from 'dompurify';

@Injectable({
  providedIn: 'root'
})
export class HtmlSanitizerService {
  private static readonly SANITIZER_CONFIG: Config = {
    ALLOWED_TAGS: [
      'a', 'b', 'blockquote', 'body', 'br', 'caption', 'code', 'col', 'colgroup', 'div',
      'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'html', 'i', 'img', 'li', 'meta', 'ol',
      'p', 'pre', 's', 'small', 'span', 'strong', 'style', 'sub', 'sup', 'table', 'tbody',
      'td', 'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul'
    ],
    ALLOWED_ATTR: [
      'align', 'alt', 'border', 'cellpadding', 'cellspacing', 'charset', 'class', 'colspan', 'content',
      'height', 'href', 'http-equiv', 'rel', 'rowspan', 'src', 'style', 'target', 'title', 'type', 'width'
    ],
    FORBID_TAGS: ['embed', 'iframe', 'link', 'object', 'script'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
  };

  private readonly purifier: DOMPurify = this.createPurifier();

  constructor(private readonly domSanitizer: DomSanitizer) {
  }

  sanitizeHtml(rawHtml: string): string {
    if (!rawHtml || !this.purifier) {
      return '';
    }
    return this.purifier.sanitize(rawHtml, HtmlSanitizerService.SANITIZER_CONFIG);
  }

  sanitizeToSafeHtml(rawHtml: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(this.sanitizeHtml(rawHtml));
  }

  trustHtml(rawHtml: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(rawHtml || '');
  }

  private createPurifier(): DOMPurify {
    if (typeof window === 'undefined') {
      return null;
    }

    const purifier = createDOMPurify(window);
    purifier.addHook('uponSanitizeAttribute', (_node, data: { attrName?: string; attrValue?: string; keepAttr?: boolean }) => {
      if (data.attrName !== 'style' || !data.attrValue) {
        return;
      }
      if (this.containsUnsafeStyleValue(data.attrValue)) {
        data.keepAttr = false;
      }
    });

    return purifier;
  }

  private containsUnsafeStyleValue(value: string): boolean {
    return /(?:javascript:|expression\s*\(|url\s*\(|@import)/i.test(value);
  }
}
