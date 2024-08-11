"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTracks } from "@/hooks/use-tracks"
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

export function TrackSelect({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const { data: tracks } = useTracks()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white h-10"
        >
          {value === "all"
            ? `${tracks?.length} tracks selected`
            : value
            ? tracks?.find((track) => track.value === value)?.label
            : "Select tracks..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search track..."
            className="h-9 border-none focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>No tracks found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                All tracks
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {tracks?.map((track) => (
                <CommandItem
                  key={track.value}
                  value={track.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === track.value || value === "all"
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {track.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
