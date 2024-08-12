"use client"

import { useState } from "react"
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid"
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

import ErrorBoundary from "../error-boundary"
import { NotConnected } from "../not-connected"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import FormDelegate from "./form-delegate"

export function ModalDelegate() {
  const { isDelegateModalOpen, setIsDelegateModalOpen } = useApp()
  const { activeChain, activeAccount } = useInkathon()
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  return (
    <Dialog
      open={isDelegateModalOpen}
      onOpenChange={(open) => {
        setIsDelegateModalOpen(open)
        setIsTooltipOpen(false)
      }}
    >
      <DialogContent className="sm:max-w-[600px] border-4 border-primary-500 bg-gradient-to-br from-primary-500/50 to-teal-500/50">
        <ErrorBoundary>
          <DialogHeader>
            {/* @ts-ignore */}
            <DialogTitle>
              <TooltipProvider>
                <Tooltip delayDuration={10} defaultOpen={false}>
                  <TooltipTrigger
                    className=""
                    onMouseEnter={() => setIsTooltipOpen(true)}
                    onMouseLeave={() => setIsTooltipOpen(false)}
                    onFocus={() => setIsTooltipOpen(true)}
                    onClick={() => setIsTooltipOpen(true)}
                  >
                    <span className="flex items-center">
                      {/* @ts-ignore */}
                      Delegate {activeChain?.tokenSymbol}
                      <QuestionMarkCircleIcon className="h-3.5 w-3.5 inline ml-1" />
                    </span>
                    {/* <br className="hidden md:block" /> */}
                  </TooltipTrigger>
                  {isTooltipOpen && (
                    <TooltipContent side="bottom">
                      <p className="font-base">
                        Delegation is the process of assigning your voting power
                        to another account in Polkadot&apos;s OpenGov governance
                        system. This allows you to participate in governance
                        decisions indirectly, where The Kus DAO will vote on
                        proposals on your behalf. By delegating your votes, you
                        help shape the direction of the network while relying on
                        a representative who aligns with your views and
                        interests.
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </DialogTitle>
            <DialogDescription className="inline">
              Overwhelmed by OpenGov? Delegate your&nbsp;
              {/* @ts-ignore */}
              {activeChain?.tokenSymbol} and join the Kus DAO or let us handle
              it!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pb-4">
            <div className="flex flex-1 flex-col">
              {!activeAccount ? <NotConnected /> : <FormDelegate />}
            </div>
          </div>
          <DialogFooter className="flex-row justify-center sm:justify-center text-center">
            <div className="text-xs">
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
            </div>
          </DialogFooter>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  )
}
