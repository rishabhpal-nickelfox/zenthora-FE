import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SidebarToggleService {
  private readonly toggleSubject = new Subject<void>();

  get toggle$(): Observable<void> {
    return this.toggleSubject.asObservable();
  }

  toggle(): void {
    this.toggleSubject.next();
  }
}
