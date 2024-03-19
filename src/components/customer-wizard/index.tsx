import { FC } from "react";
import Stepper from "./stepper";
import { Route, Routes } from "react-router-dom";
import CustomerKYC from "./CustomerKYC";
import Products from "./Products";
import CustomerMandates from "./CustomerMandates";
import CustomerMandateRules from "./CustomerMandateRules";
import { useAppState } from "@/store/state";

interface WizardProps {}

const Wizard: FC<WizardProps> = () => {
  const { appState } = useAppState();
  console.log(appState);
  return (
    <div className="flex gap-4 mx-4 my-8">
      <div className="w-[10%]">
        <Stepper />
      </div>
      <div className="w-[90%]">
        <Routes>
        <>
              <Route path="/:customerId/" element={<CustomerKYC />} />
              <Route path="/:customerId/products" element={<Products />} />
              <Route
                path="/:customerId/mandates"
                element={<CustomerMandates />}
              />
              <Route
                path="/:customerId/mandate-rules"
                element={<CustomerMandateRules />}
              />
            </>
            <>
              <Route path="/" element={<CustomerKYC />} />
              <Route path="/products" element={<Products />} />
              <Route path="/mandates" element={<CustomerMandates />} />
              <Route path="/mandate-rules" element={<CustomerMandateRules />} />
            </>
        </Routes>
      </div>
    </div>
  );
};

export default Wizard;
