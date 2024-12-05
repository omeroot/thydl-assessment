/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console -- Disabling console warnings for development purposes */
"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@thydl/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@thydl/ui/components/ui/card";
import Image from "next/image";
import { ArrowRight, CircleX, CloudUpload, FileUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@thydl/ui/lib/utils";
import { useRouter } from "next/navigation";
import Tesseract from "tesseract.js";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isSent, setIsSent] = useState<boolean | null>(null);
  const [isMenuExists, setIsMenuExists] = useState<boolean | null>(null);
  const [buttonText, setButtonText] = useState<string>("Upload");

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

          return result.data.text;
        }

        return "";
      };

      setButtonText("Extracting text...");

      const text = await recognizeText();
      formData.append("text", text);

      setButtonText("Uploading...");
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

      toast.success("Files uploaded successfully", {
        position: "top-right",
        onAutoClose: () => {
          router.push(`/menu`);
        },
        onDismiss: () => {
          router.push(`/menu`);
        },
      });
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

  useEffect(() => {
    const checkMenuExists = () => {
      try {
        return localStorage.getItem("formattedMenu") !== null;
      } catch (error) {
        return false;
      }
    };

    setIsMenuExists(checkMenuExists());
  }, []);

  return (
    <div className="relative flex flex-col items-center min-h-screen container py-10">
      <div className="mb-12 md:mb-24 w-full flex justify-center">
        <Image alt="Logo" height={48} src="/logo-black.svg" width={256} />
      </div>

      <form action="/api/upload" className="mt-8" onSubmit={handleUpload}>
        {isMenuExists ? (
          <a
            className="lg:py-2 text-blue-500 ml-auto flex flex-row items-center md:justify-end gap-2 text-sm animate-pulse flex-1 lg:flex-none mb-4"
            href="/menu"
          >
            Look at Previous Menu
            <ArrowRight className="w-4 h-auto" />
          </a>
        ) : null}
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Upload New Menu</CardTitle>
            <CardDescription>
              Upload a new menu to replace the current one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className="border-2 cursor-pointer min-w-lg border-dashed px-6 py-14 text-center my-2 border-gray-300/40"
            >
              <input {...getInputProps({ accept: "image/*" })} />

              <div className="flex flex-col items-center gap-2 lg:w-96">
                <CloudUpload className="w-10 text-blue-500 h-auto" />
                <p className="text-sm">
                  {isDragActive
                    ? "Drop the image files here ..."
                    : "Drag 'n' drop menu image here, or click to select image files"}
                </p>
              </div>
            </div>
            {file ? (
              <div className="mt-8">
                <div
                  className="flex flex-col px-2 py-4 border border-gray-300/40 rounded-md"
                  key={file.name}
                  title={file.name}
                >
                  <div className="flex items-center flex-row flex-nowrap max-w-xs lg:max-w-full">
                    <FileUp
                      className={cn(
                        "w-6 h-auto",
                        isSent && " text-green-500",
                        isSent === false && "animate-pulse"
                      )}
                    />
                    <span className="truncate text-sm w-full max-w-xs ml-2 mr-4">
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
              {buttonText}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
