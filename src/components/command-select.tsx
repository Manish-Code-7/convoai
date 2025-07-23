import { ReactNode, useState, useMemo } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDownIcon } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface Props {
  options: Array<{ id: string; value: string; children: ReactNode }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  isSearchable = true,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = useMemo(() => {
    if (onSearch) return options;
    if (!searchTerm) return options;
    return options.filter((opt) =>
      opt.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, onSearch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex h-10 min-w-[220px] items-center justify-between rounded-md border px-3 shadow-sm hover:bg-gray-50"
        >
          <span className="truncate">
            {selectedOption?.children ?? placeholder}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>

      {/* Dropdown */}
      <PopoverContent
        align="start"
        className="p-0 w-[250px] bg-white rounded-lg shadow-lg border animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <Command shouldFilter={false}>
          {/* Search Bar */}
          {isSearchable && (
            <div className="sticky top-0 bg-white z-10 border-b px-2 py-2">
              <CommandInput
                placeholder="Search..."
                value={searchTerm}
                onValueChange={(val) => {
                  setSearchTerm(val);
                  onSearch?.(val);
                }}
                autoFocus
                className="h-9 text-sm rounded-md border px-3 w-full"
              />
            </div>
          )}

          {/* Options List */}
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>
              <span className="text-gray-400 text-sm block p-2">
                No options found
              </span>
            </CommandEmpty>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => {
                  onSelect(option.value);
                  setOpen(false);
                  setSearchTerm("");
                  onSearch?.("");
                }}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
              >
                {option.children}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
