"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import queryBranchList from "./branch-list/query";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { BranchForm } from "@/types/global";

interface Branch {
  label: string;
  value: string;
}

interface Group {
  label: string;
  branches: Branch[];
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {
  className?: string;
}

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [branches, setBranches] = React.useState<Group[]>([]);
  const [selectedBranch, setSelectedBranch] = React.useState<Branch>(
    branches.length > 0 && branches[0].branches.length > 0
      ? branches[0].branches[0]
      : { label: '', value: '' } // Default to an empty object if branches is empty
  );
  console.log(branches);




  const { data: branchData, loading: branchLoading } = useQuery(queryBranchList)

  useEffect(() => {
    if (branchData) {
      // Create a new array to store branches in the format of groups
      const formattedBranches = [];
  
      // Push main branch into formattedBranches
      formattedBranches.push({
        label: "Main Branch",
        branches: branchData.branches.filter(
          (branch: BranchForm) => branch.isHeadOfficeBranch === true
        ).map((branch: BranchForm) => ({
          label: branch.branchName,
          value: branch.branchId,
        })),
      });
  
      // Push remaining branches into formattedBranches
      formattedBranches.push({
        label: "Branches",
        branches: branchData.branches.filter(
          (branch: BranchForm) =>
            branch.isHeadOfficeBranch === false
        ).map((branch: BranchForm) => ({
          label: branch.branchName,
          value: branch.branchId,
        })),
      });
  
      // Set the formatted branches
      setBranches(formattedBranches);
    }
  }, [branchData, branchLoading]);

  useEffect(() => {
    if (branches.length > 0) {
      // Check if the first group has branches
      const firstGroupBranches = branches[0].branches;
      if (firstGroupBranches.length > 0) {
        // Set the first branch of the first group as the selected branch
        setSelectedBranch(firstGroupBranches[0]);
      }
    }
  }, [branches]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="bg-[#2D3142]">
        <Button
          
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn("w-[200px] justify-between hover:text-white border-2 border-gray-300", className)}
        >
          <Avatar className="w-5 h-5 mr-2">
            <AvatarImage
              src={`https://avatar.vercel.sh/${selectedBranch.value}.png`}
              alt={selectedBranch.label}
              className="grayscale"
            />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          {selectedBranch.label}
          <CaretSortIcon className="w-4 h-4 ml-auto opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search branch..." />
            <CommandEmpty>No branch found.</CommandEmpty>
            {branches.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.branches.map((branch) => (
                  <CommandItem
                    key={branch.value}
                    onSelect={() => {
                        setSelectedBranch(branch);
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="w-5 h-5 mr-2">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${branch.value}.png`}
                        alt={branch.label}
                        className="grayscale"
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {branch.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedBranch.value === branch.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
