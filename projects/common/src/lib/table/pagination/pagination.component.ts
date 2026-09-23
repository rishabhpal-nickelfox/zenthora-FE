import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {PaginationControlsDirective} from 'ngx-pagination';

@Component({
  standalone: false,
  selector: 'app-extended-table-pagination-component',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() id;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('p', { static: true }) p: PaginationControlsDirective;


  setLast() {
    if (!this.p.isLastPage()) {
      this.p.setCurrent(this.p.getLastPage());
    }
  }

  setNext() {
    if (!this.p.isLastPage()) {
      this.p.next();
    }
  }

  setPrevious() {
    if (!this.p.isFirstPage()) {
      this.p.previous();
    }
  }


  setFirst() {
    if (!this.p.isFirstPage()) {
      this.p.setCurrent(1);
    }
  }

  setPage(n) {
    if (this.p.getCurrent() !== n) {
      this.p.setCurrent(n);
    }
  }
}
