import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Customer } from "@/types/global";
import { Link } from "react-router-dom";

 

export const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center mr-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className=""
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center mr-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className=""
        />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "customerId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer ID" />
    ),
    cell: ({ row }) => <div className=""><Link to={`/customers/${row.getValue("customerId")}`}>{row.getValue("customerId")}</Link></div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "customerType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Type" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("customerType")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
    {
        accessorKey: "customer",
        accessorFn: (row) => row.business?.legalEntityName || `${row.retail?.individualKYC?.firstName + " " + row.retail?.individualKYC?.lastName}`,
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer" />
        ),
        cell: ({ row }) => <div className="">{row.getValue("customer")}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "riskRating",
        accessorFn: (row) => row.business?.riskRating || row.retail?.riskRating,
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Risk Rating" />
        ),
        cell: ({ row }) => <div className="">{row.getValue("riskRating")}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
      accessorKey: "accountCurrency",
      accessorFn: (row) => row.business?.accountCurrency || row.retail?.accountCurrency,
      header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
      ),
      cell: ({ row }) => <div className="">{row.getValue("accountCurrency")}</div>,
      enableSorting: true,
      enableHiding: true,
  },
  {
    accessorKey: "accountType",
    accessorFn: (row) => row.business?.productTypes?.productTypeName || row.retail?.productTypes?.productTypeName,
    header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Product Type" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("accountType")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "accounts",
    accessorFn: (row) => row.accounts?.length || row.accounts?.length,
    header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Number of Accounts" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("accounts")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
];
