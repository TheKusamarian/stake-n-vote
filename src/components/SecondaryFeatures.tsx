'use client'

import { useId } from 'react'
import Image, { type ImageProps } from 'next/image'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import screenshotContacts from '@/images/screenshots/contacts.png'
import screenshotInventory from '@/images/screenshots/inventory.png'
import screenshotProfitLoss from '@/images/screenshots/profit-loss.png'
import { useLatestYt } from '@/hooks/use-latest-yt'
import LazyYoutubeEmbed from './lazy-yt-embed'

function LatestVideos() {
  const { data } = useLatestYt()
  const videos = data?.videos?.slice(1, 7)

  // return <pre>{JSON.stringify(videos, null, 2)}</pre>
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos?.map((video) => {
        const description = video.description.split('\n')[0]
        return (
          <div key={video.id} className="relative">
            <div className="group relative overflow-hidden rounded-md p-2">
              <div className="from-primary-500 group-hover:animate-spin_right absolute -left-1/2 -top-1/2 h-[200%] w-[200%] origin-center rounded-md bg-gradient-to-br to-teal-500 p-2"></div>
              <LazyYoutubeEmbed
                previewImageUrl={video?.thumbnails?.maxres?.url}
                videoId={video?.id}
              />
            </div>
            <div className="mt-2 flex flex-col items-center justify-center">
              <h3 className="text-base font-semibold leading-normal">
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

export function SecondaryFeatures() {
  return (
    <section
      id="videos"
      aria-label="latest videos from Polkadot ecosystem"
      className="pb-14 pt-20 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Latest Videos
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Because there is so much happening on Polkadot, we have a lot of
            news to share. Here are some of the latest updates.
          </p>
        </div>
        <LatestVideos />
      </Container>
    </section>
  )
}