import { FC, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_INDIVIDUAL_KYC,
  UPDATE_INDIVIDUAL_KYC,
} from "@/types/mutations";
import queryKycTypesList from "./kyc-type-list/query";
import { KYCType } from "@/types/global";
import { queryIndividualKYC } from "@/types/queries";

const newKYCIndividualSchema = z.object({
  kycType: z.string().min(3, { message: "KYC Type is required" }),
  designation: z.string().min(2, { message: "Designation is required" }),
  firstName: z.string().min(3, { message: "First Name is required" }),
  middleName: z.string().min(3, { message: "Middle Name is required" }),
  lastName: z.string().min(3, { message: "Last Name is required" }),
  phoneNumber: z.string().min(3, { message: "Phone Number is required" }),
  emailAddress: z.string().min(3, { message: "Email Address is required" }),
  country: z.string().min(3, { message: "Country is required" }),
  taxNumber: z.string().min(3, { message: "Entity Tax Number is required" }),
  idType: z.string().min(3, { message: "Id Type is required" }),
  idNumber: z.string().min(3, { message: "Id Number is required" }),
  sex: z.string().min(3, { message: "Demographic data required" }),
  nationality: z.string().min(3, { message: "Nationality is required" }),
  postalAddress: z.string().min(3, { message: "Postal Address is required" }),
  physicalAddress: z
    .string()
    .min(3, { message: "Physical Address is required" }),
  riskRating: z.string().min(3, { message: "Risk Rating is required" }),
  attachDocumentsField: z
    .string()
    .min(3, { message: "Attach Documents is required" }),
  signature: z.string().min(3, { message: "Signature is required" }),
});

type NewKYCIndividualInput = z.infer<typeof newKYCIndividualSchema>;

interface NewKYCIndividualFormProps {}

const NewKYCIndividualForm: FC<NewKYCIndividualFormProps> = () => {
  const { IndividualKYCId } = useParams();
  const isEditMode = IndividualKYCId ? true : false;
  console.log(isEditMode);
  const storedIndividualKYC = JSON.parse(
    localStorage.getItem("individualKyc") || "{}"
  );
  const isCopyMode = storedIndividualKYC ? true : false;
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [createIndividualKyc] = useMutation(CREATE_INDIVIDUAL_KYC);
  const navigate = useNavigate();
  const [updateIndividualKyc] = useMutation(UPDATE_INDIVIDUAL_KYC);
  const [KYCTypes, setKycsTypes] = useState<KYCType[]>([]);

  const { data: individualKYCData } = useQuery(queryIndividualKYC, {
    variables: {
      individualKycId: IndividualKYCId,
    },
  });
  
  const defaultFormValues = {
    kycType: "",
    designation: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
    postalAddress: "",
    physicalAddress: "",
    country: "",
    taxNumber: "",
    idType: "",
    idNumber: "",
    sex: "",
    nationality: "",
    riskRating: "",
    attachDocumentsField: "",
    signature: "",
  };
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<NewKYCIndividualInput>({
    resolver: zodResolver(newKYCIndividualSchema),
    defaultValues: defaultFormValues,
  });

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery(queryKycTypesList);

  useEffect(() => {
    if (data) {
      setKycsTypes(data.kycTypes);
    }
  }, [data, queryLoading, queryError]);



  const handleCreate = (data: NewKYCIndividualInput) => {
    const formInput = {
      kycType: data.kycType, //TODO: get kyc type id from context
      designation: data.designation,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      emailAddress: data.emailAddress,
      postalAddress: data.postalAddress,
      physicalAddress: data.physicalAddress,
      country: data.country,
      taxNumber: data.taxNumber,
      idType: data.idType,
      idNumber: data.idNumber,
      sex: data.sex,
      nationality: data.nationality,
      riskRating: data.riskRating,
      attachDocumentsField: data.attachDocumentsField,
      signature: data.signature,
      modifiedBy: user.id, //TODO: get user id from context
      modifiedOn: new Date(new Date().toString().split("GMT")[0] + " UTC")
        .toISOString()
        .split(".")[0],
    };

    createIndividualKyc({ variables: formInput });

    toast({
      title: "New KYC Individual Created",
      description: "New KYC Individual has been created successfully",
    });
    localStorage.removeItem("individualKyc");
    navigate("/customers/customer-kycs", { replace: true });
  };

  const handleEdit = (data: NewKYCIndividualInput) => {
    console.log(data)
    const formInput = {
      individualKycId: IndividualKYCId,
      kycType: data.kycType, //TODO: get kyc type id from context
      designation: data.designation,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      emailAddress: data.emailAddress,
      postalAddress: data.postalAddress,
      physicalAddress: data.physicalAddress,
      country: data.country,
      taxNumber: data.taxNumber,
      idType: data.idType,
      idNumber: data.idNumber,
      sex: data.sex,
      nationality: data.nationality,
      riskRating: data.riskRating,
      attachDocumentsField: data.attachDocumentsField,
      signature: data.signature,
      modifiedBy: user.id, //TODO: get user id from context
      modifiedOn: new Date(new Date().toString().split("GMT")[0] + " UTC")
        .toISOString()
        .split(".")[0],
    };

    updateIndividualKyc({ variables: formInput });

    toast({
      title: "KYC Individual Updated",
      description: "KYC Individual has been updated successfully",
    });

    navigate("/customers/customer-kycs", { replace: true });
  };

  const onSubmit = (data: NewKYCIndividualInput) => {
    if (isEditMode) {
      handleEdit(data);
    } else {
      handleCreate(data);
    }
  };

  useEffect(() => {
    if (isEditMode && individualKYCData) {
      console.log(individualKYCData.individualKYC);
      const {
        kycType,
        designation,
        firstName,
        middleName,
        lastName,
        phoneNumber,
        emailAddress,
        postalAddress,
        physicalAddress,
        country,
        taxNumber,
        idType,
        idNumber,
        sex,
        nationality,
        riskRating,
        attachDocumentsField,
        signature,
      } = individualKYCData.individualKYC;
      setValue("kycType", kycType);
      setValue("designation", designation);
      setValue("firstName", firstName);
      setValue("middleName", middleName);
      setValue("lastName", lastName);
      setValue("phoneNumber", phoneNumber);
      setValue("emailAddress", emailAddress);
      setValue("postalAddress", postalAddress);
      setValue("physicalAddress", physicalAddress);
      setValue("country", country);
      setValue("taxNumber", taxNumber);
      setValue("idType", idType);
      setValue("idNumber", idNumber);
      setValue("sex", sex);
      setValue("nationality", nationality);
      setValue("riskRating", riskRating);
      setValue("attachDocumentsField", attachDocumentsField);
      setValue("signature", signature);
    }

    if (isCopyMode) {
      const {
        kycType,
        designation,
        firstName,
        middleName,
        lastName,
        phoneNumber,
        emailAddress,
        postalAddress,
        physicalAddress,
        country,
        taxNumber,
        idType,
        idNumber,
        sex,
        nationality,
        riskRating,
        attachDocumentsField,
        signature,
      } = storedIndividualKYC;
      setValue("kycType", kycType);
      setValue("designation", designation);
      setValue("firstName", firstName);
      setValue("middleName", middleName);
      setValue("lastName", lastName);
      setValue("phoneNumber", phoneNumber);
      setValue("emailAddress", emailAddress);
      setValue("postalAddress", postalAddress);
      setValue("physicalAddress", physicalAddress);
      setValue("country", country);
      setValue("taxNumber", taxNumber);
      setValue("idType", idType);
      setValue("idNumber", idNumber);
      setValue("sex", sex);
      setValue("nationality", nationality);
      setValue("riskRating", riskRating);
      setValue("attachDocumentsField", attachDocumentsField);
      setValue("signature", signature);
    }
  }, [
    individualKYCData,
    isEditMode,
    isCopyMode,
    storedIndividualKYC,
    setValue,
  ]);

  return (
    <section>
      <div className="pt-2 ml-4">
        <nav className="text-sm text-blue-500" aria-label="Breadcrumb">
          <ol className="inline-flex p-0 m-0 list-none">
            <li className="flex items-center m-0">
              <Link to="/customers/customer-kycs">Customer Management</Link>
              <svg
                className="w-3 h-3 mx-3 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="m-0">
              <Link to="#" className="text-gray-500" aria-current="page">
                Customer KYC Details
              </Link>
            </li>
          </ol>
        </nav>
        <div className="flex items-center justify-between my-4">
          <div className="">
            <h1 className="text-4xl text-[#36459C]">Customer KYC Details</h1>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="px-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 border">
            <div className="p-4">
              <h3>PERSONAL DETAILS</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mx-4 mb-8 -mt-4 ">
              <div>
                <Label htmlFor="kycType">KYC TYPE</Label>
                <Controller
                  control={control}
                  name="kycType"
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select KYC Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {KYCTypes.map((type) => (
                          <SelectItem
                            key={type.kycTypeId}
                            value={type.kycTypeId}
                          >
                            {type.kycTypeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="designation">
                  Designation e.g. Mr, Mrs, Dr, Rev, etc
                </Label>
                <Input
                  id="designation"
                  type="text"
                  {...register("designation")}
                  className="mt-1"
                />
                {errors.designation && (
                  <div className="text-red-500">
                    {errors.designation.message}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  {...register("firstName")}
                  className="mt-1"
                />
                {errors.firstName && (
                  <div className="text-red-500">{errors.firstName.message}</div>
                )}
              </div>
              <div>
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  type="text"
                  {...register("middleName")}
                  className="mt-1"
                />
                {errors.middleName && (
                  <div className="text-red-500">
                    {errors.middleName.message}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  {...register("lastName")}
                  className="mt-1"
                />
                {errors.lastName && (
                  <div className="text-red-500">{errors.lastName.message}</div>
                )}
              </div>
              <div>
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="text"
                  {...register("emailAddress")}
                  className="mt-1"
                />
                {errors.emailAddress && (
                  <div className="text-red-500">
                    {errors.emailAddress.message}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="text"
                  {...register("phoneNumber")}
                  className="mt-1"
                />
                {errors.phoneNumber && (
                  <div className="text-red-500">
                    {errors.phoneNumber.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border">
            <div className="p-4">
              <h3>LOCATION DETAILS</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mx-4 mb-8 -mt-4">
              <div>
                <Label htmlFor="postalAddress">Postal Address</Label>
                <Input
                  id="postalAddress"
                  type="text"
                  {...register("postalAddress")}
                  className="mt-1"
                />
                {errors.postalAddress && (
                  <div className="text-red-500">
                    {errors.postalAddress.message}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="physicalAddress">Physical Address</Label>
                <Input
                  id="physicalAddress"
                  type="text"
                  {...register("physicalAddress")}
                  className="mt-1"
                />
                {errors.physicalAddress && (
                  <div className="text-red-500">
                    {errors.physicalAddress.message}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  {...register("country")}
                  className="mt-1"
                />
                {errors.country && (
                  <div className="text-red-500">{errors.country.message}</div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border">
            <div className="p-4">
              <h3>IDENTIFICATION DETAILS</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mx-4 mb-8 -mt-4 ">
              <div>
                <Label htmlFor="idType">ID Type</Label>
                <Controller
                  control={control}
                  name="idType"
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Id Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="national-id">National ID</SelectItem>
                        <SelectItem value="drivers-license">
                          Drivers License
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.idType && (
                  <div className="text-red-500">{errors.idType.message}</div>
                )}
              </div>
              <div>
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  type="text"
                  {...register("idNumber")}
                  className="mt-1"
                />
                {errors.idNumber && (
                  <div className="text-red-500">{errors.idNumber.message}</div>
                )}
              </div>
              <div>
                <Label htmlFor="taxNumber">Tax Number</Label>
                <Input
                  id="taxNumber"
                  type="text"
                  {...register("taxNumber")}
                  className="mt-1"
                />
                {errors.taxNumber && (
                  <div className="text-red-500">{errors.taxNumber.message}</div>
                )}
              </div>
              <div>
                <Label htmlFor="sex">Sex</Label>
                <Controller
                  control={control}
                  name="sex"
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.sex && (
                  <div className="text-red-500">{errors.sex.message}</div>
                )}
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  type="text"
                  {...register("nationality")}
                  className="mt-1"
                />
                {errors.nationality && (
                  <div className="text-red-500">
                    {errors.nationality.message}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="riskRating">Risk Rating</Label>
                <Input
                  id="riskRating"
                  type="text"
                  {...register("riskRating")}
                  className="mt-1"
                />
                {errors.riskRating && (
                  <div className="text-red-500">
                    {errors.riskRating.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border">
            {/* TODO: add custom file upload */}
            <div className="p-4">
              <h3>ATTACHMENT DETAILS</h3>
            </div>
            <div className="grid grid-cols-2 gap-10 mx-4 mb-8 -mt-4">
              <div>
                <Label htmlFor="attachDocumentsField">Attach Documents</Label>
                <Input
                  id="attachDocumentsField"
                  type="text"
                  {...register("attachDocumentsField")}
                  className="mt-1"
                />
                {errors.attachDocumentsField && (
                  <div className="text-red-500">
                    {errors.attachDocumentsField.message}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="signature">Signature</Label>
                <Input
                  id="signature"
                  type="text"
                  {...register("signature")}
                  className="mt-1"
                />
                {errors.signature && (
                  <div className="text-red-500">{errors.signature.message}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-start mt-4 mb-6">
          <Button type="submit">Submit</Button>
          <Button
            className="ml-2"
            type="button"
            onClick={() => navigate("/customers/customer-kycs")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
};

export default NewKYCIndividualForm;
