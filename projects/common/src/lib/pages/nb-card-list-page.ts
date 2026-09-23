import {ListPage} from './list-page';
import {AfterViewInit, Directive, ElementRef, Inject} from '@angular/core';
import {TableComponent} from '../table/table.component';
import {ScrollableComponent} from './scrollable.component';
import {of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {findFirstFocusableIn} from "../helpers/dom.helper";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../utils/base-routing.service";
import {getScrollBehavior} from '../helpers/dom.helper';

@Directive()
export abstract class NbCardListPage extends ListPage implements ScrollableComponent, AfterViewInit {

  protected table: TableComponent;

  constructor(protected elementRef: ElementRef,  @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
    super();
    this.subscriptions.add(
      this.routingService.refreshAfterNavigate.subscribe(url => {
        if (window.location.pathname == url || window.location.pathname == `/${url}`) {
          this.reInit();
          if (this.table) {
            this.table.refresh();
          }
        }
      })
    );
  }

  abstract reInit();

  ngAfterViewInit(): void {
    this.focusTable();
    this.scroll();
  }

  focusTable() {
    const firstFocusable = findFirstFocusableIn(this.elementRef.nativeElement);
    if (firstFocusable) {
      firstFocusable.tabIndex = 0;
      firstFocusable.focus();
    }
  }

  scroll() {
    this.subscriptions.add(
      of(true)
        .pipe(delay(5))
        .pipe(map(() => {
          window.scrollTo({top: 0, left: 0, behavior: getScrollBehavior()});
        })).subscribe()
    );
  }

}
