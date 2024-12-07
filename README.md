# Turkish Technology Digital Lab Assesment

## Run Locally

```sh
pnpm dev
```

[Visit localhost](http://localhost:3000)

## Packages
- **@thydl/eslint-config:** Custom ESLint configuration for consistent code quality and style.
- **@thydl/tailwind-config:** Tailwind CSS configuration for styling and design consistency.
- **@thydl/typescript-config:** Shared TypeScript configuration for type checking and code safety.
- **@thydl/ui:** UI component library for building user interfaces.


## Libraries
- **langchain:** A framework for developing applications powered by language models.
- **tesseractjs:** A JavaScript library for OCR (Optical Character Recognition) that recognizes text in images.
- **shadcnui:** A UI component library for building modern and responsive user interfaces.


### Example menu images
./examples

### Motivation

Minimum gpt token size and high accuracy passing language complex barrier.

#### Options

<TextBoundaryCropper> Components options

```
  file: File;
  onTextExtracted?: (text: string) => void;
  onTextExtractionStarted?: () => void;
  useBoundary?: boolean;
```

**file**: The image file to be processed for text extraction.

**onTextExtracted**: A callback function that is called when the text extraction is complete. It receives the extracted text as a parameter.

**onTextExtractionStarted**: A callback function that is called when the text extraction process starts.

**useBoundary**: A boolean flag that indicates whether to crop the image based on text boundaries before performing OCR. If set to `true`, the image will be cropped to the detected text boundaries to improve text extraction accuracy. If set to `false`, the entire image will be processed.


## Others

### API Endpoints

- **POST /api/upload**: This endpoint is used to upload a new menu. It processes the uploaded text, extracts menu items and their details, translates non-English values to English, and returns the formatted menu in JSON format.

### Components

- **FileUploader**: A React component that allows users to upload a new menu image. It handles file selection, uploading, and processing of the image to extract text and format the menu.
- **TextBoundaryCropper**: A React component that uses Tesseract.js to perform OCR on the uploaded image. It can optionally crop the image based on text boundaries to improve text extraction accuracy.

### Hooks

- **useDropzone**: A custom hook from the `react-dropzone` library used in the `FileUploader` component to handle drag-and-drop file uploads.
- **useRouter**: A custom hook from the `next/navigation` library used in the `FileUploader` component to handle navigation after successful file upload.

### Utilities

- **cn**: A utility function from the `@thydl/ui/lib/utils` library used to conditionally apply class names in the `FileUploader` component.

### Error Handling

- **console.error**: Used in the `FileUploader` component to log errors during the file upload process.
- **toast.error**: Used in the `FileUploader` component to display error messages to the user when the file upload fails.

### Success Handling

- **toast.success**: Used in the `FileUploader` component to display success messages to the user when the file upload is successful.

### Local Storage

- **localStorage**: Used in the `FileUploader` component to store the formatted menu after successful file upload and to check if a formatted menu already exists.

### Environment Variables

- **process.env.OPENAI_API_KEY**: Used in the `POST /api/upload` endpoint to authenticate requests to the OpenAI API.
