import { FC, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KYCIndividual, MandateType } from "@/types/global";
import { gql, useMutation, useQuery } from "@apollo/client";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "@/store/state";
import {
  CREATE_ACCOUNT,
  CREATE_BUSINESS,
  CREATE_CUSTOMER,
  CREATE_MANDATE,
  CREATE_RETAIL,
  UPDATE_ACCOUNT,
  UPDATE_BUSINESS,
  UPDATE_CUSTOMER,
  UPDATE_MANDATE,
  UPDATE_RETAIL,
} from "@/types/mutations";
import { toast } from "../ui/use-toast";

const businessRetailSchema = z.object({
  mandates: z.array(
    z.object({
      signatory: z.string().min(3, { message: "Signatory is required" }),
      mandateType: z.string().min(3, { message: "Mandate Type is required" }),
      category: z.string().min(3, { message: "Category is required" }),
    })
  ),
});

type BusinessRetailInput = z.infer<typeof businessRetailSchema>;

const GET_MANDATE_TYPES = gql`
  query MandateTypes {
    mandateTypes {
      mandateTypeId
      mandateTypeName
      mandateTypeCode
    }
  }
`;

const GET_INDIVIDUAL_KYCS = gql`
  query IndividualKYCs {
    individualKYCs {
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

interface CustomerMandatesProps {}

const CustomerMandates: FC<CustomerMandatesProps> = () => {
  const { customerId } = useParams();
  const isEditMode = customerId ? true : false;
  const [mandateTypes, setMandateTypes] = useState<MandateType[]>([]);
  const [individualKYCs, setIndividualKYCs] = useState<KYCIndividual[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { appState, setAppState } = useAppState();
  const [accountMandates, setAccountMandates] = useState([
    {
      signatory: [],
      mandateType: [],
      category: "",
    },
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BusinessRetailInput>({
    resolver: zodResolver(businessRetailSchema),
  });
  useEffect(() => {
    if (isEditMode && appState.customerData) {
      const newMandates = appState.customerData.accountMandates.map(
        (mandate) => {
          return {
            signatory: mandate.signatory,
            mandateType: mandate.mandateType,
            category: mandate.category,
          };
        }
      );
      setValue("mandates", newMandates);
    }
  }, [appState, isEditMode, setValue]);

  const { data: mandateData } = useQuery(GET_MANDATE_TYPES);
  useEffect(() => {
    if (mandateData && mandateData.mandateTypes) {
      setMandateTypes(mandateData.mandateTypes);
    }
  }, [mandateData]);

  const { data: individualKycData } = useQuery(GET_INDIVIDUAL_KYCS);
  console.log(individualKycData);
  useEffect(() => {
    if (individualKycData && individualKycData.individualKYCs) {
      setIndividualKYCs(individualKycData.individualKYCs);
    }
  }, [individualKycData]);
  const navigate = useNavigate();
  const [createMandate] = useMutation(CREATE_MANDATE);
  const [updateMandate] = useMutation(UPDATE_MANDATE);
  const [createRetail] = useMutation(CREATE_RETAIL);
  const [updateRetail] = useMutation(UPDATE_RETAIL);
  const [createCustomer] = useMutation(CREATE_CUSTOMER);
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);
  const [createAccount] = useMutation(CREATE_ACCOUNT);
  const [updateAccount] = useMutation(UPDATE_ACCOUNT);
  const [createBusiness] = useMutation(CREATE_BUSINESS);
  const [updateBusiness] = useMutation(UPDATE_BUSINESS);

  const saveData = async (data: BusinessRetailInput) => {
    //loop through mandates and create a new mandate for each and return the new mandates
    const mandates = await Promise.all(
      data.mandates.map(async (mandate) => {
        const response = await createMandate({
          variables: {
            signatory: mandate.signatory,
            mandateType: mandate.mandateType,
            category: mandate.category,
            modifiedBy: user.id,
            modifiedOn: new Date(new Date().toString().split("GMT")[0] + " UTC")
              .toISOString()
              .split(".")[0],
          },
        });
        return response.data.createMandate; // Assuming the response contains the data property
      })
    );
    if (mandates && mandates.length > 0) {
      setAppState({
        ...appState,
        mandates: mandates,
      });
    }
    // Create Retail and Customer
    if (appState.customerType === "retail") {
      const retail = await createRetail({
        variables: {
          retailType: appState.customerType,
          individualKyc: appState.accountOwners[0].kycId,
          productTypes: appState.productInput.productTypes,
          accountCurrency: appState.product.accountCurrency,
          riskRating: appState.product.riskRating,
          accountMandates: mandates.map((mandate) => mandate.mandateId),
          modifiedBy: user.id,
          modifiedOn: new Date(new Date().toString().split("GMT")[0] + " UTC")
            .toISOString()
            .split(".")[0],
        },
      });
      setAppState({
        ...appState,
        retail: retail.data.createRetail.retailId,
      });

      const newMandates = mandates.map((mandate) => mandate.mandateId);
      const customer = await createCustomer({
        variables: {
          customerType: appState.customerType,
          retail: retail.data.createRetail.retailId,
          accountMandates: newMandates,
          modifiedBy: user.id,
          modifiedOn: new Date(new Date().toString().split("GMT")[0] + " UTC")
            .toISOString()
            .split(".")[0],
        },
      });

      setAppState({
        ...appState,
        customer: customer.data.createCustomer.customerId,
      });

      //create account for customer
      if (customer.data.createCustomer.customerId) {
        const account = await createAccount({
          variables: {
            name: customer.data.createCustomer.customerId,
            accountOwner: customer.data.createCustomer.customerId,
            accountNumber: customer.data.createCustomer.customerId,
            description: `Retail Account for ${customer.data.createCustomer.customerId}`,
            accountType: "Retail",
            branchId: `BRANCH-${customer.data.createCustomer.customerId}`,
            normalBalance: "CREDIT",
          },
        });

        //update customer with account
        if (account) {
          const updatedCustomer = await updateCustomer({
            variables: {
              customerId: customer.data.createCustomer.customerId,
              accounts: [account.data.createAccount.id],
              modifiedBy: user.id,
              modifiedOn: new Date(
                new Date().toString().split("GMT")[0] + " UTC"
              )
                .toISOString()
                .split(".")[0],
            },
          });
          toast({
            title: "Customer Created",
            description: `Customer ${updatedCustomer.data.updateCustomer.customerId} has been created successfully`,
          });
        }
      }
      toast({
        title: "Mandates Saved",
        description: "Mandates have been saved successfully",
      });
    } else {
      const business = await createBusiness({
        variables: {
          legalEntityName: appState.legalEntityName,
          businessKyc: appState.accountOwners[0].kycId,
          directorsKyc: appState.otherKYCs[0].kycId,
          productTypes: appState.productInput.productTypes,
          accountCurrency: appState.productInput.accountCurrency,
          riskRating: appState.productInput.riskRating,
          accountMandates: mandates.map((mandate) => mandate.mandateId),
          modifiedBy: user.id,
          modifiedOn: new Date(new Date().toString().split("GMT")[0] + " UTC")
            .toISOString()
            .split(".")[0],
        },
      });

      setAppState({
        ...appState,
        business: business.data.createBusiness.businessId,
      });

      const newMandates = mandates.map((mandate) => mandate.mandateId);
      const customer = await createCustomer({
        variables: {
          customerType: appState.customerType,
          business: business.data.createBusiness.businessId,
          accountMandates: newMandates,
          modifiedBy: user.id,
          modifiedOn: new Date(new Date().toString().split("GMT")[0] + " UTC")
            .toISOString()
            .split(".")[0],
        },
      });

      setAppState({
        ...appState,
        customer: customer.data.createCustomer.customerId,
      });

      //create account for customer
      if (customer.data.createCustomer.customerId) {
        const account = await createAccount({
          variables: {
            name: `${appState.legalEntityName} Account`,
            accountOwner: customer.data.createCustomer.customerId,
            accountNumber: customer.data.createCustomer.customerId,
            description: `Business Account for ${customer.data.createCustomer.customerId}`,
            accountType: "Business",
            branchId: `BRANCH-${customer.data.createCustomer.customerId}`,
            normalBalance: "CREDIT",
          },
        });

        //update customer with account
        if (account) {
          const updatedCustomer = await updateCustomer({
            variables: {
              customerId: customer.data.createCustomer.customerId,
              accounts: [account.data.createAccount.id],
              modifiedBy: user.id,
              modifiedOn: new Date(
                new Date().toString().split("GMT")[0] + " UTC"
              )
                .toISOString()
                .split(".")[0],
            },
          });
          toast({
            title: "Customer Created",
            description: `Customer ${updatedCustomer.data.updateCustomer.customerId} has been created successfully`,
          });
        }
      }
      toast({
        title: "Data Saved",
        description: "Data has been saved successfully",
      });
    }
  };

  const updateData = async (data: BusinessRetailInput) => {
    //loop through mandates and create a new mandate for each and return the new mandates
    const mandates = await Promise.all(
      data.mandates.map(async (mandate) => {
        const response = await updateMandate({
          variables: {
            mandateId: appState.customerData?.accountMandates[0].mandateId,
            signatory: mandate.signatory,
            mandateType: mandate.mandateType,
            category: mandate.category,
            modifiedBy: user.id,
            modifiedOn: new Date(new Date().toString().split("GMT")[0] + " UTC")
              .toISOString()
              .split(".")[0],
          },
        });
        return response.data.updateMandate; // Assuming the response contains the data property
      })
    );
    if (mandates && mandates.length > 0) {
      setAppState({
        ...appState,
        mandates: mandates,
      });
    }

    // Update Retail and Customer
    if (appState.customerType === "retail") {
      const retail = await updateRetail({
        variables: {
          retailId: appState.customerData?.retail?.retailId,
          retailType: appState.customerData?.customerType,
          individualKyc: appState.accountOwners[0].kycId,
          productTypes: appState.productInput.productTypes,
          accountCurrency: appState.product.accountCurrency,
          riskRating: appState.product.riskRating,
          accountMandates: mandates.map((mandate) => mandate.mandateId),
          modifiedBy: user.id,
          modifiedOn: new Date(new Date().toString().split("GMT")[0] + " UTC")
            .toISOString()
            .split(".")[0],
        },
      });
      setAppState({
        ...appState,
        retail: retail.data.updateRetail.retailId,
      });

      const newMandates = mandates.map((mandate) => mandate.mandateId);
      const customer = await updateCustomer({
        variables: {
          customerId: appState.customerData?.customerId,
          customerType: appState.customerData?.customerType,
          retail: retail.data.updateRetail.retailId,
          accountMandates: newMandates,
          modifiedBy: user.id,
          modifiedOn: new Date(new Date().toString().split("GMT")[0] + " UTC")
            .toISOString()
            .split(".")[0],
        },
      });

      setAppState({
        ...appState,
        customer: customer.data.updateCustomer.customerId,
      });

      //update account for customer
      if (customer.data.updateCustomer.customerId) {
        const account = await updateAccount({
          variables: {
            updateAccountId: appState.customerData?.accounts[0].id,
            name: customer.data.updateCustomer.customerId,
            accountOwner: customer.data.updateCustomer.customerId,
            accountNumber: customer.data.updateCustomer.customerId,
            description: `Retail Account for ${customer.data.updateCustomer.customerId}`,
            accountType: appState.productInput.productTypes,
            branchId: `BRANCH-${customer.data.updateCustomer.customerId}`,
            normalBalance: "CREDIT",
          },
        });

        //update customer with account
        if (account) {
          const updatedCustomer = await updateCustomer({
            variables: {
              customerId: customer.data.updateCustomer.customerId,
              accounts: [account.data.updateAccount.id],
              modifiedBy: user.id,
              modifiedOn: new Date(
                new Date().toString().split("GMT")[0] + " UTC"
              )
                .toISOString()
                .split(".")[0],
            },
          });
          toast({
            title: "Customer Updated",
            description: `Customer ${updatedCustomer.data.updateCustomer.customerId} has been updated successfully`,
          });
        }
      }
    } else {
      const business = await updateBusiness({
        variables: {
          businessId: appState.customerData?.business?.businessId,
          legalEntityName: appState.legalEntityName,
          businessKyc: appState.accountOwners[0].kycId,
          directorsKyc: appState.otherKYCs[0].kycId,
          productTypes: appState.productInput.productTypes,
          accountCurrency: appState.product.accountCurrency,
          riskRating: appState.product.riskRating,
          accountMandates: mandates.map((mandate) => mandate.mandateId),
          modifiedBy: user.id,
          modifiedOn: new Date(new Date().toString().split("GMT")[0] + " UTC")
            .toISOString()
            .split(".")[0],
        },
      });

      setAppState({
        ...appState,
        business: business.data.updateBusiness.businessId,
      });

      const newMandates = mandates.map((mandate) => mandate.mandateId);
      const customer = await updateCustomer({
        variables: {
          customerId: appState.customerData?.customerId,
          customerType: appState.customerData?.customerType,
          business: business.data.updateBusiness.businessId,
          accountMandates: newMandates,
          modifiedBy: user.id,
          modifiedOn: new Date(new Date().toString().split("GMT")[0] + " UTC")
            .toISOString()
            .split(".")[0],
        },
      });

      setAppState({
        ...appState,
        customer: customer.data.updateCustomer.customerId,
      });

      //create account for customer
      if (customer.data.updateCustomer.customerId) {
        const account = await updateAccount({
          variables: {
            updateAccountId: appState.customerData?.accounts[0].id,
            name: `${appState.legalEntityName} Account`,
            accountOwner: customer.data.updateCustomer.customerId,
            accountNumber: customer.data.updateCustomer.customerId,
            description: `Business Account for ${customer.data.updateCustomer.customerId}`,
            accountType: "Business",
            branchId: `BRANCH-${customer.data.updateCustomer.customerId}`,
            normalBalance: "CREDIT",
          },
        });

        //update customer with account
        if (account) {
          const updatedCustomer = await updateCustomer({
            variables: {
              customerId: customer.data.updateCustomer.customerId,
              accounts: [account.data.updateAccount.id],
              modifiedBy: user.id,
              modifiedOn: new Date(
                new Date().toString().split("GMT")[0] + " UTC"
              )
                .toISOString()
                .split(".")[0],
            },
          });
          toast({
            title: "Customer Updated",
            description: `Customer ${updatedCustomer.data.updateCustomer.customerId} has been updated successfully`,
          });
        }
      }
    }
  };

  const checkIfSaved = () => {
    if ((appState.customer && appState.business) || appState.retail) {
      isEditMode
        ? navigate(`/customers/customer-wizard/${customerId}/mandate-rules`)
        : navigate("/customers/customer-wizard/mandate-rules");
    } else {
      toast({
        title: "Data Not Saved",
        description: "Please save data before proceeding",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: BusinessRetailInput) => {
    if (isEditMode) {
      updateData(data);
    } else {
      saveData(data);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col px-2 pt-1 pb-4 my-4 border">
          <div className="flex items-center justify-between">
            <h3>ACCOUNT MANDATES</h3>
            <Button
              variant="link"
              onClick={() =>
                setAccountMandates((prev) => [
                  ...prev,
                  { signatory: [], mandateType: [], category: "" },
                ])
              }
            >
              Add Mandate
            </Button>
          </div>
          {accountMandates.map((_mandate, index) => (
            <div className="flex items-center justify-center gap-4">
              <div className="w-[50%]">
                <Label
                  htmlFor="signatory"
                  className={index > 0 ? "sr-only" : ""}
                >
                  Signatory
                </Label>
                <Controller
                  control={control}
                  name={`mandates.${index}.signatory`}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Individual KYC" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Map over individualKYCs state to render select options */}
                        {individualKYCs.map((indKyc) => (
                          <SelectItem
                            key={indKyc.IndividualKYCId}
                            value={indKyc.IndividualKYCId}
                          >
                            {`${indKyc.firstName} ${indKyc.lastName} `}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.mandates?.[index]?.signatory && (
                  <div className="text-red-500">
                    {errors.mandates?.[index]?.signatory?.message}
                  </div>
                )}
              </div>
              <div className="w-[50%]">
                <Label
                  htmlFor="mandateType"
                  className={index > 0 ? "sr-only" : ""}
                >
                  Mandate Type
                </Label>
                <Controller
                  control={control}
                  name={`mandates.${index}.mandateType`}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Mandate Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Map over mandateTypes state to render select options */}
                        {mandateTypes.map((type) => (
                          <SelectItem
                            key={type.mandateTypeId}
                            value={type.mandateTypeId}
                          >
                            {type.mandateTypeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.mandates?.[index]?.mandateType && (
                  <div className="text-red-500">
                    {errors.mandates?.[index]?.mandateType?.message}
                  </div>
                )}
              </div>
              <div className="w-[50%]">
                <Label
                  htmlFor="category"
                  className={index > 0 ? "sr-only" : ""}
                >
                  Category
                </Label>
                <Controller
                  control={control}
                  name={`mandates.${index}.category`}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A12345">A</SelectItem>
                        <SelectItem value="B67890">B</SelectItem>
                        <SelectItem value="C13579">C</SelectItem>
                        <SelectItem value="D24680">D</SelectItem>
                        <SelectItem value="E97531">E</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.mandates?.[index]?.category && (
                  <div className="text-red-500">
                    {errors.mandates?.[index]?.category?.message}
                  </div>
                )}
              </div>
              <div className="w-[5%] flex justify-center items-center">
                <Button
                  size="icon"
                  className=""
                  onClick={() => {
                    setAccountMandates((prev) => {
                      const newMandates = [...prev];
                      newMandates.splice(index, 1);
                      return newMandates;
                    });
                  }}
                >
                  <X className="w-4 h-4 text-red-300" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-start gap-2 mt-4">
          <Button type="submit">Save</Button>
          <Button
            type="button"
            onClick={() =>
              isEditMode
                ? navigate(`/customers/customer-wizard/${customerId}/products`)
                : navigate("/customers/customer-wizard/products")
            }
          >
            Back
          </Button>
          <Button type="button" onClick={() => checkIfSaved()}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerMandates;
