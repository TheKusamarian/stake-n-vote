import LazyYoutubeEmbed from "../lazy-yt-embed"
import { Skeleton } from "../ui/skeleton"

export function VideoSkeleton() {
  return (
    <div className="relative">
      <div className="group relative overflow-hidden rounded-md p-2">
        <div className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%] origin-center rounded-md bg-gradient-to-br from-primary-500 to-teal-500 p-2 group-hover:animate-spin_right"></div>
        <div className="h-[200px] bg-gray-300"></div>
      </div>
      <div className="mt-2 flex flex-col items-center justify-center">
        <Skeleton className="text-base font-semibold leading-normal h-[22px] w-full bg-gray-400 mb-2 mt-2" />
        <Skeleton className="text-sm leading-normal h-[16px] w-full bg-gray-400 mb-1" />
        <Skeleton className="text-sm leading-normal h-[16px] w-full bg-gray-400 mb-1" />
        <Skeleton className="text-sm leading-normal h-[16px] w-full bg-gray-400 mb-1" />
      </div>
    </div>
  )
}

export function VideoGridSkeleton({ length = 6 }: { length?: number }) {
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(length)].map((_, i) => (
        <VideoSkeleton key={i} />
      ))}
    </div>
  )
}
