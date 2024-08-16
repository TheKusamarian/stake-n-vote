import { ConnectButton } from "./connect-button"

export function NotConnected() {
  return (
    <div className="text-sm text-center">
      <p>⚡️ You are not connected. Please connect your account below</p>
      <div className="w-full flex justify-center mt-4">
        <ConnectButton />
      </div>
    </div>
  )
}
