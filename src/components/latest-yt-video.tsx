'use client'

import { useLatestYt } from '@/hooks/use-latest-yt'
import LazyYoutubeEmbed from './lazy-yt-embed'

type Video = {
  id: string
  title: string
  thumbnailUrl: string
  previewUrl: string
}

export const LatestYtVideo: React.FC = () => {
  const { data } = useLatestYt()

  console.log('video', data?.videos?.[0])
  const video = data?.videos?.[0]

  if (!video || !video?.thumbnails) {
    return <div className="aspect-video w-full">Loading</div>
  }

  return (
    <LazyYoutubeEmbed
      previewImageUrl={video?.thumbnails?.maxres?.url}
      videoId={video?.id}
    />
  )
}
