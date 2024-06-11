import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  SubstrateWallet,
  allSubstrateWallets,
  useInkathon,
} from "@scio-labs/use-inkathon"

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
  connectDropdownOpen: boolean
  setConnectDropdownOpen: (isOpen: boolean) => void
  // activeWallet: string | null
  // setActiveWallet: (wallet: string | null) => void
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isEffectTrue, setIsEffectTrue] = useState(false)
  const [isStakingModalOpen, _setIsStakingModalOpen] = useState(false)
  const [isDelegateModalOpen, _setIsDelegateModalOpen] = useState(false)
  const [connectDropdownOpen, setConnectDropdownOpen] = useState(false)
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
        connectDropdownOpen,
        setConnectDropdownOpen,
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
