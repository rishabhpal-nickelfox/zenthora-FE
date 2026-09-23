import {ChangeDetectionStrategy, Component, Input} from "@angular/core";

@Component({
  selector: 'app-recaptcha-terms',
  templateUrl: 'recaptcha-terms.component.html',
  styleUrls: ['./recaptcha-terms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class RecaptchaTermsComponent {

  @Input() light = false;
}
