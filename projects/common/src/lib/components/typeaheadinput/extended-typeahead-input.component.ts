import {catchError, map, mergeMap} from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {defer, Observable, of, throwError as observableThrowError} from 'rxjs';
import {ComponentWithSubscriptions} from '../component-with-subscriptions';
import {TypeaheadMatch} from 'ngx-bootstrap/typeahead';
import {deepGet, isDefined} from "../../helpers/object.helper";
import {findNextFocusable} from "../../helpers/dom.helper";

@Component({
  standalone: false,
  selector: 'app-extended-typeahead-input',
  templateUrl: './extended-typeahead-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExtendedTypeaheadInputComponent),
      multi: true
    }
  ],
  styleUrls: ['./extended-typeahead-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ExtendedTypeaheadInputComponent extends ComponentWithSubscriptions implements ControlValueAccessor, OnInit {

  @Input() resultFormatter: (value: any) => string;
  @Input() listFormatter: (value: any) => string;
  @Input() searchProperty = 'name';
  @Input() placeholder = '';
  @Input() dropup = false;
  @Input() required = true;
  @Input() type: any;
  loading = false;
  dataSource$: Observable<any>;
  @Output() selectItem: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @ViewChild('typeahead', {static: true}) typeahead: ElementRef;
  @ViewChild('a', {static: true}) a: ElementRef;
  @Input() disabled = false;
  searchFieldValue = '';
  protected searchString = '';
  protected searchResultObject = null;
  protected formattedResultStringValue = null;

  constructor(protected cd: ChangeDetectorRef, protected renderer: Renderer2) {
    super();
  }

  get noMatchObject() {
    const noMatchObject = {_noMatch: true};
    noMatchObject[this.searchProperty] = null;
    return noMatchObject;
  }

  get value() {
    return this.searchResultObject;
  }

  @Input() source: (text: string) => Observable<any[]> = (t) => of([]);

  externalOnChange: (value: any) => void = (value) => {
  };
  externalOnTouched: (value: any) => void = (value) => {
  };

  ngOnInit(): void {
    this.dataSource$ = defer(
      () => of(this.searchString))
      .pipe(
        mergeMap((token: string) => this.source(token).pipe(map(result => {
          this.loading = false;
          if (result.length > 0) {
            return result;
          }
          this.cd.detectChanges();
          return [this.noMatchObject];
        }))))
      .pipe(catchError((e) => {
        return observableThrowError(e);
      }));
    this.resultFormatter = this.listFormatter;
    this.searchResultObject = null;
  }

  writeValue(obj: any): void {
    if (this.searchResultObject != obj) {
      this.searchResultObject = obj;
      this.updateFields();
      this.searchFieldValue = this.formattedResultStringValue;
      this.onChange(this.searchResultObject);
      this.cd.detectChanges();
    }
  }

  updateFields() {
    if (isDefined(this.searchResultObject) && isDefined(deepGet(this.searchResultObject, this.searchProperty))) {
      this.searchString = '' + deepGet(this.searchResultObject, this.searchProperty);
      this.formattedResultStringValue = this.resultFormatter(this.searchResultObject);
    } else {
      this.searchString = '';
      this.formattedResultStringValue = null;
    }
  }

  onSelect(e: TypeaheadMatch) {
    const selected = e.item && !e.item._noMatch ? e.item : null;
    this.writeValue(selected);
    this.selectItem.emit(selected);
    this.showFormattedStringInInputField();
    this.focusNext();
  }

  onTouched(event) {
    this.externalOnTouched(event.target.value);
  }

  onTyping(typed) {
    this.loading = true;
    this.searchString = typed;
    this.showSearchStringInInputField();
  }

  onChange(e) {
    this.externalOnChange(e);
    this.change.emit(e);
  }

  onBlur() {
    this.showFormattedStringInInputField();
  }

  onFocus(e) {
    this.showSearchStringInInputField();
  }

  onKeyDown(e) {
    if (e.code === 'Escape') {
      this.typeahead.nativeElement.blur();
    }
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      e.preventDefault();
    }
  }

  onKeyUp(e) {
    if (e.code === 'Escape') {
      this.updateFields();
      this.onChange(this.searchResultObject);
      this.showFormattedStringInInputField();
    }
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      this.typeahead.nativeElement.dispatchEvent(new Event('openSearch'));
      e.preventDefault();
    }
    this.cd.detectChanges();
  }

  onRemoveValue(e) {
    this.onSelect(new TypeaheadMatch(null));
  }

  registerOnChange(fn: any): void {
    this.externalOnChange = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.detectChanges();
  }

  registerOnTouched(fn: any): void {
    this.externalOnTouched = fn;
  }

  protected showFormattedStringInInputField() {
    this.searchFieldValue = this.formattedResultStringValue;
  }

  protected focusNext() {
    const c = findNextFocusable(this.typeahead.nativeElement);
    if (c) {
      c.focus();
    }
  }

  protected showSearchStringInInputField() {
    this.searchFieldValue = this.searchString;
  }


}
