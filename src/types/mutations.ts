import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Authenticate($email: String!, $password: String!) {
    authenticate(email: $email, password: $password) {
      token
      user {
        id
        username
        firstName
        middleName
        lastName
        email
        phoneNumber
        employeeNumber
        branch
        profile {
          id
          name
          description
          permissions
          modifiedBy
          modifiedOn
        }
        documentAttachment
        modifiedBy
        modifiedOn
      }
    }
  }
`;

export const CREATE_KYC_TYPE = gql`
  mutation CreateKYCType(
    $kycTypeCode: String!
    $kycTypeName: String!
    $kycTypeDescription: String!
    $modifiedBy: String!
    $modifiedOn: String!
  ) {
    createKYCType(
      kycTypeCode: $kycTypeCode
      kycTypeName: $kycTypeName
      kycTypeDescription: $kycTypeDescription
      modifiedBy: $modifiedBy
      modifiedOn: $modifiedOn
    ) {
      kycTypeCode
      kycTypeName
      kycTypeDescription
      modifiedBy
      modifiedOn
    }
  }
`;

export const CREATE_MANDATE_TYPE = gql`
  mutation CreateMandateType(
    $mandateTypeCode: String!
    $mandateTypeName: String!
    $mandateTypeDescription: String!
    $modifiedBy: String!
    $modifiedOn: String!
  ) {
    createMandateType(
      mandateTypeCode: $mandateTypeCode
      mandateTypeName: $mandateTypeName
      mandateTypeDescription: $mandateTypeDescription
      modifiedBy: $modifiedBy
      modifiedOn: $modifiedOn
    ) {
      mandateTypeCode
      mandateTypeName
      mandateTypeDescription
      modifiedBy
      modifiedOn
    }
  }
`;

export const CREATE_INDIVIDUAL_KYC = gql`
  mutation CreateIndividualKYC(
    $kycType: String!
    $designation: String!
    $firstName: String!
    $middleName: String!
    $lastName: String!
    $phoneNumber: String!
    $emailAddress: String!
    $postalAddress: String!
    $physicalAddress: String!
    $country: String!
    $taxNumber: String!
    $idType: String!
    $idNumber: String!
    $sex: String!
    $nationality: String!
    $riskRating: String!
    $attachDocumentsField: String!
    $signature: String!
    $modifiedBy: String!
    $modifiedOn: String!
  ) {
    createIndividualKYC(
      kycType: $kycType
      designation: $designation
      firstName: $firstName
      middleName: $middleName
      lastName: $lastName
      phoneNumber: $phoneNumber
      emailAddress: $emailAddress
      postalAddress: $postalAddress
      physicalAddress: $physicalAddress
      country: $country
      taxNumber: $taxNumber
      idType: $idType
      idNumber: $idNumber
      sex: $sex
      nationality: $nationality
      riskRating: $riskRating
      attachDocumentsField: $attachDocumentsField
      signature: $signature
      modifiedBy: $modifiedBy
      modifiedOn: $modifiedOn
    ) {
      IndividualKYCId
      kycType
      designation
      firstName
      middleName
      lastName
      phoneNumber
      emailAddress
      postalAddress
      physicalAddress
      country
      taxNumber
      idType
      idNumber
      sex
      nationality
      riskRating
      attachDocumentsField
      signature
      modifiedBy
      modifiedOn
    }
  }
`;

export const CREATE_BUSINESS_KYC = gql`
  mutation CreateBusinessKYC($kycType: String!, $legalEntityName: String!, $legalStatus: String!, $dateOfIncorporation: String!, $registrationNumber: String!, $natureOfBusiness: String!, $entityNationality: String!, $entityPinNumber: String!, $entityTaxNumber: String!, $telephoneNumber: String!, $emailAddress: String!, $postalAddress: String!, $physicalAddress: String!, $riskRating: String!, $attachDocumentsField: String!, $modifiedBy: String!, $modifiedOn: String!) {
  createBusinessKYC(kycType: $kycType, legalEntityName: $legalEntityName, legalStatus: $legalStatus, dateOfIncorporation: $dateOfIncorporation, registrationNumber: $registrationNumber, natureOfBusiness: $natureOfBusiness, entityNationality: $entityNationality, entityPINNumber: $entityPinNumber, entityTaxNumber: $entityTaxNumber, telephoneNumber: $telephoneNumber, emailAddress: $emailAddress, postalAddress: $postalAddress, physicalAddress: $physicalAddress, riskRating: $riskRating, attachDocumentsField: $attachDocumentsField, modifiedBy: $modifiedBy, modifiedOn: $modifiedOn) {
    businessKYCId
    kycType
    legalEntityName
    legalStatus
    dateOfIncorporation
    registrationNumber
    natureOfBusiness
    entityNationality
    entityPinNumber
    entityTaxNumber
    telephoneNumber
    emailAddress
    postalAddress
    physicalAddress
    riskRating
    attachDocumentsField
    modifiedBy
    modifiedOn
  }
}
`;
export const CREATE_LEDGER_ACCOUNT_CATEGORIES = gql`
  mutation CreateAccountCategory(
    $ledgerCategory: String!
    $description: String!
    $categoryNumber: String!
    $modifiedBy: String!
  ) {
    createAccountCategory(
      ledgerCategory: $ledgerCategory
      description: $description
      categoryNumber: $categoryNumber
      modifiedBy: $modifiedBy
    ) {
      ledgerCategory
      description
      categoryNumber
      modifiedBy
    }
  }
`;
export const DELETE_MANDATE_TYPE = gql`
  mutation DeleteMandateType($mandateTypeId: String!) {
    deleteMandateType(mandateTypeId: $mandateTypeId) {
      mandateTypeId
      mandateTypeName
      mandateTypeDescription
      mandateTypeCode
      modifiedBy
      modifiedOn
    }
  }
`;
export const DELETE_ACCOUNT_CATEGORY_TYPE = gql`
  mutation DeleteAccountCategory($deleteAccountCategoryId: String!) {
    deleteAccountCategory(id: $deleteAccountCategoryId) {
      id
      ledgerCategory
      description
      categoryNumber
      modifiedBy
      modifiedOn
    }
  }
`;

export const CREATE_MANDATE = gql`
  mutation CreateMandate(
    $signatory: String!
    $category: String!
    $mandateType: String!
    $modifiedBy: String!
    $modifiedOn: String!
  ) {
    createMandate(
      signatory: $signatory
      category: $category
      mandateType: $mandateType
      modifiedBy: $modifiedBy
      modifiedOn: $modifiedOn
    ) {
      signatory
      category
      mandateType
      modifiedBy
      modifiedOn
      mandateId
    }
  }
`;

export const UPDATE_MANDATE = gql`
mutation UpdateMandate($mandateId: String!, $signatory: String!, $category: String!, $mandateType: String!, $modifiedBy: String!, $modifiedOn: String!) {
  updateMandate(mandateId: $mandateId, signatory: $signatory, category: $category, mandateType: $mandateType, modifiedBy: $modifiedBy, modifiedOn: $modifiedOn) {
    mandateId
    signatory
    category
    mandateType
    modifiedBy
    modifiedOn
  }
}
`

export const CREATE_RETAIL = gql`
  mutation CreateRetail(
    $retailType: String!
    $individualKyc: String!
    $productTypes: String!
    $accountCurrency: String!
    $riskRating: String!
    $accountMandates: [String!]!
    $modifiedBy: String!
    $modifiedOn: String!
  ) {
    createRetail(
      retailType: $retailType
      individualKYC: $individualKyc
      productTypes: $productTypes
      accountCurrency: $accountCurrency
      riskRating: $riskRating
      accountMandates: $accountMandates
      modifiedBy: $modifiedBy
      modifiedOn: $modifiedOn
    ) {
      retailId
    retailType
    individualKYC {
      IndividualKYCId
      kycType
      designation
      firstName
      middleName
      lastName
      phoneNumber
      emailAddress
      postalAddress
      physicalAddress
      country
      taxNumber
      idType
      idNumber
      sex
      nationality
      riskRating
      attachDocumentsField
      signature
      modifiedBy
      modifiedOn
    }
    productTypes {
      productTypeId
      productTypeName
      description
      active
      interestBearing
      fixedInterestRate
      effectiveDate
      fees
      feeTypes {
        feeTypeId
        feeTypeName
        description
        transactionTypes {
          transactionTypeId
          transactionTypeName
          transactionTypeCode
          description
          currency
          modifiedBy
          modifiedOn
        }
        paymentFrequency
        effectiveDate
        fixedRate
        modifiedBy
        modifiedOn
      }
      riskRating
      prefix
      numberSchema
      startingValue
      modifiedBy
      modifiedOn
    }
    accountCurrency
    riskRating
    accountMandates
    modifiedBy
    modifiedOn
    }
  }
`;

export const UPDATE_RETAIL = gql`
mutation UpdateRetail($retailId: String!, $retailType: String!, $individualKyc: String!, $productTypes: String!, $accountCurrency: String!, $riskRating: String!, $accountMandates: [String!]!, $modifiedBy: String!, $modifiedOn: String!) {
  updateRetail(retailId: $retailId, retailType: $retailType, individualKYC: $individualKyc, productTypes: $productTypes, accountCurrency: $accountCurrency, riskRating: $riskRating, accountMandates: $accountMandates, modifiedBy: $modifiedBy, modifiedOn: $modifiedOn) {
    retailId
    retailType
    individualKYC {
      IndividualKYCId
      kycType
      designation
      firstName
      middleName
      lastName
      phoneNumber
      emailAddress
      postalAddress
      physicalAddress
      country
      taxNumber
      idType
      idNumber
      sex
      nationality
      riskRating
      attachDocumentsField
      signature
      modifiedBy
      modifiedOn
    }
    productTypes {
      productTypeId
      productTypeName
      description
      active
      interestBearing
      fixedInterestRate
      effectiveDate
      fees
      feeTypes {
        feeTypeId
        feeTypeName
        description
        transactionTypes {
          transactionTypeId
          transactionTypeName
          transactionTypeCode
          description
          currency
          modifiedBy
          modifiedOn
        }
        paymentFrequency
        effectiveDate
        fixedRate
        modifiedBy
        modifiedOn
      }
      riskRating
      prefix
      numberSchema
      startingValue
      modifiedBy
      modifiedOn
    }
    accountCurrency
    riskRating
    accountMandates
    modifiedBy
    modifiedOn
  }
}
`

export const CREATE_CUSTOMER = gql`
mutation CreateCustomer($customerType: String, $retail: String, $business: String, $accounts: [String], $accountMandates: [String], $mandateRules: [String], $modifiedBy: String, $modifiedOn: String) {
  createCustomer(customerType: $customerType, retail: $retail, business: $business, accounts: $accounts, accountMandates: $accountMandates, mandateRules: $mandateRules, modifiedBy: $modifiedBy, modifiedOn: $modifiedOn) {
    customerId
    customerType
    retail {
      retailId
      retailType
      individualKYC {
        IndividualKYCId
        kycType
        designation
        firstName
        middleName
        lastName
        phoneNumber
        emailAddress
        postalAddress
        physicalAddress
        country
        taxNumber
        idType
        idNumber
        sex
        nationality
        riskRating
        attachDocumentsField
        signature
        modifiedBy
        modifiedOn
      }
      productTypes {
        productTypeId
        productTypeName
        description
        active
        interestBearing
        fixedInterestRate
        effectiveDate
        fees
        feeTypes {
          feeTypeId
          feeTypeName
          description
          transactionTypes {
            transactionTypeId
            transactionTypeName
            transactionTypeCode
            description
            currency
            modifiedBy
            modifiedOn
          }
          paymentFrequency
          effectiveDate
          fixedRate
          modifiedBy
          modifiedOn
        }
        riskRating
        prefix
        numberSchema
        startingValue
        modifiedBy
        modifiedOn
      }
      accountCurrency
      riskRating
      accountMandates
      modifiedBy
      modifiedOn
    }
    business {
      businessId
      legalEntityName
      businessKYC
      productTypes
      accountCurrency
      riskRating
      directorsKYC
      accountMandates
      modifiedBy
      modifiedOn
    }
    accounts {
      id
      name
      account_owner
      account_number
      account_type
      description
      branch_id
      normal_balance
    }
    accountMandates {
      mandateId
      signatory
      category
      mandateType
      modifiedBy
      modifiedOn
    }
    mandateRules {
      mandateRuleId
      customerId
      mandateType
      signingRule
      minimumTransactionAmount
      maximumTransactionAmount
      maximumDailyLimit
      modifiedBy
      modifiedOn
    }
    modifiedBy
    modifiedOn
  }
}
`;

export const UPDATE_CUSTOMER = gql`
mutation UpdateCustomer($customerId: String, $customerType: String, $retail: String, $business: String, $accounts: [String], $accountMandates: [String], $mandateRules: [String], $modifiedBy: String, $modifiedOn: String) {
  updateCustomer(customerId: $customerId, customerType: $customerType, retail: $retail, business: $business, accounts: $accounts, accountMandates: $accountMandates, mandateRules: $mandateRules, modifiedBy: $modifiedBy, modifiedOn: $modifiedOn) {
    business {
      businessId
      legalEntityName
      businessKYC
      productTypes
      accountCurrency
      riskRating
      directorsKYC
      accountMandates
      modifiedBy
      modifiedOn
    }
    retail {
      retailId
      retailType
      individualKYC {
        IndividualKYCId
        kycType
        designation
        firstName
        middleName
        lastName
        phoneNumber
        emailAddress
        postalAddress
        physicalAddress
        country
        taxNumber
        idType
        idNumber
        sex
        nationality
        riskRating
        attachDocumentsField
        signature
        modifiedBy
        modifiedOn
      }
      productTypes {
        productTypeId
        productTypeName
        description
        active
        interestBearing
        fixedInterestRate
        effectiveDate
        fees
        feeTypes {
          feeTypeId
          feeTypeName
          description
          transactionTypes {
            transactionTypeId
            transactionTypeName
            transactionTypeCode
            description
            currency
            modifiedBy
            modifiedOn
          }
          paymentFrequency
          effectiveDate
          fixedRate
          modifiedBy
          modifiedOn
        }
        riskRating
        prefix
        numberSchema
        startingValue
        modifiedBy
        modifiedOn
      }
      accountCurrency
      riskRating
      accountMandates
      modifiedBy
      modifiedOn
    }
    accounts {
      id
      name
      account_owner
      account_number
      account_type
      description
      branch_id
      normal_balance
    }
    accountMandates {
      mandateId
      signatory
      category
      mandateType
      modifiedBy
      modifiedOn
    }
    customerId
    customerType
    mandateRules {
      mandateRuleId
      customerId
      mandateType
      signingRule
      minimumTransactionAmount
      maximumTransactionAmount
      maximumDailyLimit
      modifiedBy
      modifiedOn
    }
    modifiedBy
    modifiedOn
  }
}
`

export const DELETE_CUSTOMER = gql`
mutation DeleteCustomer($customerId: String) {
  deleteCustomer(customerId: $customerId) {
    customerId
    customerType
    retail {
      retailId
      retailType
      individualKYC {
        IndividualKYCId
        kycType
        designation
        firstName
        middleName
        lastName
        phoneNumber
        emailAddress
        postalAddress
        physicalAddress
        country
        taxNumber
        idType
        idNumber
        sex
        nationality
        riskRating
        attachDocumentsField
        signature
        modifiedBy
        modifiedOn
      }
      productTypes {
        productTypeId
        productTypeName
        description
        active
        interestBearing
        fixedInterestRate
        effectiveDate
        fees
        feeTypes {
          feeTypeId
          feeTypeName
          description
          transactionTypes {
            transactionTypeId
            transactionTypeName
            transactionTypeCode
            description
            currency
            modifiedBy
            modifiedOn
          }
          paymentFrequency
          effectiveDate
          fixedRate
          modifiedBy
          modifiedOn
        }
        riskRating
        prefix
        numberSchema
        startingValue
        modifiedBy
        modifiedOn
      }
      accountCurrency
      riskRating
      accountMandates
      modifiedBy
      modifiedOn
    }
    business {
      businessId
      legalEntityName
      businessKYC
      productTypes
      accountCurrency
      riskRating
      directorsKYC
      accountMandates
      modifiedBy
      modifiedOn
    }
    accounts {
      id
      name
      account_owner
      account_number
      account_type
      description
      branch_id
      normal_balance
    }
    accountMandates {
      mandateId
      signatory
      category
      mandateType
      modifiedBy
      modifiedOn
    }
    mandateRules {
      mandateRuleId
      customerId
      mandateType
      signingRule
      minimumTransactionAmount
      maximumTransactionAmount
      maximumDailyLimit
      modifiedBy
      modifiedOn
    }
    modifiedBy
    modifiedOn
  }
}
`

export const CREATE_MANDATE_RULE = gql`
  mutation CreateMandateRule(
    $customerId: String!
    $mandateType: String!
    $signingRule: String!
    $minimumTransactionAmount: String!
    $maximumTransactionAmount: String!
    $maximumDailyLimit: String!
    $modifiedBy: String!
    $modifiedOn: String!
  ) {
    createMandateRule(
      customerId: $customerId
      mandateType: $mandateType
      signingRule: $signingRule
      minimumTransactionAmount: $minimumTransactionAmount
      maximumTransactionAmount: $maximumTransactionAmount
      maximumDailyLimit: $maximumDailyLimit
      modifiedBy: $modifiedBy
      modifiedOn: $modifiedOn
    ) {
      mandateRuleId
      customerId
      mandateType
      signingRule
      minimumTransactionAmount
      maximumTransactionAmount
      maximumDailyLimit
      modifiedBy
      modifiedOn
    }
  }
`;

export const UPDATE_MANDATE_RULE = gql`
mutation UpdateMandateRule($mandateRuleId: String!, $customerId: String!, $mandateType: String!, $signingRule: String!, $minimumTransactionAmount: String!, $maximumTransactionAmount: String!, $maximumDailyLimit: String!, $modifiedBy: String!, $modifiedOn: String!) {
  updateMandateRule(mandateRuleId: $mandateRuleId, customerId: $customerId, mandateType: $mandateType, signingRule: $signingRule, minimumTransactionAmount: $minimumTransactionAmount, maximumTransactionAmount: $maximumTransactionAmount, maximumDailyLimit: $maximumDailyLimit, modifiedBy: $modifiedBy, modifiedOn: $modifiedOn) {
    mandateRuleId
    customerId
    mandateType
    signingRule
    minimumTransactionAmount
    maximumTransactionAmount
    maximumDailyLimit
    modifiedBy
    modifiedOn
  }
}
`

export const UPDATE_MANDATE_TYPE = gql`
  mutation UpdateMandateType(
    $mandateTypeId: String!
    $mandateTypeName: String!
    $mandateTypeDescription: String!
    $mandateTypeCode: String!
    $modifiedBy: String!
    $modifiedOn: String!
  ) {
    updateMandateType(
      mandateTypeId: $mandateTypeId
      mandateTypeName: $mandateTypeName
      mandateTypeDescription: $mandateTypeDescription
      mandateTypeCode: $mandateTypeCode
      modifiedBy: $modifiedBy
      modifiedOn: $modifiedOn
    ) {
      mandateTypeId
      mandateTypeName
      mandateTypeDescription
      mandateTypeCode
      modifiedBy
      modifiedOn
    }
  }
`;
export const CREATE_APP_SETTING = gql`
  mutation CreateSetting(
    $name: String!
    $value: String!
    $description: String!
    $hidden: Boolean!
    $modifiedBy: String!
  ) {
    createSetting(
      name: $name
      value: $value
      description: $description
      hidden: $hidden
      modifiedBy: $modifiedBy
    ) {
      id
      name
      value
      description
      hidden
      modifiedBy
      modifiedOn
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_APP_SETTING = gql`
  mutation DeleteSetting($deleteSettingId: String!) {
    deleteSetting(id: $deleteSettingId) {
      id
      name
      value
      description
      hidden
      modifiedBy
      modifiedOn
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_APP_SETTING = gql`
  mutation UpdateSetting(
    $updateSettingId: String!
    $name: String!
    $value: String!
    $description: String!
    $hidden: Boolean!
    $modifiedBy: String!
  ) {
    updateSetting(
      id: $updateSettingId
      name: $name
      value: $value
      description: $description
      hidden: $hidden
      modifiedBy: $modifiedBy
    ) {
      id
      name
      value
      description
      hidden
      modifiedBy
      modifiedOn
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_USER_PROFILE = gql`
  mutation CreateProfile(
    $name: String!
    $description: String
    $permissions: [String]
    $modifiedBy: String
  ) {
    createProfile(
      name: $name
      description: $description
      permissions: $permissions
      modifiedBy: $modifiedBy
    ) {
      id
      name
      description
      permissions
      modifiedBy
      modifiedOn
    }
  }
`;

export const DELETE_USER_PROFILE = gql`
  mutation DeleteProfile($deleteProfileId: String!) {
    deleteProfile(id: $deleteProfileId) {
      id
      name
      description
      permissions
      modifiedBy
      modifiedOn
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $updateUserId: String!
    $username: String!
    $firstName: String!
    $middleName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $phoneNumber: String!
    $employeeNumber: String!
    $branch: String!
    $profile: String!
    $documentAttachment: String!
    $modifiedBy: String!
    $modifiedOn: String!
  ) {
    updateUser(
      id: $updateUserId
      username: $username
      firstName: $firstName
      middleName: $middleName
      lastName: $lastName
      email: $email
      password: $password
      confirmPassword: $confirmPassword
      phoneNumber: $phoneNumber
      employeeNumber: $employeeNumber
      branch: $branch
      profile: $profile
      documentAttachment: $documentAttachment
      modifiedBy: $modifiedBy
      modifiedOn: $modifiedOn
    ) {
      id
      username
      firstName
      middleName
      lastName
      email
      password
      confirmPassword
      phoneNumber
      employeeNumber
      branch
      profile {
        id
        name
        description
        permissions
        modifiedBy
        modifiedOn
      }
      documentAttachment
      modifiedBy
      modifiedOn
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: String!) {
    deleteUser(id: $deleteUserId) {
      id
      username
      firstName
      middleName
      lastName
      email
      password
      confirmPassword
      phoneNumber
      employeeNumber
      branch
      profile {
        id
        name
        description
        permissions
        modifiedBy
        modifiedOn
      }
      documentAttachment
      modifiedBy
      modifiedOn
    }
  }
`;

export const CREATE_LEDGER_ACCOUNT = gql`
  mutation CreateLedgerAccount(
    $accountNumber: String!
    $exportAccountNumber: String!
    $description: String!
    $customerAccountNumber: String!
    $ledgerAccountNumber: String!
    $branchId: String!
    $chartString: String!
    $accountCategoryId: String!
    $normalBalance: String!
  ) {
    createLedgerAccount(
      account_number: $accountNumber
      export_account_number: $exportAccountNumber
      description: $description
      customer_account_number: $customerAccountNumber
      ledger_account_number: $ledgerAccountNumber
      branch_id: $branchId
      chart_string: $chartString
      accountCategoryId: $accountCategoryId
      normal_balance: $normalBalance
    ) {
      id
      account_number
      export_account_number
      description
      customer_account_number
      ledger_account_number
      branch_id
      chart_string
      accountCategoryId
      account_category {
        id
        ledgerCategory
        description
        categoryNumber
        modifiedBy
        modifiedOn
      }
    }
  }
`;

export const UPDATE_LEDGER_ACCOUNT = gql`
mutation UpdateLedgerAccount($updateLedgerAccountId: String!, $accountNumber: String!, $exportAccountNumber: String!, $description: String!, $customerAccountNumber: String!, $ledgerAccountNumber: String!, $branchId: String!, $chartString: String!, $accountCategoryId: String!, $normalBalance: String!) {
  updateLedgerAccount(id: $updateLedgerAccountId, account_number: $accountNumber, export_account_number: $exportAccountNumber, description: $description, customer_account_number: $customerAccountNumber, ledger_account_number: $ledgerAccountNumber, branch_id: $branchId, chart_string: $chartString, accountCategoryId: $accountCategoryId, normal_balance: $normalBalance) {
    id
    account_number
    export_account_number
    description
    customer_account_number
    ledger_account_number
    branch_id
    chart_string
    accountCategoryId
    account_category {
      id
      ledgerCategory
      description
      categoryNumber
      modifiedBy
      modifiedOn
    }
  }
}
`;

export const DELETE_LEDGER_ACCOUNT = gql`
mutation DeleteLedgerAccount($deleteLedgerAccountId: String!) {
  deleteLedgerAccount(id: $deleteLedgerAccountId) {
    id
    account_number
    export_account_number
    description
    customer_account_number
    ledger_account_number
    branch_id
    chart_string
    accountCategoryId
    account_category {
      id
      ledgerCategory
      description
      categoryNumber
      modifiedBy
      modifiedOn
    }
  }
}
`

export const CREATE_LEDGER_RULE = gql`
mutation CreateLedgerRule($name: String!, $description: String!, $transactionType: String!, $contains: String!, $doesNotContain: String!, $from: String!, $to: String!, $debitAccount: String!, $creditAccount: String!, $modifiedBy: String!) {
  createLedgerRule(name: $name, description: $description, transactionType: $transactionType, contains: $contains, doesNotContain: $doesNotContain, from: $from, to: $to, debitAccount: $debitAccount, creditAccount: $creditAccount, modifiedBy: $modifiedBy) {
    id
    name
    description
    transactionType
    contains
    doesNotContain
    from
    to
    debitAccount
    creditAccount
    modifiedBy
  }
}
`

export const UPDATE_LEDGER_RULE = gql`
mutation UpdateLedgerRule($updateLedgerRuleId: String!, $name: String!, $description: String!, $transactionType: String!, $contains: String!, $doesNotContain: String!, $from: String!, $to: String!, $debitAccount: String!, $creditAccount: String!, $modifiedBy: String!) {
  updateLedgerRule(id: $updateLedgerRuleId, name: $name, description: $description, transactionType: $transactionType, contains: $contains, doesNotContain: $doesNotContain, from: $from, to: $to, debitAccount: $debitAccount, creditAccount: $creditAccount, modifiedBy: $modifiedBy) {
    id
    name
    description
    transactionType
    contains
    doesNotContain
    from
    to
    debitAccount
    creditAccount
    modifiedBy
  }
}
`;

export const DELETE_LEDGER_RULE = gql`
mutation DeleteLedgerRule($deleteLedgerRuleId: String!) {
  deleteLedgerRule(id: $deleteLedgerRuleId) {
    id
    name
    description
    transactionType
    contains
    doesNotContain
    from
    to
    debitAccount
    creditAccount
    modifiedBy
  }
}
`

export const CREATE_ACCOUNT = gql`
mutation CreateAccount($name: String!, $accountOwner: String!, $accountNumber: String!, $accountType: String!, $description: String!, $branchId: String!, $normalBalance: String!) {
  createAccount(name: $name, account_owner: $accountOwner, account_number: $accountNumber, account_type: $accountType, description: $description, branch_id: $branchId, normal_balance: $normalBalance) {
    id
    name
    account_owner
    account_number
    account_type
    description
    branch_id
    normal_balance
  }
}
`

export const UPDATE_ACCOUNT = gql`
mutation UpdateAccount($updateAccountId: String!, $name: String!, $accountOwner: String!, $accountNumber: String!, $accountType: String!, $description: String!, $branchId: String!, $normalBalance: String!) {
  updateAccount(id: $updateAccountId, name: $name, account_owner: $accountOwner, account_number: $accountNumber, account_type: $accountType, description: $description, branch_id: $branchId, normal_balance: $normalBalance) {
    id
    name
    account_owner
    account_number
    account_type
    description
    branch_id
    normal_balance
  }
}
`
