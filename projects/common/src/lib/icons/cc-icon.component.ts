import {Component} from '@angular/core';
import {ZenthoraIcon} from './zenthora-icon';

@Component({
  standalone: false,
  selector: 'app-cc-icon',
  template: `
    <div [class]="iconClass">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.06 19.71">
        <g id="Layer_2" data-name="Layer 2">
          <g id="layer_1-2" data-name="layer 1">
            <path class="cls-1"
                  d="M156.11,244.87c-4.92,0-8.91,1.22-8.91,2.73s4,2.72,8.91,2.72,8.9-1.22,8.9-2.72S161,244.87,156.11,244.87Z"
                  transform="translate(-145.83 -230.61)"/>
            <rect class="cls-2 cls-main" x="0.27" y="0.27" width="20.52" height="5.48"/>
            <path class="cls-3"
                  d="M166.62,236.63H146.1a.27.27,0,0,1-.27-.27v-5.48a.27.27,0,0,1,.27-.27h20.52a.27.27,0,0,1,.27.27v5.48A.27.27,0,0,1,166.62,236.63Zm-20.25-.54h20v-4.94h-20Z"
                  transform="translate(-145.83 -230.61)"/>
            <path class="cls-4" d="M163.6,232.7H149.12a.92.92,0,1,0,0,1.84H163.6a.92.92,0,1,0,0-1.84Z"
                  transform="translate(-145.83 -230.61)"/>
            <path class="cls-2 cls-main"
                  d="M162.88,232.7V246a1.65,1.65,0,0,1-1.65,1.65h-9.75a1.66,1.66,0,0,1-1.65-1.65V232.7Z"
                  transform="translate(-145.83 -230.61)"/>
            <rect class="cls-4" x="146.85" y="238.59" width="14.98" height="3.2"
                  transform="translate(-231.68 163.92) rotate(-90)"/>
            <rect class="cls-2 cls-main" x="158.06" y="237.91" width="2.74" height="1.97"
                  transform="translate(252.49 -151.14) rotate(90)"/>
            <path class="cls-3"
                  d="M160.41,240.53h-2a.27.27,0,0,1-.27-.26v-2.74a.27.27,0,0,1,.27-.27h2a.27.27,0,0,1,.27.27v2.74A.27.27,0,0,1,160.41,240.53Zm-1.7-.53h1.43v-2.2h-1.43Z"
                  transform="translate(-145.83 -230.61)"/>
            <path class="cls-3"
                  d="M160.41,236.07a.27.27,0,0,1-.27-.27v-1.33a.27.27,0,0,1,.54,0v1.33A.27.27,0,0,1,160.41,236.07Z"
                  transform="translate(-145.83 -230.61)"/>
            <path class="cls-3"
                  d="M163.6,232.43H149.12a1.19,1.19,0,0,0,0,2.38h.45V246a1.92,1.92,0,0,0,1.91,1.92h9.75a1.92,1.92,0,0,0,1.92-1.92V234.81h.45a1.19,1.19,0,1,0,0-2.38Zm-14.48,1.84a.65.65,0,1,1,0-1.3h.45v1.3Zm1,11.76V233h2.37v14.44h-1A1.38,1.38,0,0,1,150.1,246Zm2.91,1.38V233h2.66v14.44Zm9.6-1.38a1.37,1.37,0,0,1-1.38,1.38h-5V233h2v2.83a.27.27,0,0,0,.54,0V233h3.9Zm1-11.76h-.45V233h.45a.65.65,0,1,1,0,1.3Z"
                  transform="translate(-145.83 -230.61)"/>
            <path class="cls-4" d="M158.34,244.9a1.08,1.08,0,0,0,0-1.92,2.26,2.26,0,1,1,0,1.92Z"
                  transform="translate(-145.83 -230.61)"/>
            <path class="cls-3"
                  d="M159.43,246.26a1.36,1.36,0,0,1-1.36-1.36,1.34,1.34,0,0,1,.41-1,1.32,1.32,0,0,1-.41-1,1.36,1.36,0,1,1,2.31,1,1.36,1.36,0,0,1-.95,2.32Zm0-4.1a.82.82,0,0,0-.82.82.83.83,0,0,0,.44.73.25.25,0,0,1,.15.23.28.28,0,0,1-.15.24.82.82,0,1,0,1.2.72.81.81,0,0,0-.45-.72.27.27,0,0,1-.14-.24.24.24,0,0,1,.14-.23.82.82,0,0,0-.37-1.55Z"
                  transform="translate(-145.83 -230.61)"/>
          </g>
        </g>
      </svg>
    </div>
  `,
  styles: [`
    .cls-1 {
      fill: #d8d9da;
    }

    .cls-2 {
      fill: #aa8fa2;
    }

    .cls-3 {
      fill: #3d2139;
    }

    .cls-4 {
      fill: #fff;
    }`],
  styleUrls: ['./zenthora-icon.scss']
})
export class CCIconComponent extends ZenthoraIcon {
}

