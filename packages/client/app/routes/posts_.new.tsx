import type { MetaFunction } from "@remix-run/node";
import { ChangeEvent, useRef, useState } from "react";
import loadImage from "blueimp-load-image";

import { clientOnly$ } from "vite-env-only/macros"
import { pending } from "~/.client/api-client"

const reservePost = clientOnly$(async () => {
  return pending()
})

export const meta: MetaFunction = () => {
  return [
    { title: "New Post" },
    { name: "description", content: "New Post" },
  ];
};

const loadImageToCanvas = async (file: Blob | File) => {
  return loadImage(file, {
    canvas: true,
    orientation: true,
    meta: true
  })
}

const crop = async (file: Blob | File, crop: { x: number, y: number, width: number, height: number }) => {
  const { image } = await loadImageToCanvas(file)

  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);  

  return new Promise<Blob | null>((resolve: (blob: Blob | null) => void, reject: (err: Error) => void) => {
    try {
      canvas.toBlob(resolve, "image/jpeg", 0.85);
    } catch (err) {
      reject(err as Error);
    }
  });
}

const load = async (file: Blob | File) => {
  const { image, exif } = await loadImageToCanvas(file)

  // center position
  const size = image.width > image.height ? image.height : image.width;
  const x = (image.width / 2) - (size / 2);
  const y = (image.height / 2) - (size / 2);

  // exif
  const data = exif!.get("Exif");
  const datetimeKey = (data as any)!.map["DateTimeOriginal"];
  const datetime = (data as any)![datetimeKey];

  return {
    image,
    crop: { x, y, width: size, height: size },
    exif: {
      datetime
    }
  };
}

export default function NewPost() {
  const fileSelect = useRef<HTMLInputElement>(null)
  const selectedImage = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<{
    file: File
    crop: {
      x: number,
      y: number, 
      width: number,
      height: number, 
    },
    exif: {
      datetime: string
    }    
  } | null>(null)
  const onClick = () => {
    fileSelect.current?.click()
  }
  const onSelect = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files as FileList

    load(files[0]).then(({ image, crop, exif }) => {
      if (!selectedImage.current) {
        return
      }
      const ctx = selectedImage.current.getContext("2d")
      ctx?.drawImage(image, 0, 0, crop.width, crop.height, 0,0 , 200, 200)

      setImage({ file: files[0], crop, exif })
    })
  }

  const onCropClick = () => {
    crop(image!.file, image!.crop).then(() => {
      alert("crop clicked");
      if (!reservePost){
        return
      }
      reservePost().then((res) => {
        console.info(res)
        alert("croped");
      })
    })
  }

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">New Post</h1>

      <input type="file" name="image" accept="image/png,image/jpeg" ref={fileSelect} onChange={onSelect} className="hidden" />
      <button type="button" onClick={onClick} className="selectFile">select</button>

      <canvas ref={selectedImage} width={200} height={200} />
      <p>{image?.exif.datetime}</p>

      <button type="button" onClick={onCropClick} disabled={image ? false : true}>crop</button>
    </div>
  );
}
