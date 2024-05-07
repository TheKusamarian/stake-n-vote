import Image from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-call-to-action.jpg'
import { XIcon, YoutubeIcon } from '@/icons'

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="from-primary-500 relative overflow-hidden bg-gradient-to-br to-teal-500 py-32"
    >
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Subscribe to our Channels
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Always stay up to date with the latest news and updates from the
            Polkadot ecosystem by subscribing to our channels.
          </p>
          <div className="mt-10 flex justify-center">
            <Button href="/register" color="white" className="mr-2 ">
              <YoutubeIcon className="mr-2" />
              YouTube
            </Button>
            <Button href="/register" color="white" className="">
              <XIcon className="mr-2" size={16} /> / Twitter
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
