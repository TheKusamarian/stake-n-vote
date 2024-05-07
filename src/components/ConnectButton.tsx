'use client'

import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { InjectedAccount } from '@polkadot/extension-inject/types'
import { encodeAddress } from '@polkadot/util-crypto'
import { WalletIcon } from '@heroicons/react/24/outline'
import {
  SubstrateWalletPlatform,
  isWalletInstalled,
  useInkathon,
} from '@scio-labs/use-inkathon'
import { ArrowUpRight, CheckCircle, ChevronDown } from 'lucide-react'

// import {
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownSection,
//   DropdownTrigger,
// } from '@nextui-org/dropdown'
import { trimAddress } from '../util'
import Identicon from '@polkadot/react-identicon'
import UseCases from '@w3f/polkadot-icons/keyline/UseCases'
import { cn } from '@nextui-org/system'
import { supportedWallets } from '@/config/wallets'
import ls from 'localstorage-slim'
import { useApp } from '@/app/app-provider'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button, buttonVariants } from './ui/button'

export interface ConnectButtonProps {
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined
}

export const ConnectButton: FC<ConnectButtonProps> = ({ size }) => {
  const {
    activeChain,
    connect,
    disconnect,
    isConnecting,
    activeAccount,
    accounts,
    setActiveAccount: _setActiveAccount,
  } = useInkathon()

  const setActiveAccount = (account: InjectedAccount | undefined) => {
    _setActiveAccount?.(account)
    ls.set('activeAccount', account?.address)
  }

  const { isEffectTrue } = useApp()

  // Sort installed wallets first
  const [browserWallets] = useState([
    ...supportedWallets.filter(
      (w) =>
        w.platforms.includes(SubstrateWalletPlatform.Browser) &&
        isWalletInstalled(w),
    ),
    ...supportedWallets.filter(
      (w) =>
        w.platforms.includes(SubstrateWalletPlatform.Browser) &&
        !isWalletInstalled(w),
    ),
  ])

  useEffect(() => {
    const userWantsConnection = ls.get('userWantsConnection')
    const activeAccountAddress = ls.get('activeAccount')
    if (userWantsConnection) {
      connect?.()
    }
    if (activeAccountAddress) {
      console.log('active account from ls', activeAccountAddress)
      const account = accounts?.find((a) => a.address === activeAccountAddress)
      console.log('account from ls', account)
      if (account) {
        _setActiveAccount?.(account)
      }
    }
  }, [accounts])

  if (!activeAccount) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(buttonVariants(), { 'animate-wiggle': isEffectTrue })}
          // isLoading={isConnecting}
          disabled={isConnecting}
          onClick={() => {
            ls.set('userWantsConnection', true)
          }}
        >
          {/* <Button> */}
          Connect{' '}
          <WalletIcon width={26} className="bg-botom ml-2 inline-block" />
          {/* </Button> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          avoidCollisions={false}
          className="min-w-[14rem]"
        >
          <DropdownMenuLabel>Connect Extension</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!activeAccount &&
            browserWallets.map((w) =>
              isWalletInstalled(w) ? (
                <DropdownMenuItem
                  key={w.id}
                  className="cursor-pointer hover:border-white hover:bg-transparent data-[hover=true]:border-white"
                  onClick={() => {
                    connect?.(undefined, w)
                  }}
                >
                  {w.name}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  key={w.id}
                  className="opacity-50 hover:border-white hover:bg-transparent data-[hover=true]:border-white"
                >
                  <Link href={w.urls.website}>
                    <div className="align-center flex justify-start gap-2">
                      <p>{w.name}</p>
                      <ArrowUpRight />
                    </div>
                    <p>Not installed</p>
                  </Link>
                </DropdownMenuItem>
              ),
            )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants())}
        // isLoading={isConnecting}
        // isDisabled={isConnecting}
        disabled={isConnecting}
      >
        <span className="mr-2 hidden truncate text-sm sm:flex">
          {activeAccount?.name || trimAddress(activeAccount?.address)}
        </span>
        <Identicon
          value={activeAccount?.address}
          size={32}
          theme="polkadot"
          className="hover:cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        avoidCollisions={false}
        className="min-w-[14rem]"
      >
        <DropdownMenuLabel>Accounts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-auto">
          {(accounts || []).map((account) => (
            <DropdownMenuItem
              key={account.address}
              // description={trimAddress(
              //   encodeAddress(account.address, activeChain?.ss58Prefix),
              // )}
              // startContent={

              // }
              onClick={() => {
                setActiveAccount?.(account)
              }}
              aria-label={account.address}
              className={cn(
                'hover:border-white hover:bg-transparent data-[hover=true]:border-white',
                {
                  'bg-white/10': activeAccount?.address === account.address,
                },
              )}
            >
              <div className="flex flex-row items-center">
                <Identicon
                  value={account.address}
                  size={30}
                  theme="polkadot"
                  className="mr-2 hover:cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text truncate">
                    {account?.name ||
                      trimAddress(
                        encodeAddress(account.address, activeChain?.ss58Prefix),
                      )}
                  </span>
                  {account.name && (
                    <span className="text-xs">
                      {trimAddress(
                        encodeAddress(account.address, activeChain?.ss58Prefix),
                      )}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          key={'logout'}
          aria-label={'logout'}
          onClick={() => {
            disconnect?.()
            setActiveAccount?.(undefined)
            ls.set('userWantsConnection', false)
          }}
          className=""
        >
          <UseCases
            width={20}
            height={20}
            stroke="currentColor"
            className="ml-1 mr-3"
          />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // // Connect Button
  // if (!activeAccount)
  //   return (
  //     <Dropdown
  //       classNames={{
  //         content:
  //           'border-3 border-white bg-gradient-to-r from-[#105b5d] to-[#9a1c54]',
  //       }}
  //     >
  //       <DropdownTrigger>
  //         <Button
  //           variant="flat"
  //           size="sm"
  //           className={cn(
  //             'max-w-[300px] rounded-xl border-2 border-white bg-transparent p-7 py-6 text-base',
  //             { 'animate-wiggle': isEffectTrue },
  //           )}
  //           isLoading={isConnecting}
  //           isDisabled={isConnecting}
  //           onClick={() => {
  //             ls.set('userWantsConnection', true)
  //           }}
  //         >
  //           {isConnecting ? (
  //             'connecting'
  //           ) : (
  //             <>
  //               Connect Wallet
  //               <ChevronDown size={16} />
  //             </>
  //           )}
  //         </Button>
  //       </DropdownTrigger>
  //       <DropdownMenu
  //         className="min-w-[14rem]"
  //         variant="bordered"
  //         aria-label="WalletSelect"
  //         classNames={{ base: 'w-[250px]' }}
  //       >
  //         <DropdownSection>
  //           {!activeAccount &&
  //             browserWallets.map((w) =>
  //               isWalletInstalled(w) ? (
  //                 <DropdownItem
  //                   key={w.id}
  //                   className="cursor-pointer hover:border-white hover:bg-transparent data-[hover=true]:border-white"
  //                   onClick={() => {
  //                     connect?.(undefined, w)
  //                   }}
  //                 >
  //                   {w.name}
  //                 </DropdownItem>
  //               ) : (
  //                 <DropdownItem
  //                   key={w.id}
  //                   className="opacity-50 hover:border-white hover:bg-transparent data-[hover=true]:border-white"
  //                 >
  //                   <Link href={w.urls.website}>
  //                     <div className="align-center flex justify-start gap-2">
  //                       <p>{w.name}</p>
  //                       <ArrowUpRight />
  //                     </div>
  //                     <p>Not installed</p>
  //                   </Link>
  //                 </DropdownItem>
  //               ),
  //             )}
  //         </DropdownSection>
  //       </DropdownMenu>
  //     </Dropdown>
  //   )

  // // Account Menu & Disconnect Button
  // return (
  //   <div className="flex select-none flex-wrap items-stretch justify-center gap-4">
  //     <Dropdown
  //       classNames={{
  //         content:
  //           'border-3 border-white bg-gradient-to-r from-[#105b5d] to-[#9a1c54]',
  //       }}
  //     >
  //       <DropdownTrigger>
  //         <Button
  //           variant="flat"
  //           size="lg"
  //           className="max-w-[300px] border-white bg-transparent p-7"
  //         >
  //           <span className="hidden truncate text-sm sm:flex">
  //             {activeAccount.name || trimAddress(activeAccount?.address)}
  //           </span>
  //           <Identicon
  //             value={activeAccount?.address}
  //             size={45}
  //             theme="polkadot"
  //             className="hover:cursor-pointer"
  //           />
  //         </Button>
  //       </DropdownTrigger>
  //       <DropdownMenu
  //         variant="bordered"
  //         aria-label="Account Select"
  //         classNames={{ base: 'w-[250px]' }}
  //       >
  //         <DropdownSection
  //           title="Accounts"
  //           showDivider
  //           className="max-h"
  //           classNames={{
  //             group: 'max-h-72 overflow-y-scroll',
  //           }}
  //         >
  //           {(accounts || []).map((account) => (
  //             <DropdownItem
  //               key={account.address}
  //               description={trimAddress(
  //                 encodeAddress(account.address, activeChain?.ss58Prefix),
  //               )}
  //               startContent={
  //                 <Identicon
  //                   value={account.address}
  //                   size={40}
  //                   theme="polkadot"
  //                   className="hover:cursor-pointer"
  //                 />
  //               }
  //               onClick={() => {
  //                 setActiveAccount?.(account)
  //               }}
  //               aria-label={account.address}
  //               className={cn(
  //                 'hover:border-white hover:bg-transparent data-[hover=true]:border-white',
  //                 {
  //                   'bg-white/10': activeAccount?.address === account.address,
  //                 },
  //               )}
  //             >
  //               <span className="truncate text-xs">
  //                 {account?.name ||
  //                   trimAddress(
  //                     encodeAddress(account.address, activeChain?.ss58Prefix),
  //                   )}
  //               </span>
  //             </DropdownItem>
  //           ))}
  //         </DropdownSection>
  //         <DropdownSection title="Actions">
  //           <DropdownItem
  //             startContent={
  //               <UseCases width={20} height={20} stroke="currentColor" />
  //             }
  //             key={'logout'}
  //             value={'logout'}
  //             aria-label={'logout'}
  //             onClick={() => {
  //               disconnect?.()
  //               setActiveAccount?.(undefined)
  //               ls.set('userWantsConnection', false)
  //             }}
  //             className="hover:border-white hover:bg-transparent data-[hover=true]:border-white"
  //           >
  //             Logout
  //           </DropdownItem>
  //         </DropdownSection>
  //       </DropdownMenu>
  //     </Dropdown>
  //   </div>
  // )
}

export interface AccountNameProps {
  account: InjectedAccount
}

export const AccountName: FC<AccountNameProps> = ({ account, ...rest }) => {
  return <div>{account.name}</div>
}
