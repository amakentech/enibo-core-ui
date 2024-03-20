import { FC, useState } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const queryKycList = gql`
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

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/store/state";
import { queryBusinessKYCs } from "@/types/queries";
import { KYCBusiness } from "@/types/global";

type IndividualKYC = {
  IndividualKYCId: string;
  kycType: string;
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
  attachDocumentsField: string;
  signature: string;
  modifiedBy: string;
  modifiedOn: string;
};

interface KYCSelectorProps {
  listType: string;
}

const KYCSelector: FC<KYCSelectorProps> = ({ listType }) => {
  const { appState, setAppState } = useAppState();
  const { data, loading, error } = useQuery(queryKycList);
  const { data: businessKycData } = useQuery(queryBusinessKYCs);
  const [selected, setSelected] = useState<IndividualKYC | undefined>();
  const [selectedBusiness, setSelectedBusiness] = useState<
    KYCBusiness | undefined
  >();
  const [tab, setTab] = useState(0);
  const [value, setValue] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const saveData = () => {
    if (listType === "accountOwners" && appState.customerType === "retail") {
      const inputData = {
        kycId: selected && selected.IndividualKYCId,
        createdBy: "John Doe",
        kycType: selected?.kycType,
        status: "Pending",
      };

      const isExist = appState.accountOwners.find(
        (individual) => individual.kycId === inputData?.kycId
      );
      if (isExist) {
        setOpen(false);
        return;
      }
      //check if selected is empty
      if (!selected) {
        setOpen(false);
        return;
      }

      setAppState({
        ...appState,
        accountOwners: [...appState.accountOwners, inputData],
      });
      setOpen(false);
    } else if (listType === "accountOwners" && appState.customerType === "business") {
      const inputData = {
        kycId: selectedBusiness && selectedBusiness.businessKYCId,
        createdBy: "John Doe",
        kycType: selectedBusiness?.kycType,
        status: "Pending",
      };

      const isExist = appState.accountOwners.find(
        (business) => business.kycId === inputData?.kycId
      );

      if (isExist) {
        setOpen(false);
        return;
      }

      //check if selected is empty
      if (!selectedBusiness) {
        setOpen(false);
        return;
      }
      setAppState({
        ...appState,
        legalEntityName: selectedBusiness.legalEntityName,
        accountOwners: [...appState.accountOwners, inputData],
      });
      setOpen(false);
    } else if (listType === "otherKYCs" && appState.customerType === "business") {
      //should be individual
      const inputData = {
        kycId: selected && selected.IndividualKYCId,
        createdBy: "John Doe",
        kycType: selected?.kycType,
        status: "Pending",
      };

      const isExist = appState.otherKYCs.find(
        (individual) => individual.kycId === inputData?.kycId
      );
      
      if (isExist) {
        setOpen(false);
        return;
      }
      
      //check if selected is empty
      if (!selected) {
        setOpen(false);
        return;
      }

      setAppState({
        ...appState,
        otherKYCs: [...appState.otherKYCs, inputData],
      });
      setOpen(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  if (!data) return <div>No data</div>;
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>Add KYC</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Select KYC</DialogTitle>
        <div className="flex my-1">
          <Button
            type="button"
            onClick={() => setTab(0)}
            variant="ghost"
            className={`rounded-none border-b ${
              tab === 0 ? " border-blue-500 bg-accent" : ""
            }`}
          >
            Individual KYC
          </Button>
          <Button
            type="button"
            onClick={() => setTab(1)}
            variant="ghost"
            className={`rounded-none border-b ${
              tab === 1 ? " border-blue-500 bg-accent" : ""
            }`}
          >
            Business KYC
          </Button>
        </div>
        {tab === 0 && (
          <div>
            <Command>
              <CommandInput placeholder="Search kyc..." className="h-9" />
              <CommandEmpty>No account found.</CommandEmpty>
              <CommandGroup>
                {selected ? (
                  //   filter the selected kyc
                  <CommandItem>
                    <div className="">
                      <h3>
                        {
                          data.individualKYCs.find(
                            (kyc: IndividualKYC) =>
                              kyc.IndividualKYCId === selected.IndividualKYCId
                          )?.kycType
                        }
                      </h3>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === selected.IndividualKYCId
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ) : (
                  data.individualKYCs.map((kyc: IndividualKYC) => (
                    <CommandItem
                      key={kyc.IndividualKYCId}
                      value={kyc.IndividualKYCId}
                      onSelect={(currentValue) => {
                        console.log(kyc.IndividualKYCId);
                        setValue(currentValue);
                        setSelected(kyc);
                      }}
                    >
                      <div className="">
                        <h3>
                          {kyc.firstName} {kyc.lastName}
                        </h3>
                        <p>{kyc.kycType}</p>
                      </div>
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === kyc.IndividualKYCId
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))
                )}
                {selected && (
                  <div className="mt-2 text-center">
                    <button
                      className="underline text-primary"
                      onClick={() => setSelected(undefined)}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
                <div className="flex justify-end mt-4">
                  <Button type="submit" onClick={saveData}>
                    Save
                  </Button>
                </div>
              </CommandGroup>
            </Command>
          </div>
        )}
        {tab === 1 && (
          <div>
            <Command>
              <CommandInput placeholder="Search kyc..." className="h-9" />
              <CommandEmpty>No account found.</CommandEmpty>
              <CommandGroup>
                {selectedBusiness ? (
                  //   filter the selected kyc
                  <CommandItem>
                    <div className="">
                      <h3>
                        {
                          businessKycData.businessKYCs.find(
                            (kyc: KYCBusiness) =>
                              kyc.businessKYCId ===
                              selectedBusiness.businessKYCId
                          )?.kycType
                        }
                      </h3>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === selectedBusiness.businessKYCId
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ) : (
                  businessKycData.businessKYCs.map((kyc: KYCBusiness) => (
                    <CommandItem
                      key={kyc.businessKYCId}
                      value={kyc.businessKYCId}
                      onSelect={(currentValue) => {
                        console.log(kyc.businessKYCId);
                        setValue(currentValue);
                        setSelectedBusiness(kyc);
                      }}
                    >
                      <div className="">
                        <h3>{kyc.legalEntityName}</h3>
                        <p>{kyc.kycType}</p>
                      </div>
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === kyc.businessKYCId
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))
                )}
                {selectedBusiness && (
                  <div className="mt-2 text-center">
                    <button
                      className="underline text-primary"
                      onClick={() => setSelectedBusiness(undefined)}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
                <div className="flex justify-end mt-4">
                  <Button type="submit" onClick={saveData}>
                    Save
                  </Button>
                </div>
              </CommandGroup>
            </Command>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KYCSelector;
