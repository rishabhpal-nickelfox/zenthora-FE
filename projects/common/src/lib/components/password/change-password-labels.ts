export const ChangePasswordLabels = {
    OldPassword: 'Old Password',
    NewPassword: 'New Password',
    ConfirmNewPassword: 'Confirm New Password',
    Submit: 'Change',
    Cancel: 'Cancel',
    ChangePasswordTitle: 'Change Password',
    PasswordHint: (minLength, maxLength) => `The password must be ${minLength}-${maxLength} characters long, contain upper and lower case and special characters`,
} as const;
