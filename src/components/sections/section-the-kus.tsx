import { Suspense } from "react"

import { fetchLatestVideos } from "@/lib/fetch-latest-videos"
import { VideoGrid } from "@/components/videos/VideoGrid"

import { VideoGridSkeleton } from "../videos/ViedeoGridSkeleton"

export async function SectionTheKus({ data }: { data: any }) {
  return (
    <section className="bg-gray-100 py-16" id="the-kus">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-4">The Kus</h2>
        <p className="text-center mb-8">
          Too much happening with DOT? We got you covered with our latest
          updates!
        </p>
        <Suspense fallback={<VideoGridSkeleton />}>
          <VideoGrid videos={data?.videos} />
        </Suspense>
      </div>
    </section>
  )
}
