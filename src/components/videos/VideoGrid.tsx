import { cn } from "../../lib/utils"
import LazyYoutubeEmbed from "../lazy-yt-embed"

export function VideoGrid({
  videos,
  className,
  classNames,
}: {
  videos: any
  className?: string
  classNames?: {
    item?: string
  }
}) {
  // return <pre>{JSON.stringify(videos, null, 2)}</pre>
  return (
    <div
      className={cn(className, "mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3")}
    >
      {videos?.map((video: any) => {
        const description = video.description.split("\n")[0]
        //remove " Ser, Have ya' Heard?" from title
        video.title = video.title.replace("- Ser, Have ya' Heard?", "")
        return (
          <div
            key={video.id}
            className={cn("relative bg-white rounded-lg", classNames?.item)}
          >
            <div className="group relative overflow-hidden rounded-t-lg p-2 shadow-sm hover:shadow-xl transition-shadow">
              <div className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%] origin-center rounded-md bg-gradient-to-br from-primary-500 to-teal-500 p-2 group-hover:animate-spin_right"></div>
              <LazyYoutubeEmbed
                previewImageUrl={video?.thumbnails?.maxres?.url}
                videoId={video?.id}
              />
            </div>
            <div className="p-4 mt-2 flex flex-col items-center justify-center">
              <h3 className="mb-2 text-2xl font-bold tracking-tight leading-tight">
                {video.title}
              </h3>
              <p className="mb-2 mt-2 text-sm leading-normal">{description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
