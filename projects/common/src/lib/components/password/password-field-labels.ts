export const PasswordFieldLabels = {
  containsUppercaseLetter: 'Must contain at least one uppercase letter',
  containsLowerCaseLetter: 'Must contain at least one lowercase letter',
  containsDigit: 'Must contain at least one digit',
  containsSpecialCharacter: 'Must contain at least one special character',

  isEnoughLength(minLength: number, maxLength: number): string {
    return `Must be ${minLength}-${maxLength} characters long`;
  },

  OldPassword: 'Old Password',
  NewPassword: 'New Password',
  ConfirmNewPassword: 'Confirm New Password',
  Submit: 'Change',
  Cancel: 'Cancel',
  ChangePasswordTitle: 'Change Password',
  PasswordHint: (minLength, maxLength) => `The password must be ${minLength}-${maxLength} characters long, contain upper and lower case and special characters`,
} as const;
