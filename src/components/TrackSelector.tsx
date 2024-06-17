"use client"

import React from "react"

import MultipleSelector, { Option } from "@/components/ui/multiple-selector"

const TrackSelector = ({
  options,
  value,
  onChange,
}: {
  options: Option[]
  value: Option[]
  onChange: (value: Option[]) => void
}) => {
  return (
    <div className="flex w-full flex-col gap-5">
      <MultipleSelector
        value={value}
        onChange={onChange}
        defaultOptions={options}
        options={options}
        placeholder="Select tracks for delegating your votes..."
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
    </div>
  )
}

export default TrackSelector
