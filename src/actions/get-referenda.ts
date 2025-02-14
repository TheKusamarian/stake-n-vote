import { ApiPromise, WsProvider } from "@polkadot/api"

export async function getReferenda(chain: "polkadot" | "kusama" = "polkadot") {
  try {
    // Connect to appropriate chain
    const provider =
      chain === "polkadot"
        ? "wss://rpc.polkadot.io"
        : "wss://kusama-rpc.polkadot.io"

    const api = new ApiPromise({
      provider: new WsProvider(provider),
    })
    await api.isReady

    // Query all referendum info
    const referenda = await api.query.referenda.referendumInfoFor.entries()

    // Filter and transform passed referenda
    const passedReferenda = referenda
      .filter(([_, info]) => {
        const status = info.unwrap()
        return status.isApproved || status.isRejected
      })
      .map(([key, info]) => {
        const referendumId = key.args[0].toString()
        const status = info.unwrap()

        return {
          id: referendumId,
          status: status.type,
        }
      })

    await api.disconnect()

    return {
      success: true,
      data: passedReferenda,
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch referenda: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    }
  }
}

interface Referendum {
  id: string
  status: string
  // Add more fields as needed
}
