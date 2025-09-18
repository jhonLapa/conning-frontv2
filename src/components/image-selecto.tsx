import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon, Link } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageSelectorProps {
  open: boolean
  setOpen:  React.Dispatch<React.SetStateAction<boolean>>
  setImagen: (imageUrl: string) => void
  imagen?: string
  width?: string
  className?: string
  variant?: "circular" | "square"
}

export default function ImageSelector({
  open,
  setOpen,
  setImagen,
  imagen,
  width = "w-32",
  className,
  variant = "circular",
}: ImageSelectorProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")

  const defaultImage = "https://cdn-icons-png.flaticon.com/512/12048/12048902.png"

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    setPreviewUrl(url)
  }

  const handleSaveImage = () => {
    if (imageUrl.trim()) {
      setImagen(imageUrl.trim())
      setOpen(false)
      setImageUrl("")
      setPreviewUrl("")
    }
  }

  const handleRemoveImage = () => {
    setImagen("")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImageUrl(result)
        setPreviewUrl(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <div className={cn("relative group", className)}>
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer",
            width,
            "aspect-square",
            variant === "circular" ? "rounded-full" : "rounded-3xl",
          )}
          onClick={() => setOpen(true)}
        >
          <img src={imagen || defaultImage} alt="Imagen seleccionada" className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2 shadow-sm">
              <Upload className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>

        {imagen && (
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 shadow-sm"
            onClick={(e) => {
              e.stopPropagation()
              handleRemoveImage()
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl border-gray-200">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-600" />
              Seleccionar Imagen
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url" className="text-sm text-gray-700 flex items-center gap-2">
                <Link className="w-4 h-4 text-gray-500" />
                URL de la imagen
              </Label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                className="rounded-2xl border-gray-200 focus:border-gray-400 focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-file" className="text-sm text-gray-700 flex items-center gap-2">
                <Upload className="w-4 h-4 text-gray-500" />O subir archivo
              </Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="rounded-2xl border-gray-200 focus:border-gray-400 focus:ring-0 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-xl file:px-3 file:py-1 file:mr-3 file:text-sm"
              />
            </div>

            {previewUrl && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-700">Vista previa</Label>
                <div className="w-full max-w-sm mx-auto">
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Vista previa"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  setImageUrl("")
                  setPreviewUrl("")
                }}
                className="rounded-2xl border-gray-200 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveImage}
                disabled={!imageUrl.trim()}
                className="rounded-2xl bg-gray-900 hover:bg-gray-800 text-white"
              >
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
