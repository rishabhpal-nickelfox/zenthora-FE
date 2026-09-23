export const CustomerPortalUnavailableLabels = {
  UnavailableMessage: (email?: string, companyName?: string) =>
    email && companyName
      ? `Sorry, Customer Portal is unavailable for ${email} in ${companyName}`
      : `Sorry, Customer Portal is unavailable`,
  GoToSignIn: 'Go to Sign In',
} as const;
