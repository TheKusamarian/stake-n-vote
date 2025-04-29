import { DiscordIcon, TikTokIcon, XIcon, YoutubeIcon } from "@/icons"
import { InstagramLogoIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/button"
import { Container } from "@/components/container"

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="from-primary-500 relative overflow-hidden bg-gradient-to-br to-teal-500 py-32"
    >
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl tracking-tight text-white sm:text-4xl">
            Subscribe to our Channels
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Be the first to know when you subscribe & follow our channels.
          </p>
          <div className="mt-10 flex flex-wrap justify-between gap-2 flex-col sm:flex-row">
            <Button
              href="https://www.youtube.com/@TheKusamarian?sub_confirmation=1"
              target="_blank"
              color="white"
              className="whitespace-nowrap"
            >
              <YoutubeIcon className="mr-2" />
              YouTube
            </Button>
            <Button
              href="https://x.com/intent/follow?developer.twitter.com%2F=&region=follow_link&screen_name=TheKusamarian"
              target="_blank"
              color="white"
              className="whitespace-nowrap"
            >
              <XIcon className="mr-2" size={16} /> X/Twitter
            </Button>
            <Button
              href="https://www.instagram.com/thekusamarian/"
              target="_blank"
              color="white"
              className="whitespace-nowrap"
            >
              <InstagramLogoIcon className="mr-2" /> Instagram
            </Button>
            <Button
              href="https://www.tiktok.com/@the_kusamarian"
              target="_blank"
              color="white"
              className="whitespace-nowrap"
            >
              <TikTokIcon className="mr-2" size={16} /> TikTok
            </Button>
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              href="https://discord.gg/QumzjDyeY4"
              target="_blank"
              className="hover:bg-black/90 whitespace-nowrap w-full sm:w-auto"
            >
              <DiscordIcon
                className="mr-2"
                stroke="currentColor"
                fill="currentColor"
              />
              Join KusDAO
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
