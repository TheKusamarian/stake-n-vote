import Image from "next/image"
import { XIcon, YoutubeIcon } from "@/icons"
import backgroundImage from "@/images/background-call-to-action.jpg"

import { Button } from "@/components/Button"
import { Container } from "@/components/Container"

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
          <div className="mt-10 flex justify-center">
            <Button
              href="https://www.youtube.com/@TheKusamarian?sub_confirmation=1
"
              target="_blank"
              color="white"
              className="mr-2 "
            >
              <YoutubeIcon className="mr-2" />
              YouTube
            </Button>
            <Button
              href="https://x.com/intent/follow?developer.twitter.com%2F=&region=follow_link&screen_name=TheKusamarian"
              target="_blank"
              color="white"
              className=""
            >
              <XIcon className="mr-2" size={16} /> / Twitter
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
