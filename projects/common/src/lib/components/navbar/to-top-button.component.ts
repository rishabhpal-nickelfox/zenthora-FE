import {Component} from '@angular/core';
import {getScrollBehavior} from '../../helpers/dom.helper';

@Component({
  standalone: false,
  selector: 'app-to-top-button',
  styleUrls: ['./to-top-button.component.scss'],
  template: `
    <button class="to-top" [hidden]="!show"
            (click)="scrollToTop()">
      <i class="nb-arrow-thin-up"></i>
    </button>
  `,
})
export class ToTopButtonComponent {

  show = false;

  constructor() {
    window.onscroll = (ev => {
      this.show = window.scrollY !== 0;
    });
  }

  scrollToTop() {
    window.scrollTo({top: 0, behavior: getScrollBehavior()});
  }
}
