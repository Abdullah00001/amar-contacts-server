export interface IVerificationEmailData {
  name: string;
  email: string;
  expirationTime: number;
  otp: string;
}

export interface IRecoveryEmailTemplateData {
  name: string;
  otp: string;
  expirationTime: number;
  year: number;
  companyName: string;
  supportEmail: string;
}

export interface IAccountVerificationParam {
  otp: string;
  email: string;
}
