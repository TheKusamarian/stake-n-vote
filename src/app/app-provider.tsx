"use client"

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
import { ModalChangeStake } from "@/components/stake/modal-change-stake"
import { ModalStake } from "@/components/stake/modal-stake"

// Define the context shape
interface AppContextType {
  isEffectTrue: boolean
  enableEffect: () => void // Changed from toggleEffect to enableEffect for clarity
  isStakingModalOpen: boolean
  setIsStakingModalOpen: (isOpen: boolean) => void
  isChangeStakeModalOpen: boolean
  setIsChangeStakeModalOpen: (
    isOpen: boolean,
    modalType: "increase" | "decrease"
  ) => void
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
  const [isChangeStakeModalOpen, _setIsChangeStakeModalOpen] = useState(false)
  const [changeStakeType, setChangeStakeType] = useState<
    "increase" | "decrease"
  >("increase")
  const [isDelegateModalOpen, _setIsDelegateModalOpen] = useState(false)
  const [connectDropdownOpen, setConnectDropdownOpen] = useState(false)
  const [activeExtension, setActiveExtension] = useState<
    SubstrateWallet | undefined
  >(undefined)
  // const [activeWallet, setActiveWallet] = useState<string | null>(null)

  const { activeExtension: _activeExtension } = useInkathon()

  const setIsStakingModalOpen = (isOpen: boolean) => {
    _setIsDelegateModalOpen(false)
    _setIsStakingModalOpen(isOpen)
  }

  const setIsDelegateModalOpen = (isOpen: boolean) => {
    _setIsStakingModalOpen(false)
    _setIsDelegateModalOpen(isOpen)
  }

  const setIsChangeStakeModalOpen = (
    isOpen: boolean,
    modalType: "increase" | "decrease"
  ) => {
    setChangeStakeType(modalType as "increase" | "decrease")
    _setIsDelegateModalOpen(false)
    _setIsStakingModalOpen(false)
    _setIsChangeStakeModalOpen(isOpen)
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

  // Effect to open the correct modal based on URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash

      if (hash === "#stake") {
        setIsStakingModalOpen(true)
      } else if (hash === "#delegate") {
        setIsDelegateModalOpen(true)
      } else if (hash === "#increase-stake") {
        setIsChangeStakeModalOpen(true, "increase")
      } else if (hash === "#decrease-stake") {
        setIsChangeStakeModalOpen(true, "decrease")
      } else {
        // Close all modals if hash is unrecognized
        setIsStakingModalOpen(false)
        setIsDelegateModalOpen(false)
        setIsChangeStakeModalOpen(false, "increase") // Default type
      }
    }

    // Call handler on hash change
    window.addEventListener("hashchange", handleHashChange)

    // Call handler immediately to check if a hash is already present
    handleHashChange()

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  return (
    <AppContext.Provider
      value={{
        isEffectTrue,
        enableEffect,
        isStakingModalOpen,
        setIsStakingModalOpen,
        isDelegateModalOpen,
        setIsDelegateModalOpen,
        isChangeStakeModalOpen,
        setIsChangeStakeModalOpen,
        activeExtension,
        setActiveExtension,
        connectDropdownOpen,
        setConnectDropdownOpen,
      }}
    >
      {children}
      <ModalStake />
      <ModalDelegate />
      <ModalChangeStake type={changeStakeType} />
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
