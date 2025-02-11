import { Readable } from "stream"
import { NextResponse } from "next/server"
import pinataSDK from "@pinata/sdk"

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_KEY!
)

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "A valid file is required" },
      { status: 400 }
    )
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const readable = Readable.from(buffer)
    const result = await pinata.pinFileToIPFS(readable, {
      pinataMetadata: {
        name: file.name || "untitled",
      },
    })

    const ipfsUrl = `ipfs://${result.IpfsHash}`
    return NextResponse.json({ success: true, data: ipfsUrl })
  } catch (error) {
    console.error("Pinata upload failed:", error)
    return NextResponse.json(
      { success: false, error: "Failed to upload image to IPFS" },
      { status: 500 }
    )
  }
}
