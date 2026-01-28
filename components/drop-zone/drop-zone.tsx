import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, ImageOff, Loader2Icon } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "@/lib/tiptap-utils";
import { Button } from "../ui/button";
import { useState } from "react";
import DropZonePreview from "./drop-zone-preview";
import { toast } from "sonner";

export default function DropZone({
  field,
  isCreating,
}: {
  field: any;
  isCreating: boolean;
}) {
  const [previewUrl, setPreviewUrl] = useState<string>();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      field.onChange(acceptedFiles[0]);
      setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
    }
  }, []);

  //react-dropzone hook
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
    maxSize: 5 * 1024 * 1024, //5mb
    onDropRejected: () => rejectFiles(),
    disabled: isCreating,
  });

  // show error toast on invalid file drop
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
        "p-0 cursor-pointer h-50 transition flex flex-col items-center justify-center",
        isDragActive
          ? "border border-primary bg-primary/30"
          : "border border-dashed border-primary/40 hover:bg-secondary",
      )}
    >
      <input {...getInputProps()} />

      {/* Preview */}
      {previewUrl && !isCreating && (
        <DropZonePreview
          field={field}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
        />
      )}

      {/* Drag reject */}
      {!previewUrl && isDragActive && isDragReject && (
        <div className="flex flex-col justify-center w-full h-full space-y-5 items-center bg-destructive/20 border border-destructive/40">
          <ImageOff />
          <p className="text-sm">Invalid file</p>
        </div>
      )}

      {!previewUrl && isDragActive && !isDragReject && <></>}

      {/* Uploading */}
      {previewUrl && !isDragReject && isCreating && (
        <div className="flex flex-col items-center space-y-2">
          <Loader2Icon className="animate-spin" />
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      )}

      {/* Default */}
      {!previewUrl && !isCreating && !isDragReject && !isDragActive && (
        <div className="flex flex-col items-center space-y-2">
          <ImagePlus />
          <p className="text-xs text-muted-foreground text-center">
            Drag & drop image here or click to upload
          </p>
          <Button variant="outline" type="button">
            Select Image
          </Button>
        </div>
      )}
    </Card>
  );
}
