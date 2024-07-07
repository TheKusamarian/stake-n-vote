"use client"

import { useInkathon } from "@scio-labs/use-inkathon"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useApp } from "@/app/app-provider"

import FormAddStake from "./form-add-stake"

export function ModalChangeStake() {
  const { isChangeStakeModalOpen, setIsChangeStakeModalOpen } = useApp()
  const { activeChain } = useInkathon()

  return (
    <Dialog
      open={isChangeStakeModalOpen}
      onOpenChange={setIsChangeStakeModalOpen}
    >
      <DialogContent className="sm:max-w-[600px] border-4 border-primary-500 bg-gradient-to-br from-primary-500/50 to-teal-500/50">
        <DialogHeader>
          {/* @ts-ignore */}
          <DialogTitle>Change {activeChain?.tokenSymbol} Stake </DialogTitle>
          <DialogDescription>
            Overwhelmed by OpenGov? Delegate your
            {/* @ts-ignore */}
            {activeChain?.tokenSymbol} &amp; join the KusDAO{" "}
            <br className="hidden md:block" />
            or let us handle it!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-1 flex-col">
            <FormAddStake />
          </div>
        </div>
        <DialogFooter className="flex-row justify-center sm:justify-center text-center">
          <p className="text-xs">
            The Kus Delegate is directed by verified humans from The Kus
            community <br />
            <a
              className="underline"
              href="https://discord.gg/QumzjDyeY4"
              target="_blank"
              rel="noreferrer"
            >
              Join our Discord
            </a>{" "}
            after you delegate!
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
