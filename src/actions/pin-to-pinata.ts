"use server"

import { Readable } from "stream"
import pinataSDK from "@pinata/sdk"
import { createSafeActionClient } from "next-safe-action"
import { z } from "zod"

export interface PinToPinataResponse {
  ipfsHash: string
}

export interface UnpinFromPinataResponse {
  success: boolean
}

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_KEY!
)

const schema = z.preprocess(
  (value) => {
    if (value instanceof FormData)
      return {
        file: value.get("file"),
      }
    return value
  },
  z.object({
    file: z.instanceof(File).refine((file) => file.size > 0, {
      message: "A valid file is required",
    }),
  })
)

export const pinToPinata = createSafeActionClient()
  .schema(schema)
  .action<PinToPinataResponse>(async ({ parsedInput: { file } }) => {
    const buffer = Buffer.from(await file.arrayBuffer())
    const readable = Readable.from(buffer)
    const result = await pinata.pinFileToIPFS(readable, {
      pinataMetadata: {
        name: file.name,
      },
    })

    return { ipfsHash: result.IpfsHash }
  })

export const unpinFromPinata = createSafeActionClient()
  .schema(z.object({ ipfsHash: z.string() }))
  .action<UnpinFromPinataResponse>(async ({ parsedInput: { ipfsHash } }) => {
    await pinata.unpin(ipfsHash)
    return { success: true }
  })
