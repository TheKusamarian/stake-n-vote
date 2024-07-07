import Image from "next/image"
import Link from "next/link"
import logo from "@/images/logos/kusamarian.png"

import { Button } from "@/components/Button"
import { Container } from "@/components/Container"

export default function NotFound() {
  return (
    <Container>
      <div className="flex mt-10">
        <Link href="/" aria-label="Home">
          <Image
            src={logo}
            alt="the kus"
            className="inline-block w-auto h-10"
          />
        </Link>
      </div>
      <p className="mt-20 text-sm font-medium text-gray-700">404</p>
      <h1 className="mt-3 text-lg font-semibold text-gray-900">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-gray-700">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Button href="/" className="mt-10">
        Go back home
      </Button>
    </Container>
  )
}
