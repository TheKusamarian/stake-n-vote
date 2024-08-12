import Slider from "rc-slider"

import "rc-slider/assets/index.css"
import { cn } from "../lib/utils"
import { Label } from "./ui/label"

export function ConvictionSlider({
  value,
  onChange,
  className,
}: {
  value: number
  onChange: (value: number | number[]) => void
  className?: string
}) {
  const marks = {
    0: "0.1x",
    1: "1x",
    2: "2x",
    3: "3x",
    4: "4x",
    5: "5x",
    6: "6x",
  }

  const info: Record<number, string> = {
    0: "No lockup",
    1: "Locked for 7 days",
    2: "Locked for 14 days",
    3: "Locked for 28 days",
    4: "Locked for 56 days",
    5: "Locked for 112 days",
    6: "Locked for 224 days",
  }

  return (
    <div className={cn("w-full px-2 mb-2 flex flex-col gap-2", className)}>
      <div className="flex w-full justify-between">
        <Label className="font-bold -ml-1">Conviction</Label>
        <span className="text-xs">{info[value] || ""}</span>
      </div>
      <Slider
        marks={marks}
        defaultValue={1}
        value={value}
        onChange={onChange}
        step={1}
        min={0}
        max={6}
        activeDotStyle={{ borderColor: "#e60079" }}
        styles={{
          track: { background: "#e60079" },
          handle: { borderColor: "#e60079", borderWidth: 3, outline: "none" },
          tracks: { color: "#000" },
        }}
      />
    </div>
  )
}
