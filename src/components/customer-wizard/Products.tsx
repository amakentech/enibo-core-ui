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
import { ProductType } from "@/types/global";
import { gql, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "@/store/state";
import { toast } from "../ui/use-toast";
import CurrencySelector from "../currencies/currency-selector";

const businessRetailSchema = z.object({
  productTypes: z.string().min(3, { message: "Product Types is required" }),
  accountCurrency: z
    .string()
    .min(3, { message: "Account Currency is required" }),
  riskRating: z.string().min(3, { message: "Risk Rating is required" }),
});

type BusinessRetailInput = z.infer<typeof businessRetailSchema>;

const GET_PRODUCT_TYPES = gql`
  query ProductTypes {
    productTypes {
      productTypeId
      productTypeName
    }
  }
`;



interface ProductsProps {}

const Products: FC<ProductsProps> = () => {
  const {customerId} = useParams();
  const isEditMode = customerId ? true : false;
  const [ProductTypes, setProductTypes] = useState<ProductType[]>([]);
  const [saving, setSaving] = useState(false);
  const {appState, setAppState} = useAppState();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BusinessRetailInput>({
    resolver: zodResolver(businessRetailSchema),
  });
  
  useEffect(() => {
    if(isEditMode && appState && appState.product && appState.product.productTypes && appState.product.accountCurrency && appState.product.riskRating) {
      setValue("productTypes", appState.product.productTypes.productTypeId?.toString());
      setValue("accountCurrency", appState.product.accountCurrency);
      setValue("riskRating", appState.product.riskRating);
    }
  }, [isEditMode, setValue, appState]);

  const saveData = (data: BusinessRetailInput) => { 
    setSaving(true);
    setAppState({
      ...appState,
      productInput: {
        productTypes: data.productTypes,
        accountCurrency: data.accountCurrency,
        riskRating: data.riskRating,
      }
    })
    setSaving(false);
  }
  const navigate = useNavigate();
  const checkIfSaved = () => {
    if(appState && appState.productInput && appState.productInput.productTypes && appState.productInput.accountCurrency && appState.productInput.riskRating) {
      isEditMode ? navigate(`/customers/customer-wizard/${customerId}/mandates`) : navigate("/customers/customer-wizard/mandates")
    } else {
      toast({
        title: "Data Not Saved",
        description: "Please save data before proceeding",
        variant: "destructive",
      });
    }
  }
  const { data } = useQuery(GET_PRODUCT_TYPES);
  useEffect(() => {
    if (data && data.productTypes) {
      setProductTypes(data.productTypes);
    }
  }, [data]);
  return (
    <div>
      <form onSubmit={handleSubmit(saveData)}>
        <div className="flex flex-col px-2 pt-1 pb-4 border">
          <div>
            <h3>ACCOUNT DETAILS</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="productTypes">Product Types</Label>
              <Controller
                control={control}
                name="productTypes"
                render={({ field: { onChange, value } }) => (
                  <Select onValueChange={onChange} value={value} defaultValue={value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Map over productTypes state to render select options */}
                      {ProductTypes && ProductTypes.map((type) => (
                        <SelectItem
                          key={type.productTypeId}
                          value={type.productTypeId.toString()}
                        >
                          {type.productTypeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.productTypes && (
                <div className="text-red-500">
                  {errors.productTypes.message}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="accountCurrency">Account Currency</Label>
              <CurrencySelector control={control} name="accountCurrency"/>
              {errors.accountCurrency && (
                <div className="text-red-500">
                  {errors.accountCurrency.message}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="riskRating">Risk Rating</Label>
              <Controller
                control={control}
                name="riskRating"
                render={({ field: { onChange, value } }) => (
                  <Select onValueChange={onChange} value={value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.riskRating && (
                <div className="text-red-500">{errors.riskRating.message}</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-start gap-2 mt-4">
          <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            onClick={() => isEditMode ? navigate(`/customers/customer-wizard/${customerId}`) : navigate("/customers/customer-wizard")}
          >
            Back
          </Button>
          <Button 
          type="button"
          onClick={() => checkIfSaved()}
          >Next</Button>
        </div>
      </form>
    </div>);
};

export default Products;
