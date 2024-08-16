import { useTracks } from "@/hooks/use-tracks"
import { useVotingFor } from "@/hooks/use-voting-for"

import SelectBox from "./ui/select-box"

export function TrackSelect({
  className,
  values,
  onChange,
}: {
  values: string[]
  onChange: (values: string[]) => void
  className?: string
}) {
  const { data: tracks } = useTracks()

  const { data: votingFor } = useVotingFor()

  const formattedTracks = tracks?.map((track) => {
    return {
      value: track.value,
      label: `${track.label} (${track.value})`,
      info: votingFor?.[track.value]?.casting?.length
        ? `${votingFor?.[track.value]?.casting.length} active votes`
        : votingFor?.[track.value]?.delegating
        ? "Delegating votes"
        : "",
    }
  })

  // Wrap setSelectedValues to match the expected function signature
  const handleValuesChange = (values: string | string[]) => {
    if (typeof values === "string") {
      onChange([values]) // Handle single string as an array
    } else {
      onChange(values) // Directly assign the array
    }
  }

  const placeholder =
    values && values.length === formattedTracks?.length
      ? "All Tracks Selected"
      : values.length > 0
      ? `${values.length} tracks selected`
      : "Select tracks for delegating your votes..."

  return (
    <SelectBox
      all
      allLabel="Select All Tracks"
      deselectAllLabel="Deselect All Tracks"
      options={formattedTracks || []}
      value={values}
      onChange={handleValuesChange}
      multiple
      placeholder={placeholder}
      classNames={{
        optionInfo: "text-xs text-primary-500",
      }}
    />
  )
}
