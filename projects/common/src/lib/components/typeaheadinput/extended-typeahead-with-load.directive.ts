import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {ExtendedTypeaheadDirective} from './extended-typeahead.directive';
import {getValueFromObject, TypeaheadMatch} from "ngx-bootstrap/typeahead";

@Directive({
  standalone: false,selector: '[extendedTypeaheadWithLoad]', exportAs: 'qbo-typeahead-with-load'})
export class ExtendedTypeaheadWithLoadDirective extends ExtendedTypeaheadDirective {

  @Output() loadMore: EventEmitter<any> = new EventEmitter();

  @Input()
  set extendedTypeaheadWithLoad(val) {
    this.typeahead = val;
  }

  @HostListener('window:keyup', ['$event'])
  onChange(event: KeyboardEvent): void {
    event.stopPropagation();
    if (this._container && this._container.active && this._container.active.item && this._container.active.item._loadMore
      && event.key === 'Enter') {
      this.loadMore.emit();
    } else {
      super.onChange(event);
    }
  }

  addMatches(matches: TypeaheadMatch[]) {
    this._matches = this._matches.filter(match => !match.item._loadMore);
    const convertedMatches = matches.map(
      (option: any) =>
        new TypeaheadMatch(
          option,
          getValueFromObject(option, this.typeaheadOptionField)
        )
    );
    this._matches.push(...convertedMatches);
    this._container.matches = this._matches;
    this._container.selectActive(convertedMatches[0]);
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    event.stopPropagation();
    if (this._container && event.key === 'Enter') {
      event.preventDefault();
    } else if (this._container && this._container.active && (event.code === 'ArrowUp' || event.code === 'ArrowDown')) {
      this.scrollToActive(event.code);
    } else {
      super.onKeydown(event);
    }
  }

  protected scrollToActive(code) {
    const active = this._container.element.nativeElement.getElementsByClassName('typeahead-active');
    const container = this._container.element.nativeElement.getElementsByClassName('typeahead-scrollable-container');
    if (active && active[0] && container && container[0]) {
      const indx = this._container.matches.indexOf(this._container.active);
      if (code === 'ArrowDown') {
        this.scrollDown(container[0], active[0], indx);
      } else if (code === 'ArrowUp') {
        this.scrollUp(container[0], active[0], indx);
      }
    }
  }

  private scrollUp(containerElement: HTMLElement, activeElement: HTMLElement, indx) {
    if (indx === 0) {
      containerElement.parentElement.scrollTop = containerElement.scrollHeight;
    } else {
      containerElement.parentElement.scrollTop = activeElement.offsetTop - activeElement.clientHeight;
    }
  }

  private scrollDown(containerElement, activeElement, indx) {
    if (indx + 1 > this._container.matches.length - 1) {
      containerElement.parentElement.scrollTop = 0;
    } else {
      containerElement.parentElement.scrollTop = activeElement.offsetTop;
    }
  }
}
