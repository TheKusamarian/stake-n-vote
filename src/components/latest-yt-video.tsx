import LazyYoutubeEmbed from "./lazy-yt-embed"

export const LatestYtVideo = ({ video }: { video: any }) => {
  if (!video || !video?.thumbnails) {
    return <div className="aspect-video w-full">Loading</div>
  }

  return (
    <LazyYoutubeEmbed
      previewImageUrl={video?.thumbnails?.maxres?.url}
      videoId={video?.id}
      priority={true}
    />
  )
}
