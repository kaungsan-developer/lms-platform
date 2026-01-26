import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, ImageOff } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "@/lib/tiptap-utils";
import { Button } from "../ui/button";
import { useState } from "react";

import DropZonePreview from "./drop-zone-preview";

import { toast } from "sonner";

export default function DropZone() {
  const [file, setFile] = useState<string>();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    if (acceptedFiles.length) {
      setFile(URL.createObjectURL(acceptedFiles[0]));
    }
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: () => rejectFiles(),
  });

  const rejectFiles = () => {
    fileRejections.map(({ file, errors }) => {
      errors.map((e) => {
        switch (e.code) {
          case "file-too-large":
            toast.error("File is too large, max is 5Mb.");
            break;
          case "file-invalid-type":
            toast.error("Invalid file type.");
            break;
          default:
            toast.error("Failed to upload image");
        }
      });
    });
  };

  return (
    <Card
      {...getRootProps()}
      className={cn(
        isDragActive
          ? "border border-primary bg-primary/30"
          : "border border-dashed border-primary/40 ",
        "p-0 cursor-pointer h-50 hover:bg-secondary transition flex flex-col items-center justify-center",
      )}
    >
      {file ? (
        <DropZonePreview file={file} setFile={setFile} />
      ) : (
        <>
          <input {...getInputProps()} />

          {isDragActive ? (
            isDragReject ? (
              <div className="flex flex-col justify-center w-full h-full space-y-5 items-center bg-destructive/20 border border-destructive/40">
                <ImageOff />
                <p className="text-sm">Invalid</p>
              </div>
            ) : (
              <>{/* <ImageDown className="w-15 h-15" /> */}</>
            )
          ) : (
            <>
              <ImagePlus />
              <p className="text-xs text-muted-foreground">
                Drag And Drop Image Here Or Select Image To Upload
              </p>
              <Button variant="outline" type="button">
                Select Image
              </Button>
            </>
          )}
        </>
      )}
    </Card>
  );
}
