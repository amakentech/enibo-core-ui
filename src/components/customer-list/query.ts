import { gql } from "@apollo/client";

const queryCustomersList = gql`
query BusinessKYC {
  customers {
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
      businessKYC {
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
      directorsKYC {
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

  export default queryCustomersList;