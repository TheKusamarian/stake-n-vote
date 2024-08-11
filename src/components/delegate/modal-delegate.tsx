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

import ErrorBoundary from "../ErrorBoundary"
import { NotConnected } from "../not-connected"
import FormDelegate from "./form-delegate"

export function ModalDelegate() {
  const { isDelegateModalOpen, setIsDelegateModalOpen } = useApp()
  const { activeChain, activeAccount } = useInkathon()

  return (
    <Dialog open={isDelegateModalOpen} onOpenChange={setIsDelegateModalOpen}>
      <DialogContent className="sm:max-w-[600px] border-4 border-primary-500 bg-gradient-to-br from-primary-500/50 to-teal-500/50">
        <ErrorBoundary>
          <DialogHeader>
            {/* @ts-ignore */}
            <DialogTitle>Delegate {activeChain?.tokenSymbol} </DialogTitle>
            <DialogDescription>
              Overwhelmed by OpenGov? Delegate your&nbsp;
              {/* @ts-ignore */}
              {activeChain?.tokenSymbol} &amp; join the KusDAO{" "}
              <br className="hidden md:block" />
              or let us handle it!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-1 flex-col">
              {!activeAccount ? <NotConnected /> : <FormDelegate />}
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
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  )
}
