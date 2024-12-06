import { useCallback, useEffect, useRef, useState } from "react";
import { createWorker } from "tesseract.js";

function TextBoundaryCropper({
  file,
  onTextExtracted,
  onTextExtractionStarted,
  useBoundary = false,
}: {
  file?: File | null;
  onTextExtracted?: (text: string) => void;
  onTextExtractionStarted?: () => void;
  useBoundary?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<CanvasImageSource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const extractText = useCallback(
    async (image: HTMLImageElement) => {
      if (!file) return;

      const worker = await createWorker("eng");

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (!originalImageRef.current) return;

      if (useBoundary) {
        const {
          data: { words },
        } = await worker.recognize(file);

        let minX = Infinity,
          minY = Infinity;
        let maxX = -Infinity,
          maxY = -Infinity;

        words.forEach((word) => {
          if (word.confidence > 30) {
            minX = Math.min(minX, word.bbox.x0);
            minY = Math.min(minY, word.bbox.y0);
            maxX = Math.max(maxX, word.bbox.x1);
            maxY = Math.max(maxY, word.bbox.y1);
          }
        });

        // Add some padding
        const padding = 20;
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(image.width, maxX + padding);
        maxY = Math.min(image.height, maxY + padding);

        canvas.width = maxX - minX;
        canvas.height = maxY - minY;

        ctx.drawImage(
          originalImageRef.current,
          minX,
          minY,
          maxX - minX,
          maxY - minY,
          0,
          0,
          maxX - minX,
          maxY - minY
        );
      } else {
        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(
          originalImageRef.current,
          0,
          0,
          image.width,
          image.height
        );
      }

      const rightHalf = ctx.getImageData(
        image.width / 2,
        0,
        image.width / 2,
        image.height
      );

      if (!canvasRef.current) return;

      canvasRef.current.width = image.width / 2;
      canvasRef.current.height = image.height;

      ctx.putImageData(rightHalf, 0, 0);

      // recognize tesseract right canvas
      const data = await worker.recognize(canvasRef.current, undefined, {
        blocks: true,
        layoutBlocks: true,
      });

      const text = data.data.text || "";
      onTextExtracted?.(text);

      await worker.terminate();
      setIsProcessing(false);
    },
    [file, onTextExtracted, useBoundary]
  );

  useEffect(() => {
    if (!file) return;

    const loadImageToCanvas = () => {
      if (!canvasRef.current || isProcessing) return;

      setIsProcessing(true);
      onTextExtractionStarted?.();

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          originalImageRef.current = img;

          void extractText(img);
        };

        img.src = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    };

    loadImageToCanvas();
  }, [file, extractText, onTextExtractionStarted, canvasRef, isProcessing]);

  return <canvas className="hidden" ref={canvasRef} />;
}

export default TextBoundaryCropper;
