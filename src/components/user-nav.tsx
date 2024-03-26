import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { FC } from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAppState } from "@/store/state";
import { Button } from "./ui/button";

interface UserNavProps {}

const UserNav: FC<UserNavProps> = () => {
  const { appState, setAppState } = useAppState();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const logout = () => {
    localStorage.removeItem("user");

    setAppState({
      ...appState,
      user: {
        id: "",
        username: "",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        employeeNumber: "",
        branch: "",
        profile: "",
        documentAttachment: "",
        modifiedBy: "",
        modifiedOn: "",
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <div>
          <p className="text-base font-medium leading-none uppercase">
            {user && user.username}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user && user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user && user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant="ghost" onClick={() => logout()} className="w-full flex">Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut></Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
