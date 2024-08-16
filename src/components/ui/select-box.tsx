import React from "react"
import { CaretSortIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons"
import { ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Option {
  value: string
  label: string
  info?: string
}

interface SelectBoxProps {
  options: Option[]
  value?: string[] | string
  onChange?: (values: string[] | string) => void
  placeholder?: string
  inputPlaceholder?: string
  emptyPlaceholder?: string
  className?: string
  multiple?: boolean
  classNames?: {
    optionLabel?: string
    optionInfo?: string
  }
  all?: boolean
  allLabel?: string
  deselectAllLabel?: string
  allSelectedLabel?: string
}

const SelectBox = React.forwardRef<HTMLInputElement, SelectBoxProps>(
  (
    {
      inputPlaceholder,
      emptyPlaceholder,
      placeholder,
      className,
      classNames,
      options,
      value,
      onChange,
      multiple,
      all,
      allLabel,
      deselectAllLabel,
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = React.useState<string>("")
    const [isOpen, setIsOpen] = React.useState(false)

    const handleSelect = (selectedValue: string) => {
      if (multiple) {
        const newValue =
          value?.includes(selectedValue) && Array.isArray(value)
            ? value.filter((v) => v !== selectedValue)
            : [...(value ?? []), selectedValue]
        onChange?.(newValue)
      } else {
        onChange?.(selectedValue)
        setIsOpen(false)
      }
    }

    const isAllSelected = options?.every((option) =>
      Array.isArray(value) ? value.includes(option.value) : false
    )

    const selectOrDeselectAll = () => {
      if (multiple) {
        if (isAllSelected) {
          onChange?.([])
        } else {
          onChange?.(options?.map((option) => option.value))
        }
      }
    }

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("w-full justify-between bg-white h-10 font-normal", {
              "text-muted-foreground": value?.length === 0,
            })}
          >
            {placeholder ?? "Select..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <div className="relative">
              <CommandInput
                value={searchTerm}
                onValueChange={(e) => setSearchTerm(e)}
                ref={ref}
                placeholder={inputPlaceholder ?? "Search..."}
                className="h-8 outline-none ring-0 border-none  my-1 focus:ring-0 focus:outline-none"
              />
              {searchTerm && (
                <div
                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  <Cross2Icon className="size-4" />
                </div>
              )}
            </div>
            <CommandList>
              <CommandEmpty>
                {emptyPlaceholder ?? "No results found."}
              </CommandEmpty>
              {all && (
                <>
                  <CommandGroup>
                    <CommandItem
                      className="flex items-center justify-between"
                      onSelect={selectOrDeselectAll}
                    >
                      <span className="flex flex-row items-center">
                        {!isAllSelected ? (
                          <>
                            <CheckIcon className="mr-2" />{" "}
                            {allLabel || "Select All"}
                          </>
                        ) : (
                          <>
                            <Cross2Icon className="mr-2" />{" "}
                            {deselectAllLabel || "Deselect All"}
                          </>
                        )}
                      </span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}
              <CommandGroup>
                <ScrollArea>
                  <div className="max-h-64">
                    {options?.map((option) => {
                      const isSelected =
                        Array.isArray(value) && value.includes(option.value)
                      return (
                        <CommandItem
                          className="flex items-center justify-between"
                          key={option.value}
                          // value={option.value}
                          onSelect={() => handleSelect(option.value)}
                        >
                          <div className="flex items-center">
                            {multiple && (
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible"
                                )}
                              >
                                <CheckIcon />
                              </div>
                            )}
                            {!multiple && option.value === value && (
                              <CheckIcon
                                className={cn(
                                  option.value === value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            )}
                            <span className={classNames?.optionLabel}>
                              {option.label}
                            </span>
                          </div>
                          {option.info && (
                            <span
                              className={cn(
                                "text-right",
                                classNames?.optionInfo
                              )}
                            >
                              {option.info}
                            </span>
                          )}
                        </CommandItem>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

SelectBox.displayName = "SelectBox"

export default SelectBox
