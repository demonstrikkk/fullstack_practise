"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

export default function AvatarDropzone({ onUpload, currentImage }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/UploadAvatar", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok && data.url) {
      onUpload(data.url); // Sends image URL back to form
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="w-full h-40 border-2 border-dashed border-gray-400 flex justify-center items-center cursor-pointer rounded-lg"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : currentImage ? (
        <Image src={currentImage} alt="Avatar" width={100} height={100} className="rounded-full" />
      ) : (
        <p>Drag & drop avatar or click to select</p>
      )}
    </div>
  );
}

