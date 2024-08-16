import Image from "next/image"
import logo from "@/images/logos/kusamarian.png"
import { useInkathon } from "@scio-labs/use-inkathon"

export function AccountConnecting() {
  const { activeChain } = useInkathon()
  return (
    <div className="flex items-center justify-center flex-col text-sm">
      <div className="animate-spin mb-8">
        <Image src={logo} alt="the kus" className="inline-block w-auto h-10" />
      </div>
      Connecting to {activeChain?.name} and verifying account...
    </div>
  )
}
