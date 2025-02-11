import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function InputNftMeta({
  name,
  onChangeName,
  description,
  onChangeDescription,
  image,
  onChangeImage,
}: {
  name: string
  description: string
  image: string
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeDescription: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeImage: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="name">
        <TabsList>
          <TabsTrigger value="name">Input Name / Description</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="name">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input type="text" value={name} onChange={onChangeName} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Input
              type="text"
              value={description}
              onChange={onChangeDescription}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Image</Label>
            <Input type="text" value={image} onChange={onChangeImage} />
          </div>
        </TabsContent>
        <TabsContent value="advanced">
          <div className="flex flex-col gap-2">
            <Label>Advanced</Label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
