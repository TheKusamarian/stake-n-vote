'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/Container'

import Stake from '@w3f/polkadot-icons/keyline/Stake'
import Delegate from '@w3f/polkadot-icons/keyline/Vote'
import Customize from '@w3f/polkadot-icons/keyline/Settings'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChainSwitch } from './ChainSwitch'
import { useInkathon } from '@scio-labs/use-inkathon'
import StakeComponent from './stake/stake'
import DelegateComponent from './delegate/delegate'

const features = [
  {
    title: 'Stake',
    description:
      "Stake your assets, earn rewards and secure the Polkadot network. It's that simple.",
    image: <Stake stroke="#fff" className="mr-2 inline-block" width={20} />,
  },
  {
    title: 'Delegate',
    description:
      'Your Votes matter. Delegate your voting power to us and shape the future of Polkadot.',
    image: <Delegate stroke="#fff" className="mr-2 inline-block" width={20} />,
  },
  {
    title: 'Manage',
    description:
      'Control your stake with our easy-to-use interface. Rewards destination, voting preferences, and more.',
    image: <Customize stroke="#fff" className="mr-2 inline-block" width={20} />,
  },
]

export function PrimaryFeatures() {
  const { activeChain } = useInkathon()
  const searchParams = useSearchParams()
  const router = useRouter()
  let [tabOrientation, setTabOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal',
  )

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  const selectedFeature =
    searchParams.get('feature') || features[0].title.toLowerCase()

  let selectedIndex = features.findIndex(
    (feature) => feature.title.toLowerCase() === selectedFeature,
  )

  if (selectedIndex === -1) {
    selectedIndex = 0
  }

  // useEffect(() => {
  //   router.push(
  //     `#features?feature=${features[selectedIndex].title.toLowerCase()}`,
  //     {
  //       scroll: false,
  //     },
  //   )
  // }, [selectedIndex, router, selectedFeature])

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-teal-500 pb-28 pt-20 sm:py-32"
    >
      <Container className="b relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            Get your assets to work with The Kusamarian!
          </h2>
          <p className="mt-6 w-full text-center text-sm font-bold tracking-tight text-white">
            ↓ Select Network ↓
          </p>
        </div>
        <ChainSwitch className="mt-8" />
        <p className="mt-8 w-full text-center text-sm font-bold tracking-tight text-white">
          ↓ Stake + Delegate ↓
        </p>
        <Tab.Group
          as="div"
          className="mt-8 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-12 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
          selectedIndex={selectedIndex}
          onChange={(index) => {
            router.replace(
              `?feature=${features[index].title.toLowerCase()}#features`,
              {
                scroll: false,
              },
            )
          }}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-4">
                <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6',
                        selectedIndex === featureIndex
                          ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10'
                          : 'hover:bg-white/10 lg:hover:bg-white/5',
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-lg ui-not-focus-visible:outline-none',
                            selectedIndex === featureIndex
                              ? 'text-blue-600 lg:text-white'
                              : 'text-blue-100 hover:text-white lg:text-white',
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.image} {feature.title}
                          {/* @ts-ignore */}
                          {activeChain?.tokenSymbol}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedIndex === featureIndex
                            ? 'text-white'
                            : 'text-blue-100 group-hover:text-white',
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </Tab.List>
              </div>
              <Tab.Panels className="mh-[80vh] lg:col-span-8">
                {features.map((feature) => (
                  <Tab.Panel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl lg:bg-white/10 lg:ring-1" />
                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-10 rounded-xl border shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0">
                      {/* <Image
                        className="w-full"
                        src={feature.image}
                        alt=""
                        priority
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      /> */}
                      <div className="flex min-h-[80vh] flex-col text-white">
                        {feature.title === 'Stake' ? (
                          <StakeComponent />
                        ) : feature.title === 'Delegate' ? (
                          <DelegateComponent />
                        ) : null}
                      </div>
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </Container>
    </section>
  )
}
