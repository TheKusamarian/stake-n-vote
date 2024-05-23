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

import DelegateComponent from "./delegate"

export function ModalDelegate() {
  const { isDelegateModalOpen, setIsDelegateModalOpen } = useApp()
  const { activeChain } = useInkathon()

  return (
    <Dialog open={isDelegateModalOpen} onOpenChange={setIsDelegateModalOpen}>
      <DialogContent className="sm:max-w-[600px] border-4 border-primary-500 bg-gradient-to-br from-primary-500/50 to-teal-500/50">
        <DialogHeader>
          {/* @ts-ignore */}
          <DialogTitle>Delegate {activeChain?.tokenSymbol} </DialogTitle>
          <DialogDescription>
            {/* @ts-ignore */}
            Here you can delegate your {activeChain?.tokenSymbol} to us and
            shape the future of Polkadot.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DelegateComponent />
        </div>
        <DialogFooter className="flex-row justify-center sm:justify-center text-center">
          <p className="text-xs">
            The Kus Delegate is directed by verified humans from The Kusamarian
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
