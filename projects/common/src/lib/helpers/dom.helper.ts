export function isElementVisible(e: HTMLElement) {
  return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}

export function isElementDisabled(e: HTMLElement) {
  return e.hasAttribute('disabled') && e['disabled'] === true;
}


export function findFirstFocusableIn(element) {
  const focusable: HTMLElement[] = [].slice.call(element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
  return focusable.find(e => isElementVisible(e) && !isElementDisabled(e));
}

export function findNbCardBody(element) {
  const focusable: HTMLElement[] = [].slice.call(element.querySelectorAll('nb-card-body'));
  return focusable.find(e => isElementVisible(e));
}

export function findNextFocusable(element) {
  if (element.nextElementSibling) {
    const c = findFirstFocusableIn(element.nextElementSibling);
    return c ? c : findNextFocusable(element.nextElementSibling);
  } else {
    return findNextFocusable(element.parentElement);
  }
}

export function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

export class DOMHelper {
  static stopEvent($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  static focusById(id: string) {
    if (id) document.getElementById(id)?.focus({ preventScroll: true });
  }

  static scrollById(id: string){
    document.getElementById(id).scrollIntoView({
      behavior: getScrollBehavior(),
      block: "start"
    });
  }
}
