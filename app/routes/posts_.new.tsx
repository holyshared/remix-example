import type { MetaFunction } from "@remix-run/node";
import { ChangeEvent, useRef, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Post" },
    { name: "description", content: "New Post" },
  ];
};

const loadImage = (blob: Blob, onload: (img: HTMLImageElement) => void) => {
  const reader = new FileReader()
  reader.addEventListener("load", (evt: ProgressEvent<FileReader>) => {
    const img = new Image()
    img.addEventListener("load", () => {
      onload(img)
    })
    img.src = evt.target?.result as string
  })
  reader.readAsDataURL(blob)
}

export default function NewPost() {
  const fileSelect = useRef<HTMLInputElement>(null)
  const selectedImage = useRef<HTMLCanvasElement>(null)
  const [_image, setImage] = useState<{
    file: Blob
    text: string
  } | null>(null)
  const onClick = () => {
    fileSelect.current?.click()
  }
  const onSelect = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files as FileList
    loadImage(files[0], (img) => {
      if (!selectedImage.current) {
        return
      }
      const ctx = selectedImage.current.getContext("2d")
      ctx?.drawImage(img, 0, 0)

      setImage({
        file: files[0],
        text: ctx?.canvas.toDataURL("image/jpeg")!
      })
    })
  }

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">New Post</h1>

      <input type="file" name="image" accept="image/png,image/jpeg" ref={fileSelect} onChange={onSelect} className="hidden" />
      <button type="button" onClick={onClick} className="selectFile">select</button>

      <canvas ref={selectedImage} width={200} height={200} />
    </div>
  );
}
