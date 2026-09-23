import {AbstractControl, ValidatorFn} from '@angular/forms';
import {isDefined} from './object.helper';
import {isEmptyString} from './string.helper';
import {PasswordFieldLabels} from "../components/password/password-field-labels";
import {FormValidatorErrorModel} from "../models/common/form-validator-error.model";

export class PasswordValidator {

    static readonly MIN_LENGTH = 12;
    static readonly MAX_LENGTH = 20;

    static validatePasswordFieldStrength(control: AbstractControl) {
        const password = control.value;
        const weakness = PasswordValidator.checkStrength(password).length;
        return PasswordValidator.isGood(weakness) ? null : {'weakPassword': weakness};
    }

    static validateStrength(label: string): ValidatorFn {
        return (control) => {
            const password = control.value;
            const weakness = PasswordValidator.checkStrength(password).length;
            return PasswordValidator.isGood(weakness) ? null : {'weakPassword': new FormValidatorErrorModel(label)};
        };
    }

    static checkStrength(p): string[] {
        if (!isDefined(p) || isEmptyString(p)) {
            return [PasswordFieldLabels.isEnoughLength(PasswordValidator.MIN_LENGTH, PasswordValidator.MAX_LENGTH),
                PasswordFieldLabels.containsLowerCaseLetter, PasswordFieldLabels.containsUppercaseLetter, PasswordFieldLabels.containsDigit, PasswordFieldLabels.containsSpecialCharacter];
        }

        const weaknessMessages = [];
        if (!PasswordValidator.isEnoughLength(p, PasswordValidator.MIN_LENGTH, PasswordValidator.MAX_LENGTH)) {
            weaknessMessages.push(PasswordFieldLabels.isEnoughLength(PasswordValidator.MIN_LENGTH, PasswordValidator.MAX_LENGTH));
        }
        if (!PasswordValidator.containsLowerLetter(p)) {
            weaknessMessages.push(PasswordFieldLabels.containsLowerCaseLetter);
        }
        if (!PasswordValidator.containsUpperLetter(p)) {
            weaknessMessages.push(PasswordFieldLabels.containsUppercaseLetter);
        }
        if (!PasswordValidator.containsDigit(p)) {
            weaknessMessages.push(PasswordFieldLabels.containsDigit);
        }

        if (!PasswordValidator.containsSymbol(p)) {
            weaknessMessages.push(PasswordFieldLabels.containsSpecialCharacter);
        }

        return weaknessMessages;
    }

    static containsLowerLetter(p: string): boolean {
        return /[a-z]+/.test(p);
    }

    static containsUpperLetter(p: string): boolean {
        return /[A-Z]+/.test(p);
    }

    static containsDigit(p: string): boolean {
        return /[0-9]+/.test(p);
    }

    static containsSymbol(p: string): boolean {
        return /[$-/:-?{-~!"^_@#\\`\[\]]/g.test(p);
    }

    static isEnoughLength(p: string, minLength: number, maxLength: number): boolean {
        return p.length >= minLength && p.length <= maxLength;
    }

    static isGood(weakness: number): boolean {
        return weakness === 0;
    }

    static isAverage(weakness: number): boolean {
        return weakness === 1;
    }

    static isNotGood(weakness: number): boolean {
        return weakness === 2;
    }

    static isPoor(weakness: number): boolean {
        return weakness > 2;
    }

}
