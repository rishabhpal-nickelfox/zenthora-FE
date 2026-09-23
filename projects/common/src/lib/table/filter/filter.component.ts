import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FilterBaseComponent} from './filter-base.component';

@Component({
  standalone: false,
  selector: 'app-extended-table-filter',
  template: '<div #container></div>'
})
export class FilterComponent implements OnInit, OnDestroy {

  @ViewChild('container', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;

  private componentRef: ComponentRef<FilterBaseComponent>;
  @Input() componentType;
  @Input() componentParams;

  @Input() filterProperty;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter();

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    if (this.componentType) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<FilterBaseComponent>(this.componentType);
      this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.params = this.componentParams;
      this.componentRef.instance.filterChanged.subscribe(value => {
        this.onFilterChange(value);
      });
    }
  }

  onFilterChange(value) {
    this.filterChanged.next({filterProperty: this.filterProperty, value: value});
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  set filterValue(value) {
    this.instance.filterValue = value;
  }

  get filterValue() {
    return this.instance.filterValue;
  }

  get instance() {
    return this.componentRef.instance;
  }

  reset() {
    this.componentRef.instance.reset();
  }
}
