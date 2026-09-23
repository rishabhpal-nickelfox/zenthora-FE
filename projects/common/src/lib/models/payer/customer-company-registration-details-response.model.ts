export interface CustomerCompanyRegistrationDetailsResponseModel {
  customer: {
    emailAlreadyConfirmed: boolean;
    email: string;
    firstName: string,
    middleName: string,
    lastName: string
  }
  customerName: string;
  legalName: string;
  invitationPending: boolean;
}
