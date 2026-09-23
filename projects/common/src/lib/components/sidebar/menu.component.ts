import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {NbMenuItem} from '@nebular/theme';
import {BasePageMenuService, MENU_SERVICE_TOKEN} from "../../utils/base-page-menu.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../utils/base-routing.service";
import {ComponentWithSubscriptions} from "../component-with-subscriptions";

@Component({
  standalone: false,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends ComponentWithSubscriptions implements OnInit {


  items: NbMenuItem[] = [];

  constructor(@Inject(MENU_SERVICE_TOKEN) protected pageMenuService: BasePageMenuService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected ch: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.items = this.pageMenuService.menu;
    this.expandActive();
    this.subscriptions.add(
      this.pageMenuService.menuChanged.subscribe(() => {
        this.items = this.pageMenuService.menu;
        this.ch.detectChanges();
      }));

    this.subscriptions.add(
      this.routingService.getRouter().events.subscribe((val) => {
        this.expandActive();
      })
    );

  }

  navigate(link) {
    this.routingService.getRouter().navigate([link], {
      queryParamsHandling: 'merge'
    });
    return false;
  }

  toggleExpanded(item) {
    item.expanded = !item.expanded;
  }

  isActive(item: NbMenuItem): boolean {
    if (item.children) {
      return this.isDefined(item.children.find(child => this.isActive(child)));
    }
    return this.routingService.getRouter().url.endsWith(item.link);
  }

  findActiveNode(item) {
    if (this.isActive(item)) {
      return item;
    } else if (item.children) {
      let i;
      let result = null;
      for (i = 0; result == null && i < item.children.length; i++) {
        result = this.findActiveNode(item.children[i]);
      }
      return result;
    }
    return null;
  }

  expandActive() {
    this.items.forEach(item => {
      const active = this.findActiveNode(item);
      if (active) {
        item.expanded = true;
      }
    });
  }

}
