import React, { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export interface InputNftMetaProps {
  name: string
  description: string
  image: string
  onChangeName: (newValue: string) => void
  onChangeDescription: (newValue: string) => void
  onChangeImage: (newValue: string) => void
  previewData?: {
    index?: number
    refId?: string
    [key: string]: string | number | undefined
  }
}

export function InputNftMeta({
  name,
  description,
  image,
  onChangeName,
  onChangeDescription,
  onChangeImage,
  previewData = {},
}: InputNftMetaProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic")
  const [jsonValue, setJsonValue] = useState<string>(
    JSON.stringify({ name, description, image }, null, 2)
  )
  const [jsonError, setJsonError] = useState<string>("")

  // Update JSON value when props change
  useEffect(() => {
    if (activeTab === "advanced") {
      const newJsonValue = JSON.stringify({ name, description, image }, null, 2)
      if (newJsonValue !== jsonValue) {
        setJsonValue(newJsonValue)
      }
    }
  }, [name, description, image, activeTab, jsonValue])

  // Handle JSON changes in advanced mode
  const handleJsonChange = (value: string) => {
    setJsonValue(value)
    try {
      const parsed = JSON.parse(value)
      // Ensure we only update if the values are different
      if (parsed.name !== name) onChangeName(parsed.name ?? "")
      if (parsed.description !== description)
        onChangeDescription(parsed.description ?? "")
      if (parsed.image !== image) onChangeImage(parsed.image ?? "")
      setJsonError("")
    } catch (err) {
      setJsonError("Invalid JSON")
    }
  }

  // Function to resolve placeholders
  function resolvePlaceholders(text: string) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = previewData[key]
      return value !== undefined ? String(value) : match
    })
  }

  // Preview values
  const namePreview = resolvePlaceholders(name)
  const descriptionPreview = resolvePlaceholders(description)

  return (
    <div className="flex flex-col gap-4">
      <Label>NFT Metadata</Label>
      <Tabs
        defaultValue="basic"
        className="w-full flex flex-col gap-2"
        onValueChange={(value) => setActiveTab(value as "basic" | "advanced")}
      >
        <div className="flex flex-row gap-2">
          <TabsList className="w-full h-8">
            <TabsTrigger value="basic" className="text-xs flex-1 h-6">
              Name / Description
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs flex-1 h-6">
              Metadata JSON
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="text-xs text-muted-foreground font-semibold text-center">
          Available placeholders: <code>{"{{index}}"}</code>,{" "}
          <code>{"{{refId}}"}</code>
        </div>
        <TabsContent value="basic" className="pl-4">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-center">
                <Label className="text-xs">Name</Label>
              </div>
              <Input
                value={name}
                onChange={(e) => onChangeName(e.target.value)}
                placeholder="NFT Name"
              />
              {namePreview !== name && (
                <div className="text-xs text-muted-foreground mt-1">
                  Preview: {namePreview}
                </div>
              )}
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => onChangeDescription(e.target.value)}
                placeholder="NFT Description"
              />
              {descriptionPreview !== description && (
                <div className="text-xs text-muted-foreground mt-1">
                  Preview: {descriptionPreview}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="advanced" className="pl-4">
          <div>
            <Label className="text-xs">Metadata JSON</Label>
            <textarea
              className="w-full min-h-[222px] mt-1.5 rounded-lg border border-input bg-background px-3 py-2 text-xs font-mono shadow-sm"
              value={jsonValue}
              onChange={(e) => handleJsonChange(e.target.value)}
              placeholder='{"name": "My NFT", "description": "NFT description", "image": "ipfs://..."}'
            />
            {jsonError && (
              <p className="text-xs text-destructive mt-1">{jsonError}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
