import {Component, Input, OnChanges} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';
import {HtmlSanitizerService} from '../../utils/html-sanitizer.service';

@Component({
  standalone: true,
  selector: 'app-rich-text-viewer',
  templateUrl: './rich-text-viewer.component.html',
  styleUrls: ['./rich-text-viewer.component.scss']
})
export class RichTextViewerComponent implements OnChanges {
  trustedValue: SafeHtml = '';
  @Input() value: string | SafeHtml;

  constructor(private readonly htmlSanitizer: HtmlSanitizerService) {
  }

  ngOnChanges(): void {
    this.trustedValue = typeof this.value === 'string'
      ? this.htmlSanitizer.trustHtml(this.normalizeBreakingSpaces(this.value))
      : this.value || '';
  }

  private normalizeBreakingSpaces(value: string): string {
    return value.replace(/&nbsp;|\u00a0/g, ' ');
  }
}
