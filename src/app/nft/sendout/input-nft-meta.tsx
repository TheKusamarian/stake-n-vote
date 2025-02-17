import React, { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { resolvePlaceholders } from "./util"

export interface InputNftMetaProps {
  name: string
  description: string
  image: string
  onChange: (values: {
    name: string
    description: string
    image: string
  }) => void
  previewData?: Record<string, any>
}

export function InputNftMeta({
  name: initialName,
  description: initialDescription,
  image: initialImage,
  onChange,
  previewData = {},
}: InputNftMetaProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic")
  const [localState, setLocalState] = useState({
    name: initialName,
    description: initialDescription,
    image: initialImage,
  })
  const [jsonValue, setJsonValue] = useState<string>(
    JSON.stringify(localState, null, 2)
  )
  const [jsonError, setJsonError] = useState<string>("")

  // Update local state when props change, but preserve existing values
  useEffect(() => {
    setLocalState((prevState) => ({
      ...prevState,
      name: initialName,
      description: initialDescription,
      image: initialImage || prevState.image, // Preserve image if new value is empty
    }))
  }, [initialName, initialDescription, initialImage])

  // Update JSON when local state changes and in advanced mode
  useEffect(() => {
    if (activeTab === "advanced") {
      setJsonValue(JSON.stringify(localState, null, 2))
    }
  }, [localState, activeTab])

  const handleStateChange = (
    key: "name" | "description" | "image",
    value: string
  ) => {
    const newState = { ...localState, [key]: value }
    setLocalState(newState)
    onChange(newState)
  }

  const handleJsonChange = (value: string) => {
    setJsonValue(value)
    try {
      const parsed = JSON.parse(value)
      const newState = {
        name: parsed.name ?? localState.name,
        description: parsed.description ?? localState.description,
        image: parsed.image ?? localState.image,
      }
      setLocalState(newState)
      onChange(newState)
      setJsonError("")
    } catch (err) {
      setJsonError("Invalid JSON")
    }
  }

  const namePreview = resolvePlaceholders(localState.name, previewData)
  const descriptionPreview = resolvePlaceholders(
    localState.description,
    previewData
  )

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
          Available placeholders: <code>{"{{refId}}"}</code>
        </div>
        <TabsContent value="basic" className="pl-4">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-center">
                <Label className="text-xs">Name</Label>
              </div>
              <Input
                value={localState.name}
                onChange={(e) => handleStateChange("name", e.target.value)}
                placeholder="NFT Name"
                maxLength={100}
              />
              {namePreview !== localState.name && (
                <div className="text-xs text-muted-foreground mt-1">
                  Preview: {namePreview}
                </div>
              )}
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={localState.description}
                onChange={(e) =>
                  handleStateChange("description", e.target.value)
                }
                placeholder="NFT Description"
                maxLength={500}
              />
              {descriptionPreview !== localState.description && (
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
