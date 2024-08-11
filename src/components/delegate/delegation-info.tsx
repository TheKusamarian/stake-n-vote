import { useInkathon } from "@scio-labs/use-inkathon"
import { UseQueryResult } from "react-query"

import { CHAIN_CONFIG } from "@/config/config"
import { useTracks } from "@/hooks/use-tracks"
import { votingForType } from "@/hooks/use-voting-for"

import { Information } from "../Information"

export function DelegationInfo({
  value,
  className,
}: {
  value?: votingForType
  className?: string
}) {
  const { activeChain } = useInkathon()
  const activeChainConfig = CHAIN_CONFIG[activeChain?.network || "Polkadot"]
  const { data: tracks } = useTracks()

  const delegatingToOthers = Object.keys(value || {}).filter(
    (trackId) =>
      value?.[trackId]?.delegating &&
      value?.[trackId]?.delegating.to !== activeChainConfig.delegator
  )

  const delegatingToTheKus = Object.keys(value || {}).filter(
    (trackId) =>
      value?.[trackId]?.delegating &&
      value?.[trackId]?.delegating.to === activeChainConfig.delegator
  )

  console.log("votingFor", value)

  return (
    <Information type="warning" className={className}>
      You are already delegating your votes for tracks:{" "}
      <span>
        {delegatingToOthers && (
          <>
            <strong>
              <>
                {delegatingToOthers
                  .map((trackId) => {
                    const track = tracks?.find(
                      (track) => track.value === trackId
                    )
                    return track?.label
                  })
                  .join(", ")}
              </>
            </strong>
            &nbsp;to someone else.&nbsp;
          </>
        )}
      </span>
      These delegations will be replaced if you delegate to the selected tracks.
    </Information>
  )
}
