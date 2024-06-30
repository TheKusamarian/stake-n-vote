"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { PlayCircleIcon } from "@heroicons/react/24/solid"

import { cn } from "@/lib/utils"

const LazyYoutubeEmbed = ({
  videoId,
  previewImageUrl,
  className,
}: {
  videoId: string
  previewImageUrl: string
  className?: string
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`

  return (
    <div
      className={cn(
        className,
        `relative overflow-hidden bg-black shadow-lg backdrop-blur-md transition-transform`
      )}
    >
      {!isVideoLoaded && (
        <Image
          src={previewImageUrl}
          alt="Video Preview"
          className={`h-full w-full cursor-pointer object-cover transition-opacity duration-500 ease-in-out ${
            isVideoLoaded ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleVideoLoad}
          // style={{ aspectRatio: '16 / 9' }}
          width={3000}
          height={1687}
        />
      )}
      {!isVideoLoaded && (
        <PlayCircleIcon
          width={80}
          strokeWidth={1}
          fill={"#e60079"}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          onClick={handleVideoLoad}
        />
      )}
      {isVideoLoaded && (
        <iframe
          src={videoUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={`aspect-video h-full w-full transition-opacity duration-500 ease-in-out ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        ></iframe>
      )}
    </div>
  )
}

export default LazyYoutubeEmbed
