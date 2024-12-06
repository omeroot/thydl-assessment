import { useCallback, useEffect, useRef } from "react";
import { createWorker } from "tesseract.js";

function TextBoundaryCropper({
  file,
  onTextExtracted,
  onTextExtractionStarted,
  useBoundary = false,
}: {
  file: File;
  onTextExtracted?: (text: string) => void;
  onTextExtractionStarted?: () => void;
  useBoundary?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<CanvasImageSource | null>(null);

  const extractText = useCallback(
    async (blob: Blob) => {
      const worker = await createWorker("eng");

      const image = new Image();
      image.src = URL.createObjectURL(blob);

      let text = "";

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

        // Crop the image
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = maxX - minX;
        canvas.height = maxY - minY;
        const ctx = canvas.getContext("2d");

        if (!ctx || !originalImageRef.current) return;

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

        const rightHalf = ctx.getImageData(
          image.width / 2,
          0,
          image.width / 2,
          image.height
        );

        const rightCanvas = document.createElement("canvas");
        rightCanvas.width = image.width / 2;
        rightCanvas.height = image.height;

        const rightCtx = rightCanvas.getContext("2d");

        if (!rightCtx) return;

        rightCtx.putImageData(rightHalf, 0, 0);

        // recognize tesseract right canvas
        const data = await worker.recognize(rightCanvas, undefined, {
          blocks: true,
          layoutBlocks: true,
        });

        text = data.data.text;
      } else {
        const { data } = await worker.recognize(image);
        text = data.text;
      }

      onTextExtracted?.(text);

      await worker.terminate();
    },
    [file, onTextExtracted, useBoundary]
  );

  useEffect(() => {
    const loadImageToCanvas = () => {
      onTextExtractionStarted?.();
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          originalImageRef.current = img;

          // Create a temporary canvas to load the image
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = img.width;
          tempCanvas.height = img.height;
          const tempCtx = tempCanvas.getContext("2d");

          if (!tempCtx) return;

          tempCtx.drawImage(img, 0, 0, img.width, img.height);

          // Convert canvas to file for Tesseract
          tempCanvas.toBlob((blob) => {
            if (!blob) return;

            void extractText(blob);
          });
        };
      };
    };

    loadImageToCanvas();
  }, [file, extractText, onTextExtractionStarted]);

  return <canvas className="hidden" ref={canvasRef} />;
}

export default TextBoundaryCropper;
