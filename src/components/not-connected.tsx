import { ConnectButton } from "./ConnectButton"

export function NotConnected() {
  return (
    <>
      <p className="text-lg">⚡️ You are not connected</p>
      <p>
        Please click Connect in the top right corner to connect your wallet or
        to download a supported wallet extension.
      </p>
    </>
  )
}
