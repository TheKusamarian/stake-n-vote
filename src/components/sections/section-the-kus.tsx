import { Suspense } from "react"
import Link from "next/link"
import { YoutubeIcon } from "@/icons"

import { fetchLatestVideos } from "@/lib/fetch-latest-videos"
import { VideoGrid } from "@/components/videos/VideoGrid"

import { Button } from "../ui/button"
import { VideoGridSkeleton } from "../videos/ViedeoGridSkeleton"

const THE_KUS_PLAYLIST_ID = "PLtyd7v_I7PGlMekTepCvnf8WMKVR1nhLZ"

export default async function SectionTheKus({ data }: { data: any }) {
  return (
    <section className="bg-gray-100 py-16" id="kus-news">
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-5xl font-bold text-center mb-4">KusNews</h2>
        <p className="text-center mb-16">
          Too much happening with DOT? We got you covered with our latest
          updates!
        </p>
        <Suspense fallback={<VideoGridSkeleton />}>
          <VideoGrid videos={data?.videos} />
        </Suspense>
        <div className="flex w-full justify-center mt-8">
          <Button className="mt-8">
            <Link
              className="flex"
              href={`https://www.youtube.com/playlist?list=${THE_KUS_PLAYLIST_ID}`}
            >
              <YoutubeIcon className="mr-2" /> View all Ser, Have ya&apos;
              Heard? videos on YouTube
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
