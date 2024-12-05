/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console -- Disabling console warnings for development purposes */
"use client";

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
import Image from "next/image";
import { CircleX, CloudUpload, FileUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@thydl/ui/lib/utils";
import { useRouter } from "next/navigation";
import Tesseract from "tesseract.js";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isSent, setIsSent] = useState<boolean | null>(null);

  const [recognizedText, setRecognizedText] = useState("");

  const router = useRouter();

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("file", file as Blob);

      setIsSent(false);

      const recognizeText = async () => {
        if (file) {
          // eslint-disable-next-line import/no-named-as-default-member
          const result = await Tesseract.recognize(file);
          setRecognizedText(result.data.text);

          return result.data.text;
        }

        return "";
      };

      const text = await recognizeText();
      formData.append("text", text);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = (await response.json()) as {
        success: boolean;
        file: {
          name: string;
          path: string;
        };
        formatted: {
          menu: { name: string; description: string }[];
          notes: string[];
        };
      };

      if (!result.success) {
        throw new Error("Upload failed");
      }

      localStorage.setItem("formattedMenu", JSON.stringify(result.formatted));

      toast.success("Files uploaded successfully");

      setTimeout(() => {
        router.push(`/menu`);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
      setIsSent(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setIsSent(null);
  };

  return (
    <div className="relative flex flex-col gap-16 items-center min-h-screen container py-10">
      <div>
        <Image alt="Logo" height={48} src="/logo-black.svg" width={256} />
      </div>

      <form action="/api/upload" onSubmit={handleUpload}>
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Upload menu</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 cursor-pointer border-dashed px-6 py-14 text-center my-2 ${
                isDragActive ? "border-blue-500" : "border-gray-300/40"
              }`}
            >
              <input {...getInputProps({ accept: "image/*" })} />

              {isDragActive ? (
                <p className="text-sm">Drop the image files here ...</p>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <CloudUpload className="w-10 text-blue-500 h-auto" />
                  <p className="text-sm">
                    Drag &#39;n&#39; drop menu image here, or click to select
                    image files
                  </p>
                </div>
              )}
            </div>
            {file ? (
              <div className="mt-8">
                <div
                  className="flex flex-col px-2 py-4 border border-gray-300/40 rounded-md"
                  key={file.name}
                  title={file.name}
                >
                  <div className="flex items-center flex-row flex-nowrap">
                    <FileUp
                      className={cn(
                        "w-6 h-auto",
                        isSent && " text-green-500",
                        isSent === false && "animate-pulse"
                      )}
                    />
                    <span className="truncate text-sm max-w-xs ml-2 mr-4">
                      {file.name}
                    </span>

                    <CircleX
                      className="w-6 ml-auto h-auto text-red-500 cursor-pointer"
                      onClick={() => {
                        removeFile();
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              className="bg-[#c90d0f] hover:bg-[#c90d0f]/80"
              disabled={isSent === false}
              type="submit"
            >
              {isSent === false ? "Processing..." : "Upload"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="w-[400px]">
        <p>{recognizedText}</p>
      </div>
    </div>
  );
}
