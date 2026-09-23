export enum PrivateSmtpSecurityMode {
  STARTTLS = 'STARTTLS',
  SSL_TLS = 'SSL_TLS'
}

export const PrivateSmtpSecurityModeValue = new Map<string, string>([
  [PrivateSmtpSecurityMode.STARTTLS, 'STARTTLS'],
  [PrivateSmtpSecurityMode.SSL_TLS, 'SSL/TLS'],
]);

export const PrivateSmtpSecurityModeDefaultPort = new Map<string, string>([
  [PrivateSmtpSecurityMode.STARTTLS, '587'],
  [PrivateSmtpSecurityMode.SSL_TLS, '465'],
])
