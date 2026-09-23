import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {PasswordFieldLabels} from './password-field-labels';
import {PasswordValidator} from "../../helpers/password.validator";
import {isEmptyString} from "../../helpers/string.helper";
import {isDefined} from "../../helpers/object.helper";

@Component({
  standalone: false,
    selector: 'app-password-field',
    templateUrl: './password-field.component.html',
    styleUrls: ['./password-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PasswordFieldComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class PasswordFieldComponent implements OnInit, ControlValueAccessor {

    @Input() disabled: boolean;
    @Output() passwordStrength = new EventEmitter<boolean>();

    weaknessMessages: string[] = [];
    @Input() autocomplete: string;
    @Input() placeholder: string;

    readonly Labels = PasswordFieldLabels;
    readonly MIN_LENGTH = PasswordValidator.MIN_LENGTH;
    readonly MAX_LENGTH = PasswordValidator.MAX_LENGTH;

    private password;
    private readonly colors = {
        default: 'default',
        poor: 'poor',
        not_good: 'not-good',
        average: 'average',
        good: 'good'
    };

    constructor(private ch: ChangeDetectorRef) {
    }

    get value() {
        return this.password;
    }

    get isGood(): boolean {
        return PasswordValidator.isGood(this.weaknessMessages.length);
    }

    get isAverage(): boolean {
        return PasswordValidator.isAverage(this.weaknessMessages.length);
    }

    get isNotGood(): boolean {
        return PasswordValidator.isNotGood(this.weaknessMessages.length);
    }

    get isPoor(): boolean {
        return PasswordValidator.isPoor(this.weaknessMessages.length);
    }
    onChange: (value: any) => void = (value) => {
    };

    onTouched: (value: any) => void = (value) => {
    };

    ngOnInit(): void {
    }

    registerOnChange(fn: (value: any) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: (value: any) => void) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(obj: any): void {
        if (this.password != obj) {
            this.password = obj;
            this.onChange(this.password);
            this.ch.detectChanges();
        }
    }

    onInputChanges(newValue) {
        this.password = newValue;
        this.weaknessMessages = PasswordValidator.checkStrength(this.password);
        this.onChange(this.password);
        this.ch.detectChanges();
    }

    calcBackgroundColor(i: number) {
        if (!isDefined(this.password) || isEmptyString(this.password)) {
            return this.colors.default;
        }
        if (this.isGood) {
            return this.colors.good;
        }
        if (this.isAverage) {
            return i < 3 ? this.colors.average : this.colors.default;
        }
        if (this.isNotGood) {
            return i < 2 ? this.colors.not_good : this.colors.default;
        }
        if (this.isPoor) {
            return i < 1 ? this.colors.poor : this.colors.default;
        }
    }

}
