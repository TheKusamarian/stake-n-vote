import { Button } from '@nextui-org/button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from '@nextui-org/modal'

import styles from './modal.module.scss'
import FormDelegate from './form-delegate'
import { BN_ZERO, formatBalance } from '@polkadot/util'
import { NotConnected } from '../not-connected'
import { useInkathon } from '@scio-labs/use-inkathon'
import useAccountBalances from '@/hooks/use-account-balance'
import { CHAIN_CONFIG } from '@/config/config'
import { parseBN } from '@/util'

export default function DelegateComponent() {
  const { data: accountBalance, isLoading } = useAccountBalances()
  const { activeAccount, activeChain } = useInkathon()

  const {
    maxNominators,
    validator: kusValidator,
    tokenSymbol,
    tokenDecimals,
  } = CHAIN_CONFIG[activeChain?.network || 'Polkadot'] || {}

  const { freeBalance } = accountBalance || { freeBalance: BN_ZERO }
  const humanFreeBalance = parseBN(freeBalance, tokenDecimals)

  return (
    <>
      <div className="p-5 text-center">
        <h1 className="text-xl font-bold">Delegate {tokenSymbol}</h1>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-10 py-5">
        {!activeAccount ? <NotConnected /> : <FormDelegate />}
      </div>
      <div className="flex items-center justify-center p-2 text-right text-sm text-gray-200">
        <p className="my-2 text-center text-xs">
          The Kus Delegate is directed by verified humans from The Kusamarian
          community <br />
          <a
            className="underline"
            href="https://discord.gg/QumzjDyeY4"
            target="_blank"
          >
            Join our Discord
          </a>{' '}
          after you delegate!
        </p>
      </div>
    </>
  )
}
