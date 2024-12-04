"use client";

import * as React from "react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@thydl/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@thydl/ui/components/ui/card";
import { Progress } from "@thydl/ui/components/ui/progress";
import Image from "next/image";

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = () => {
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500);
  };

  return (
    <div className="flex flex-col gap-16 items-center justify-center min-h-screen">
      <div>
        <Image alt="Logo" height={48} src="/logo-black.svg" width={256} />
      </div>
      <Card className="w-[400px] min-h-64">
        <CardHeader>
          <CardTitle>Upload menu</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 cursor-pointer border-dashed p-6 text-center my-2 ${
              isDragActive ? "border-blue-500" : "border-gray-300/40"
            }`}
          >
            <input {...getInputProps({ accept: "image/png, image/jpeg" })} />
            {isDragActive ? (
              <p>Drop the image files here ...</p>
            ) : (
              <p>
                Drag &#39;n&#39; drop menu image here, or click to select image
                files
              </p>
            )}
          </div>
          {files.length > 0 && (
            <div className="mt-8">
              <h4>Selected files:</h4>
              <ul>
                {files.map((file) => (
                  <li className="truncate" key={file.name} title={file.name}>
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {uploadProgress > 0 && (
            <div className="mt-8">
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            className="bg-[#c90d0f] hover:bg-[#c90d0f]/80"
            onClick={handleUpload}
          >
            Upload
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
