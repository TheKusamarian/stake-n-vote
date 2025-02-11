"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { pinToPinata, unpinFromPinata } from "@/actions/pin-to-pinata"
import { CheckCircle, CheckCircle2 } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface SelectIpfsImageProps {
  onImageSelected: (ipfsUrl: string) => void
  className?: string
}

export function UploadIpfsImage({
  onImageSelected,
  className,
}: SelectIpfsImageProps) {
  const [preview, setPreview] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [ipfsHash, setIpfsHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      try {
        // if the user has already uploaded an image, unpin it
        if (ipfsHash) {
          await unpinFromPinata({ ipfsHash })
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        const res = await pinToPinata(formData)

        if (res?.data) {
          setIpfsHash(res?.data.ipfsHash)
          onImageSelected(res?.data.ipfsHash)
        } else {
          console.error("Upload error:", res?.serverError)
          setError("Upload error: " + res?.serverError)
        }
      } catch (error) {
        console.error("Failed to upload to IPFS:", error)
        setError("Failed to upload to IPFS: " + error)
      } finally {
        setIsUploading(false)
      }
    },
    [onImageSelected, ipfsHash]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div className="flex flex-col gap-2">
      <Label>NFT Image</Label>
      <Card
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center p-4",
          isDragActive && "border-primary",
          className
        )}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative h-full w-full">
            <Image
              src={preview}
              alt="Preview"
              className="rounded-lg object-contain"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            ↑<p className="text-sm">Drag & drop or click to select image</p>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            Loading...
          </div>
        )}
      </Card>

      <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs -mt-1 text-center w-full h-8">
        {ipfsHash && (
          <>
            <CheckCircle2 className="text-green-600 w-6 h-6" />
            <Link
              href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              View on ipfs ↣
            </Link>
          </>
        )}
      </div>
      {error && (
        <div className="mt-4 p-4 border border-red-500 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
