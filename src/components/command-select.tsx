import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "./ui/command";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  isSearchable,
  className,
}: Props) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "h-9 w-full justify-between font-normal px-3 overflow-hidden text-ellipsis",
          !selectedOption && "text-muted-foreground",
          className
        )}
      >
        <div className="flex items-center gap-x-2 truncate">
            {selectedOption?.children ?? placeholder}
        </div>
        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      <CommandResponsiveDialog 
        shouldFilter={!onSearch}
        open={open} 
        onOpenChange={setOpen}
        >
        {isSearchable && (
          <CommandInput
            placeholder="Search..."
            onValueChange={(val) => onSearch?.(val)}
          />
        )}
        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No options found
            </span>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              className="cursor-pointer"
            >
            <div className="flex items-center gap-x-2 truncate">
                {option.children}
            </div>
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};
