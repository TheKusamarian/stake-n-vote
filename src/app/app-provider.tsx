import React, {
  ReactNode,
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  SubstrateWallet,
  allSubstrateWallets,
  useInkathon,
} from "@scio-labs/use-inkathon"
import ls from "localstorage-slim"

import { ModalDelegate } from "@/components/delegate/modal-delegate"
import { ModalStake } from "@/components/stake/modal-stake"

// Define the context shape
interface AppContextType {
  isEffectTrue: boolean
  enableEffect: () => void // Changed from toggleEffect to enableEffect for clarity
  isStakingModalOpen: boolean
  setIsStakingModalOpen: (isOpen: boolean) => void
  isDelegateModalOpen: boolean
  setIsDelegateModalOpen: (isOpen: boolean) => void
  activeExtension: SubstrateWallet | undefined
  setActiveExtension: (wallet: SubstrateWallet | undefined) => void
  // activeWallet: string | null
  // setActiveWallet: (wallet: string | null) => void
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isEffectTrue, setIsEffectTrue] = useState(false)
  const [isStakingModalOpen, _setIsStakingModalOpen] = useState(false)
  const [isDelegateModalOpen, _setIsDelegateModalOpen] = useState(false)
  const [activeExtension, setActiveExtension] = useState<
    SubstrateWallet | undefined
  >(undefined)
  // const [activeWallet, setActiveWallet] = useState<string | null>(null)

  const {
    connect,
    accounts,
    activeAccount,
    activeExtension: _activeExtension,
    activeChain,
    setActiveAccount,
    // setActiveAccount: _setActiveAccount,
  } = useInkathon()

  const setIsStakingModalOpen = (isOpen: boolean) => {
    _setIsDelegateModalOpen(false)
    _setIsStakingModalOpen(isOpen)
  }

  const setIsDelegateModalOpen = (isOpen: boolean) => {
    _setIsStakingModalOpen(false)
    _setIsDelegateModalOpen(isOpen)
  }

  // Function to enable the effect
  const enableEffect = () => setIsEffectTrue(true)

  // Effect to automatically disable after 1 second
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isEffectTrue) {
      timer = setTimeout(() => {
        setIsEffectTrue(false)
      }, 1000)
    }
    return () => clearTimeout(timer) // Cleanup to avoid memory leaks
  }, [isEffectTrue])

  // useEffect(() => {
  //   const userWantsConnection = ls.get("userWantsConnection")
  //   const activeAccountAddress = ls.get("activeAccount")
  //   if (userWantsConnection) {
  //     connect?.()
  //   }
  //   if (activeAccountAddress) {
  //     console.log("active account from ls", activeAccountAddress)
  //     const account = accounts?.find((a) => a.address === activeAccountAddress)
  //     console.log("account from ls", account)
  //     if (account) {
  //       _setActiveAccount?.(account)
  //     }
  //   }
  // }, [activeExtension, _setActiveAccount, accounts, connect])

  // useEffect(() => {
  //   const activeExtensionId = ls.get("activeExtension")
  //   let activeExtension: SubstrateWallet | undefined

  //   if (activeExtensionId) {
  //     console.log(
  //       "ls get activeExtension:",
  //       activeExtensionId,
  //       allSubstrateWallets
  //     )
  //     activeExtension = allSubstrateWallets.find(
  //       (w) => w.id === activeExtensionId
  //     )
  //     setActiveExtension?.(activeExtension)
  //     connect?.(activeChain, activeExtension)
  //   }
  // }, [activeExtension, connect, activeChain, setActiveExtension, accounts])

  // useEffect(() => {
  //   console.log("accounts changed", accounts)
  //   const activeWalletAddress = ls.get("activeAccount")
  //   let activeAccountAddress: string | undefined
  //   setActiveAccount?.(accounts?.find((a) => a.address === activeWalletAddress))
  // }, [accounts, setActiveAccount])

  // useEffect(() => {
  //   if (activeExtension) {
  //     ls.set("activeExtension", activeExtension.name)
  //     console.log("ls set activeExtension", activeExtension)
  //   }
  // }, [activeExtension])

  return (
    <AppContext.Provider
      value={{
        isEffectTrue,
        enableEffect,
        isStakingModalOpen,
        setIsStakingModalOpen,
        isDelegateModalOpen,
        setIsDelegateModalOpen,
        activeExtension,
        setActiveExtension,
        // activeWallet,
        // setActiveWallet,
      }}
    >
      {children}
      <ModalStake />
      <ModalDelegate />
    </AppContext.Provider>
  )
}

// Custom hook to use the boolean context
export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider")
  }
  return context
}
