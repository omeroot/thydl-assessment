/* eslint-disable no-console -- Disabling console warnings for development purposes */
"use client";

import { useCallback, useEffect, useState } from "react";
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
import TextBoundaryCropper from "@/components/text-boundary";

export default function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedText, setProcessedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [isMenuExists, setIsMenuExists] = useState<boolean | null>(null);
  const [buttonText, setButtonText] = useState<string>("Upload");

  const router = useRouter();

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      noDrag: isProcessing,
    });

  const handleUpload = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setSelectedFile(acceptedFiles[acceptedFiles.length - 1]);
    },
    [acceptedFiles]
  );

  const removeFile = useCallback(() => {
    if (isProcessing) return;

    setSelectedFile(null);
  }, [isProcessing]);

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

  useEffect(() => {
    if (!processedText) return;

    const run = async () => {
      try {
        setButtonText("Uploading...");

        const formData = new FormData();
        formData.append("text", processedText);

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
      } finally {
        setIsProcessing(false);
        setSelectedFile(null);
        setButtonText("Upload");
      }
    };

    void run();
  }, [processedText, router]);

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
            <em className="text-xs text-gray-500">
              Only .png, .jpg, and .jpeg files are supported.
            </em>
            {acceptedFiles.length > 0 ? (
              <div className="mt-8">
                <div
                  className="flex flex-col px-2 py-4 border border-gray-300/40 rounded-md"
                  key={acceptedFiles[acceptedFiles.length - 1].name}
                  title={acceptedFiles[acceptedFiles.length - 1].name}
                >
                  <div className="flex items-center flex-row flex-nowrap max-w-xs md:max-w-full">
                    <FileUp
                      className={cn(
                        "w-6 h-auto",
                        isProcessing && "animate-pulse"
                      )}
                    />
                    <span className="truncate text-sm w-full max-w-xs ml-2 mr-4">
                      {acceptedFiles[acceptedFiles.length - 1].name}
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
          <CardFooter className="flex justify-end items-end flex-col">
            <Button
              className="bg-[#c90d0f] hover:bg-[#c90d0f]/80"
              disabled={isProcessing}
              type="submit"
            >
              {buttonText}
            </Button>
            {isProcessing ? (
              <em className="text-[0.5rem] text-gray-600 mt-1">
                It may take a while to process the image.
              </em>
            ) : null}
          </CardFooter>
        </Card>
      </form>

      {selectedFile ? (
        <TextBoundaryCropper
          file={selectedFile}
          onTextExtracted={(text) => {
            console.log("🚀 ~ file: page.tsx:221 ~ FileUploader ~ text", text);
            setProcessedText(text);
          }}
          onTextExtractionStarted={() => {
            setButtonText("Extracting...");
            setIsProcessing(true);
          }}
        />
      ) : null}
    </div>
  );
}
