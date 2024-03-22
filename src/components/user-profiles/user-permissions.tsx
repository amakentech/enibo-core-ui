import { useEffect, useState } from "react";
import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronRight, Link } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "../ui/use-toast";
import { CREATE_USER_PROFILE } from "@/types/mutations";
import { queryUserProfile } from "@/types/queries";

const UserPermissionSchema = z.object({
  name: z.string().min(3, { message: "Profile Name is required" }),
  description: z.string().min(3, { message: "Description is required" }),
  permissions: z
    .array(z.string())
    .nonempty({ message: "Please select permissions" }),
});

type UserPermissionsInput = z.infer<typeof UserPermissionSchema>;

interface UserPermissionsProps {}

const UserPermissions: FC<UserPermissionsProps> = () => {
  //   const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  // check if setting id stored in local storage
  const storedProfile = localStorage.getItem("profile");
  const isCopyMode = storedProfile ? true : false;
  const { id } = useParams();
  // if there is id, it means we are in create mode
  const isEditMode = id ? true : false;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [tab, setTab] = useState(0);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [modules] = useState([
    {
      moduleName: "Branch Management",
      subModules: ["Branches", "Branch Types"],
    },
    {
      moduleName: "Product Management",
      subModules: ["Product Types"],
    },
    {
      moduleName: "Approval Management",
      subModules: ["Aprovals", "Approval Rules"],
    },
    {
      moduleName: "Static Data",
      subModules: [
        "Countries",
        "Currencies",
        "Fee Types",
        "Transaction Types",
        "Business Calendars",
      ],
    },
    {
      moduleName: "Ledger Management",
      subModules: [
        "Ledger Account Category",
        "Ledger Accounts",
        "Ledger Rules",
      ],
    },
    {
      moduleName: "User Management",
      subModules: ["Users", "User Profiles"],
    },
    {
      moduleName: "Customer Management",
      subModules: ["Customers", "KYC Types", "KYCs", "Account Mandate Types"],
    },
    {
      moduleName: "App Settings",
      subModules: ["App Settings List"],
    },
    // Add more modules and submodules as needed
  ]);

 
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<UserPermissionsInput>({
    resolver: zodResolver(UserPermissionSchema),
  });

  const toggleModuleCheckbox = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const isChecked = e.target.checked;
    const checkedValue = e.target.value;
    // Update permissions for the selected module and its submodules
    console.log("isChecked", isChecked, "checkedValue", checkedValue, name);
    if (isChecked) {
      setSelectedModules([...selectedModules, name]);
    } else {
      setSelectedModules(selectedModules.filter((module) => module !== name));
    }
  };


  const { data } = useQuery(queryUserProfile, {
    variables: {
      settingId: id ? id : "",
    },
  });
  const navigate = useNavigate();
  function stringToPermissionsArray(permissionString: string) {
    const regex =
      /([a-zA-Z0-9]+):([a-zA-Z0-9]+):([a-zA-Z0-9]+):([a-zA-Z0-9]+):([a-zA-Z0-9]+)/;
    const matches = permissionString.match(regex);

    if (matches) {
      const [, ...permissions] = matches;

      return permissions;
    }

    // Handle the case where the string does not match the expected pattern
    console.error("Invalid permission string format");
    return [];
  }

  useEffect(() => {
    if (isEditMode) {
      if (data) {
        const { name, description, permissions } = data.profile;
        const newPermissions = permissions.forEach((permission: string) => {
          const permissionsArray: string[] =
            stringToPermissionsArray(permission);
          return permissionsArray;
        });
        setValue("name", name);
        setValue("description", description);
        setValue("permissions", newPermissions);
      }
    }
    if (isCopyMode) {
      const storedProfileString = localStorage.getItem("profile");
      if (storedProfileString !== null) {
        const { name, description, permissions } =
          JSON.parse(storedProfileString);
        const newPermissions = permissions.forEach((permission: string) => {
          const permissionsArray: string[] =
            stringToPermissionsArray(permission);
          return permissionsArray;
        });
        setValue("name", name);
        setValue("description", description);
        setValue("permissions", newPermissions);
      }
    }
  }, [setValue, isCopyMode, storedProfile, data, isEditMode]);
  const [createUserProfile] = useMutation(CREATE_USER_PROFILE);

  const onSubmit: SubmitHandler<UserPermissionsInput> = async (data) => {
    // Handle form submission here
    console.log("Form data:", data);
    const generatedString = data.permissions
      .map((permission) => permission.replace(/\s+/g, ""))
      .join(":");
    const result = await createUserProfile({
      variables: {
        name: data.name,
        description: data.description,
        permissions: generatedString,
        modifiedBy: user.id,
      },
    });

    toast({
      title: "Profile Created",
      description: (
        <div className="text-black">
          <div className="text-lg">
            New User Profile{" "}
            <Link
              to={`/administration/user-management/profile-list/${result.data.createProfile.id}`}
              className="text-blue-500 underline"
            >
              {data.name}
            </Link>
            , has been successfully created
          </div>
        </div>
      ),
    });
    navigate("/administration/user-management/profile-list");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex pb-4">
        <Button
          type="button"
          onClick={() => setTab(0)}
          variant="ghost"
          className={`rounded-none border-b ${
            tab === 0 ? " border-blue-500 bg-accent" : ""
          }`}
        >
          Profile Details
        </Button>
        <Button
          type="button"
          onClick={() => setTab(1)}
          variant="ghost"
          className={`rounded-none border-b ${
            tab === 1 ? " border-blue-500 bg-accent" : ""
          }`}
        >
          Permissions
        </Button>
      </div>
      {tab === 0 && (
        <div className="width-[60%]">
          <div>
            <Label htmlFor="name">Profile Name</Label>
            <Input
              id="name"
              placeholder="User profile name"
              type="text"
              {...register("name", { required: true })}
              className="mt-2"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>
          <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              className="w-full mt-2"
              placeholder="Description text goes here"
            />
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </div>
        </div>
      )}
      {tab === 1 && (
        <>
          <div>
            {errors && errors.permissions && (
              <div className="text-red-500">{errors.permissions.message}</div>
            )}
          </div>
          <div>
            <div className="w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>Module</span>
                    </TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Create</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="w-full">
                  {modules.map((module, index) => (
                    <Collapsible key={index} className="w-full" asChild>
                      <>
                        <TableRow className="w-full">
                          <TableCell className="flex items-center w-[70%] gap-2">
                            <input
                              type="checkbox"
                              {...register("permissions", {
                                required: "Please select permissions",
                              })}
                              value={module.moduleName}
                              onChange={(e) =>
                                toggleModuleCheckbox(e, module.moduleName)
                              }
                            />
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <span className="">{module.moduleName}</span>
                          </TableCell>
                          <TableCell className="w-[10%]">
                            <input
                              type="checkbox"
                              {...register("permissions", {
                                required: "Please select permissions",
                              })}
                              value="view"
                            />
                          </TableCell>
                          <TableCell className="w-[10%]">
                            <input
                              type="checkbox"
                              {...register("permissions", {
                                required: "Please select permissions",
                              })}
                              value="create"
                            />
                          </TableCell>
                          <TableCell className="w-[10%]">
                            <input
                              type="checkbox"
                              {...register("permissions", {
                                required: "Please select permissions",
                              })}
                              value="edit"
                            />
                          </TableCell>
                          <TableCell className="w-[10%]">
                            <input
                              type="checkbox"
                              {...register("permissions", {
                                required: "Please select permissions",
                              })}
                              value="delete"
                            />
                          </TableCell>
                        </TableRow>
                        <CollapsibleContent className="w-full" asChild>
                          <>
                            {module.subModules.map((subModule, index) => (
                              <TableRow className="w-full" key={index}>
                                <TableCell className="flex items-center w-[70%] gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className=""
                                  >
                                    <div></div>
                                  </Button>
                                  <input
                                    type="checkbox"
                                    {...register("permissions", {
                                      required: "Please select permissions",
                                    })}
                                    value={subModule}
                                  />
                                  <span className="">{subModule}</span>
                                </TableCell>
                                <TableCell className="w-[10%]">
                                  <input
                                    type="checkbox"
                                    {...register("permissions", {
                                      required: "Please select permissions",
                                    })}
                                    value="view"
                                  />
                                </TableCell>
                                <TableCell className="w-[10%]">
                                  <input
                                    type="checkbox"
                                    {...register("permissions", {
                                      required: "Please select permissions",
                                    })}
                                    value="create"
                                  />
                                </TableCell>
                                <TableCell className="w-[10%]">
                                  <input
                                    type="checkbox"
                                    {...register("permissions", {
                                      required: "Please select permissions",
                                    })}
                                    value="edit"
                                  />
                                </TableCell>
                                <TableCell className="w-[10%]">
                                  <input
                                    type="checkbox"
                                    {...register("permissions", {
                                      required: "Please select permissions",
                                    })}
                                    value="delete"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
      <div className="flex gap-4 mt-4">
        {tab < 1 && (
          <Button type="button" onClick={() => setTab(1)}>
            Next
          </Button>
        )}
        {tab === 1 && (
          <>
            <Button type="submit">Submit</Button>
            <Button type="button" onClick={() => setTab(0)}>
              Back
            </Button>
          </>
        )}
        <Button
          type="button"
          onClick={() =>
            navigate("/administration/user-management/profile-list")
          }
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UserPermissions;
