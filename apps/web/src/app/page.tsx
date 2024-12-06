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
import { ArrowRight, CloudUpload, FileUp, Link } from "lucide-react";
import { toast } from "sonner";
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
            setIsProcessing(false);
            router.push(`/menu`);
          },
          onDismiss: () => {
            setIsProcessing(false);
            router.push(`/menu`);
          },
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload files");
      } finally {
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
            className="lg:py-2 text-blue-500 ml-auto flex flex-row items-center justify-end gap-2 text-sm animate-pulse flex-1 lg:flex-none mb-4"
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

              <div className="flex flex-col items-center gap-2 md:w-96">
                <CloudUpload className="w-10 text-blue-500 h-auto" />
                <p className="text-sm">
                  {isDragActive
                    ? "Drop the image files here ..."
                    : "Drag 'n' drop menu image here, or click to select image files"}
                </p>
              </div>
            </div>
            <ul className="text-xs text-gray-500 list-disc list-inside">
              <li>Only .png, .jpg, and .jpeg files are supported.</li>
              <li>Add new image to replace the current one.</li>
            </ul>
            {acceptedFiles.length > 0 ? (
              <div className="mt-8">
                <div
                  className="flex flex-col px-2 py-1 border border-gray-300/40 rounded-md"
                  key={acceptedFiles[acceptedFiles.length - 1].name}
                  title={acceptedFiles[acceptedFiles.length - 1].name}
                >
                  <div className="flex items-center flex-row flex-nowrap max-w-xs md:max-w-full">
                    {isProcessing ? (
                      <FileUp className="w-6 h-auto animate-pulse" />
                    ) : (
                      <button
                        className="relative bg-white rounded-md border border-gray-300/40 overflow-hidden cursor-pointer"
                        onClick={() =>
                          window.open(
                            URL.createObjectURL(
                              acceptedFiles[acceptedFiles.length - 1]
                            ),
                            "_blank"
                          )
                        }
                        type="button"
                      >
                        <Image
                          alt={acceptedFiles[acceptedFiles.length - 1].name}
                          height={24}
                          src={URL.createObjectURL(
                            acceptedFiles[acceptedFiles.length - 1]
                          )}
                          width={24}
                        />
                        <Link className="w-4 h-auto absolute inset-0 m-auto text-white flex items-center justify-center" />
                      </button>
                    )}
                    <span className="truncate text-sm w-full max-w-xs ml-2 mr-4">
                      {acceptedFiles[acceptedFiles.length - 1].name}
                    </span>
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

      <TextBoundaryCropper
        file={!isProcessing ? selectedFile : null}
        onTextExtracted={(text) => {
          console.log("🚀 ~ file: page.tsx:221 ~ FileUploader ~ text", text);

          setButtonText("Uploading...");
          setProcessedText(text);
        }}
        onTextExtractionStarted={() => {
          setButtonText("Extracting...");
          setIsProcessing(true);
        }}
        // useBoundary
      />
    </div>
  );
}
