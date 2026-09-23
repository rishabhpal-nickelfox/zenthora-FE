export class PaymentFormModel {
  id: number;
  name: string;
  paymentFormCode: string;
  paymentFormTemplate: string;
  disabled = false;

  static fromJSON(json: any): PaymentFormModel {
    const paymentForm = new PaymentFormModel();
    paymentForm.id = json.id;
    paymentForm.name = json.name;
    paymentForm.paymentFormCode = json.paymentFormCode;
    paymentForm.paymentFormTemplate = json.paymentFormTemplate;
    paymentForm.disabled = json.disabled ?? false;
    return paymentForm;
  }

  static toJSON(paymentForm: PaymentFormModel) {
    return {
      id: paymentForm.id,
      name: paymentForm.name,
      paymentFormCode: paymentForm.paymentFormCode,
      paymentFormTemplate: paymentForm.paymentFormTemplate
    };
  }
}
