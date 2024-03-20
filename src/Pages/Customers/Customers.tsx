import { DataTable } from "@/components/datatable/data-table";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Customer } from "@/types/global";
import { Link } from "react-router-dom";
import { columns } from "@/components/customer-list/columns";
import { FaPlus } from "react-icons/fa";
import { useMutation, useQuery } from "@apollo/client";
import queryCustomersList from "@/components/customer-list/query";
import { Row } from "@tanstack/react-table";
import { DELETE_CUSTOMER } from "@/types/mutations";
import { toast } from "@/components/ui/use-toast";
import DeleteWarning from "@/components/deleteWarning";
import { useAppState } from "@/store/state";

interface CustomersProps {}

const Customers: FC<CustomersProps> = () => {
  const [Customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { appState, setAppState } = useAppState();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || {
    pathname: "/customers/customer-wizard/",
  };

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery(queryCustomersList);

  useEffect(() => {
    if (data) {
      setCustomers(data.customers);
    }
    setLoading(queryLoading);
    setError(queryError ? queryError.message : null);
  }, [data, queryLoading, queryError]);
  const handleEdit = (selectedRows: Row<Customer>[]) => {
    console.log("Edit", selectedRows);
    if(selectedRows[0].original.customerType === "retail") {
      const individualData = {
        kycId: selectedRows[0].original.retail?.individualKYC?.IndividualKYCId,
        createdBy: "John Doe",
        kycType: selectedRows[0].original.retail?.individualKYC?.kycType,
        status: "Active",
      }
      const productData = {
        productTypes: selectedRows[0].original.retail?.productTypes,
        accountCurrency: selectedRows[0].original.retail?.accountCurrency,
        riskRating: selectedRows[0].original.retail?.riskRating,
      }
      setAppState({
        ...appState,
        customerType: selectedRows[0].original.customerType,
        accountOwners: [...appState.accountOwners, individualData],
        product: productData,
        customerData: selectedRows[0].original,
      })
    } else {
      const businessData = {
        kycId: selectedRows[0].original.business?.businessKYC?.businessKYCId,
        createdBy: "John Doe",
        kycType: selectedRows[0].original.business?.businessKYC?.kycType,
        status: "Active",
      }

      const directorsData = {
        kycId: selectedRows[0].original.business?.directorsKYC?.IndividualKYCId,
        createdBy: "John Doe",
        kycType: selectedRows[0].original.business?.directorsKYC?.kycType,
        status: "Active",
      }

      const productData = {
        productTypes: selectedRows[0].original.business?.productTypes,
        accountCurrency: selectedRows[0].original.business?.accountCurrency,
        riskRating: selectedRows[0].original.business?.riskRating,
      }
      const businessName = selectedRows[0].original.business && selectedRows[0].original.business.legalEntityName;
      setAppState({
        ...appState,
        legalEntityName: businessName,
        customerType: selectedRows[0].original.customerType,
        accountOwners: [...appState.accountOwners, businessData],
        otherKYCs: [...appState.otherKYCs, directorsData],
        product: productData,
        customerData: selectedRows[0].original,
      })
    }
    navigate(`/customers/customer-wizard/${selectedRows[0].original.customerId}`);
  };
  
  const [deleteCustomer] = useMutation(DELETE_CUSTOMER)
  
  const deleteRows = async (selectedRows: Row<Customer>[]) => {
    const deletePromises = selectedRows.map((row) => {
      //this is the mutation function
      return deleteCustomer({
        variables: {
          customerId: row.original.customerId,
        },
      });
    });

    const result = await Promise.all(deletePromises);

    if (result) {
      window.location.reload();
      toast({
        title: "Record deleted successfully",
        description: `${selectedRows.length} record(s) deleted successfully`,
      });
    }
  };

  const handleDelete = (selectedRows: Row<Customer>[]) => {
    try {
      toast({
        title: "Are you sure? The operation is irreversible",
        description: (
          <DeleteWarning handleDeletion={() => deleteRows(selectedRows)} />
        ),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error during deletion",
      });
    }
  };

  const handleCopy = (selectedRows: Row<Customer>[]) => {
    console.log("Copy", selectedRows);
  };

  return (
    <div>
      <div className="mx-4">
        <div className="pt-2">
          <nav className="text-sm text-blue-500" aria-label="Breadcrumb">
            <ol className="inline-flex p-0 m-0 list-none">
              <li className="flex items-center m-0">
                <Link to="/administration">Administration</Link>
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
                  Customer Management
                </Link>
              </li>
            </ol>
          </nav>
        </div>
        <div className="flex items-center justify-between my-4">
          <div className="">
            <h1 className="text-4xl text-[#36459C]">Customers</h1>
          </div>
          <div className="">
            <Button
              size="sm"
              className="bg-[#36459C] text-white py-5 px-8"
              onClick={() => navigate(from, { replace: true })}
            >
              <FaPlus className="mr-1 text-white" /> Add
            </Button>
          </div>
        </div>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <DataTable
              columns={columns}
              data={Customers}
              handleCopy={handleCopy}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
