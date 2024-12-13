"use server"

import { ApiPromise, WsProvider } from "@polkadot/api"

export async function getReferenda(): Promise<any> {
  try {
    // Connect to Polkadot node
    const wsProvider = new WsProvider("wss://rpc.polkadot.io")
    const api = await ApiPromise.create({ provider: wsProvider })

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
          // You can add more fields here as needed
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
