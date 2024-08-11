import { cn } from "@/lib/utils"

export function Information({
  type,
  className,
  children,
}: {
  type: "warning" | "info" | "error" | "success"
  className?: string
  children: React.ReactNode
}) {
  const icon = {
    warning: "⚠️",
    info: "ℹ️",
    error: "❌",
    success: "✅",
  }
  return (
    <div
      className={cn(
        "text-xs px-3 py-2 rounded-md border-2 flex flex-row items-center",
        {
          "bg-red-400 border-red-100/20": type === "error",
          "bg-green-400 border-green-100/20": type === "success",
          "bg-yellow-400/60 border-yellow-100/20": type === "warning",
          "bg-blue-400 border-blue-100/20": type === "info",
        },
        className
      )}
    >
      <span className="text-xl mr-3 hidden md:block">{icon[type]}</span>
      <div>{children}</div>
    </div>
  )
}
