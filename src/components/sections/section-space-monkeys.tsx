import { Suspense } from "react"
import Image from "next/image"
import backgroundImage from "@/images/space-monkeys.webp"

import { fetchLatestVideos } from "@/lib/fetch-latest-videos"
import { VideoGrid } from "@/components/videos/VideoGrid"

import { VideoGridSkeleton } from "../videos/ViedeoGridSkeleton"

const SPACE_MONKEYS_PLAYLIST_ID = "PLtyd7v_I7PGkq7KUe3ep3lFLgKG97Z2AO"

export async function SectionSpaceMonkeys() {
  const data = await fetchLatestVideos(SPACE_MONKEYS_PLAYLIST_ID)

  return (
    <section className="py-16 relative bg-black">
      <Image
        src={backgroundImage}
        alt="Space Monkeys Podcast"
        layout="fill"
        className="absolute inset-0 object-cover opacity-60"
      />
      <div className="container mx-auto px-4 z-1 mb-10">
        <h2 className="text-5xl font-bold text-purple-400 text-center mt-8 mb-20 mix-blend-difference">
          Space Monkeys Podcast
        </h2>
        <Suspense fallback={<VideoGridSkeleton />}>
          <VideoGrid
            videos={data?.videos}
            className=""
            classNames={{ item: "bg-white/80" }}
          />
        </Suspense>
      </div>
    </section>
  )
}
