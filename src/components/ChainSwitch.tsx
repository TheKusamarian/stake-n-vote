'use client'

import Image from 'next/image'
import { clsx } from 'clsx'
import { SubstrateChain, useInkathon } from '@scio-labs/use-inkathon'
import { kusamaRelay, polkadotRelay, rocoRelay } from '@/config/chains'
import { isDev } from '@/config/config'

import kusamaLogo from '@/images/kusama.png'
import polkadotLogo from '@/images/polkadot.svg'

export function ChainSwitch({ className }: { className?: string }) {
  const { activeChain, switchActiveChain } = useInkathon()
  console.log('activeChain', activeChain?.network === 'Polkadot')

  function handleChainChange(chain: SubstrateChain) {
    switchActiveChain?.(chain || polkadotRelay)
  }

  return (
    <div className={clsx('flex justify-center gap-4', className)}>
      <button
        className={clsx(
          'h-24 w-24 rounded-full border-4 border-transparent p-2 transition-all hover:rotate-6 hover:scale-105 hover:outline-2 sm:h-28 sm:w-28 md:h-32 md:w-32 md:p-3',
          {
            'border-white': activeChain?.network === 'Polkadot',
            'opacity-50': activeChain?.network !== 'Polkadot',
          },
        )}
        onClick={() => handleChainChange(polkadotRelay)}
      >
        <Image
          src={polkadotLogo}
          alt="Polkadot Logo"
          width={100}
          height={100}
          className="-mt-0.5"
        />
      </button>
      <button
        className={clsx(
          'h-24 w-24 rounded-full border-4 border-transparent p-2 transition-all hover:rotate-6 hover:scale-105 hover:outline-2 sm:h-28 sm:w-28 md:h-32 md:w-32 md:p-3',
          {
            'border-white': activeChain?.network === 'Kusama',
            'opacity-50': activeChain?.network !== 'Kusama',
          },
        )}
        onClick={() => handleChainChange(kusamaRelay)}
      >
        <Image
          src={kusamaLogo}
          alt="Kusama Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
      </button>
    </div>
  )
}
