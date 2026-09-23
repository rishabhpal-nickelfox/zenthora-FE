export const PaymentFormPaymentLabels = {
  PaymentAmount: 'Payment Amount',
  SelectPlaceholder: 'Select...',
  ProcessPayment: 'Process Payment',
  ConvenienceFee: 'Convenience Fee',
  ConvenienceFeePercent: (surchargePercent: number) => `Convenience Fee Percent ${surchargePercent}%`,
  Total: 'Total',
  CreditCardPaymentMethodIsNotAvailable: (companyDisplayName: string) => `Credit Card payment method is not available. Please contact ${companyDisplayName} support.`
} as const;
