export const CustomerEmailChangePasswordLabels = {
  SuccessMessage: 'Now you can Sign In with your new password',
  Password: 'New Password',
  ConfirmPassword: 'Confirm New Password',
  SecretKey: 'Secret Key',
  Submit: 'Change Password',
  PasswordManagementHeader: 'Password Management',
  PleaseChangePasswordHint: 'Please change your password',
  PasswordChangedMessage: 'Password has been changed',
  GoToPortal: 'Go to Portal',
  PasswordHint: (minLength, maxLength) => `The password must be ${minLength}-${maxLength} characters long, contain upper and lower case and special characters`,
} as const;
