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
      <div className="flex flex-1 flex-col">
        {!activeAccount ? <NotConnected /> : <FormDelegate />}
      </div>
    </>
  )
}
