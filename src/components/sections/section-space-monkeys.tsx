import { Suspense } from "react"
import Image from "next/image"
import backgroundImage from "@/images/space-monkeys.webp"

import { fetchLatestVideos } from "@/lib/fetch-latest-videos"
import { VideoGrid } from "@/components/videos/VideoGrid"

import { VideoGridSkeleton } from "../videos/ViedeoGridSkeleton"

const SPACE_MONKEYS_PLAYLIST_ID = "PLtyd7v_I7PGkq7KUe3ep3lFLgKG97Z2AO"

export default async function SectionSpaceMonkeys() {
  const data = await fetchLatestVideos(SPACE_MONKEYS_PLAYLIST_ID)

  return (
    <section className="py-16 relative bg-black" id="space-monkeys">
      <Image
        src={backgroundImage}
        alt="Space Monkeys Podcast"
        className="absolute inset-0 object-cover opacity-60"
      />
      <div className="container mx-auto px-4 z-1 mb-10 text-white relative">
        <h2 className="text-5xl font-bold text-center mb-4">
          Space Monkeys Podcast
        </h2>
        <p className="text-center mb-16">
          Big Brains blasting off on Blockchain tech, regulation & adoption on
          this weekly podcast!
        </p>
        <Suspense fallback={<VideoGridSkeleton />}>
          <VideoGrid
            videos={data?.videos}
            className=""
            classNames={{
              item: "backdrop-blur-md bg-transparent text-white border border-gray-900 shadow-xl",
            }}
          />
        </Suspense>
      </div>
    </section>
  )
}
