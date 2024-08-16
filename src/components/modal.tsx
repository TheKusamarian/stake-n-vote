"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Dialog, DialogContent } from "./ui/dialog"

export function Modal() {
  const router = useRouter()
  const path = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null)

  useEffect(() => {
    // Open the modal if the current route is '/stake'
    if (path === "/stake") {
      setModalContent(<h1>Modal Stake</h1>)
      setIsModalOpen(true)
    }
    if (path === "/delegate") {
      setModalContent(<h1>Modal Delegate</h1>)
      setIsModalOpen(true)
    }
  }, [path])

  const closeModal = () => {
    router.push("/", { scroll: false })
    setIsModalOpen(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <h1>Modal</h1>
        {modalContent}
      </DialogContent>
    </Dialog>
  )
}
