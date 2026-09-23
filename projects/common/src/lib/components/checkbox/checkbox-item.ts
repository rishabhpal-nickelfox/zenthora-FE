export class CheckboxItem {
  value: string;
  label: string;
  checked: boolean;
  disabled: boolean;
  hint: string;

  constructor(value: any, label: any, checked: boolean, disabled?: boolean, hint?: string) {
    this.value = value;
    this.label = label;
    this.checked = checked
    this.disabled = disabled;
    this.hint = hint;
  }
}
