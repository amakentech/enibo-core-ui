import { UserProfile } from "@/Pages/Users.tsx/UserProfileList";

export type CustomerType = "Retail" | "Business";

enum RetailType {
  Personal,
  Joint,
}

type AccountMandate = {
  mandateId: string;
  category: string;
  signatory: string; //reference to Signatory
  mandateType: string;
  signingRules: string;
};

type Retail = {
  retailId: string;
  retailType: RetailType;
  designation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  individualKYC: KYCIndividual; //reference to IndividualKYC
  productTypes: ProductType; //reference to ProductType
  accountCurrency: string;
  riskRating: string;
  accountMandates: AccountMandate[]; //reference to AccountMandate
};

type Business = {
  businessId: string;
  legalEntityName: string;
  businessKYC: KYCBusiness; //reference to BusinessKYC
  productTypes: ProductType; //reference to ProductType
  accountCurrency: string;
  riskRating: string;
  directorsKYC: KYCIndividual; //reference to DirectorKYC
  accountMandates: AccountMandate[]; //reference to AccountMandate
};

type MandateRule = {
  mandateRuleId: string;
  category: string;
  mandateType: string;
  signingRule: string;
  minimumTransactionAmount: string;
  maximumTransactionAmount: string;
  maximumDailyLimit: string;
}

export type Account = {
  id: string;
  name: string;
  accountOwner: string;
  accountNumber: string;
  accountType: string;
  description: string;
  branchId: string;
  normalBalance: string;
}

export type Customer = {
  customerId: string;
  customerType: string;
  retail?: Retail;
  business?: Business;
  accountMandates: AccountMandate[];
  accounts: Account[]
  mandateRules: MandateRule[]; //reference to MandateRule
  modifiedBy: string;
  modifiedOn: string;
};

export type ProductType = {
  productTypeId: string;
  productTypeName: string;
  description: string;
  active: boolean;
  interestBearing: boolean;
  fixedInterestRate: number;
  effectiveDate: string;
  fees: boolean;
  feeTypes: FeeType[];
  riskRating: string;
  prefix: string;
  numberSchema: string;
  startingValue: number;
  modifiedBy: string;
  modifiedOn: string;
};

export type LedgerAccount = {
    id: string;
    account_number: string;
    export_account_number: string;
    description: string;
    customer_account_number: string;
    ledger_account_number: string;
    branch_id: string;
    chart_string: string;
    accountCategoryId: string;
};

export type TransactionType = {
  transactionTypeId: string;
  transactionTypeName: string;
  transactionTypeCode: string;
  description: string;
  currency: string;
  modifiedBy: string;
  modifiedOn:  string;
};

export type Transaction = {
  id: string;
  status: string;
  transactionType: string;
  normalBalance: string;
  amount: number;
  accountId: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
};

export type Entry = {
  accountId: string;
  amount: string;
  createdAt: string;
  description: string;
  direction: string;
  discardedAt: string;
  id: string;
  status: string;
  transactionId: string;
};

export type FeeType = {
  feeTypeId: string;
  feeTypeName: string;
  description: string;
  transactionTypes: TransactionType[];
  paymentFrequency: string;
  effectiveDate: string;
  fixedRate: number;
  modifiedBy: string;
  modifiedOn: string;
};

export type LedgerRule = {
  id: string,
  priority: string;
  ruleName: string;
  description: string;
  transactionType: string;
  transactionsDescriptionContains: string;
  transactionDescriptionDoesNotContain: string;
  from: string;
  to: string;
  debitLedgerAccount: string;
  creditLedgerAccount: string;
  modifiedBy: string;
  modifiedOn: string;
};

export type LedgerCategory = {
  id: string;
  ledgerCategory: string;
  description: string;
  categoryNumber: string;
  modifiedBy: string;
  modifiedOn: string;
};

export type KYCType = {
  kycType: "Individual" | "Business";
  kycTypeName: string;
  kycTypeId: string;
  kycTypeDescription: string;
  kycTypeCode: string;
  modifiedBy: string;
  modifiedOn: string;
};
export type MandateType = {
  mandateTypeId: string;
  mandateTypeName: string;
  mandateTypeDescription: string;
  mandateTypeCode: string;
  modifiedBy: string;
  modifiedOn: string;
};

export type KYCIndividual = {
  IndividualKYCId: string;
  kycType: "Individual";
  kycTypeId: string;
  designation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  postalAddress: string;
  physicalAddress: string;
  country: string;
  taxNumber: string;
  idType: string;
  idNumber: string;
  sex: string;
  nationality: string;
  riskRating: string;
  attachDocumentsField: string[];
  signature: string;
  modifiedBy: string;
  modifiedOn: string;
};

export type KYCBusiness = {
  businessKYCId: string;
  kycType: "Business";
  legalEntityName: string;
  legalStatus: string;
  dateOfIncorporation: string;
  registrationNumber: string;
  natureOfBusiness: string;
  entityNationality: string;
  entityPinNumber: string;
  entityTaxNumber: string;
  telephoneNumber: string;
  emailAddress: string;
  postalAddress: string;
  physicalAddress: string;
  riskRating: string;
  attachDocumentsField: string[];
  modifiedBy: string;
  modifiedOn: string;
};

export type KYC = {
  KYCType: "Individual" | "Business";
  individual?: KYCIndividual;
  business?: KYCBusiness;
};

export type ApprovalRule = {
  module: string;
  subModule: string;
  status: string;
  approvalRule: string;
  requestedBy: string;
  requestedOn: string; // You might want to use a Date type here if the date is involved
  note: string;
  pendingApprovers: string[];
  approvedBy: string | null; // Assuming it could be null if not approved yet
  rejectionReason: string | null; // Assuming it could be null if not rejected
};

export interface BranchData {
  name: string;
  activeCustomers: number;
  transactionVolume: ChartData;
  totalBalancesByRisk: {
    High: number;
    Medium: number;
    Low: number;
  };
  activeAccountsByProductType: {
    [key: string]: number;
  };
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface UserDetailsType {
  id: number;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  employeeNumber: string;
  branch: string;
  profile: UserProfile;
  documentAttachment: string;
  modifiedOn: string;
  modifiedBy: string;
}

export interface BranchForm {
  branchId: string;
  branchCode: string;
  branchName: string;
  branchType: BranchTypes;
  buildingName: string;
  buildingNumber: string;
  country: string;
  countrySubdivision: string;
  description: string;
  email: string;
  phoneNumber:  string;
  headOfficeBranch: string;
  isHeadOfficeBranch: boolean;
  localBankCode: string;
  postalAddress: string;
  streetName: string;
  allowedProductTypes: ProductType[];
  SWIFTCode: string;
}


export interface BranchTypes{
    branchTypeId: number;
    branchTypeName: string;
    description: string;
    modifiedBy: string;
    modifiedOn: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}