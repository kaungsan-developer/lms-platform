import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, ImageOff, Loader2Icon } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "@/lib/tiptap-utils";
import { Button } from "../ui/button";
import { useState } from "react";
import DropZonePreview from "./drop-zone-preview";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface FileUploadState {
  isUploading: boolean;
  error: boolean;
}
export default function DropZone() {
  const [fileState, setFileState] = useState<FileUploadState>({
    error: false,
    isUploading: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string>();

  // this function will run when image is dropped
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setFileState({
        error: false,
        isUploading: false,
      });
      await uploader(acceptedFiles[0]);
      setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
    }
  }, []);

  // file uploading function
  const uploader = async (file: File) => {
    if (!file) {
      console.log("no file");
      return;
    }

    setFileState(() => ({ isUploading: true, error: false }));
    try {
      const response = await fetch("/api/s3/upload", {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        setFileState((prev) => ({
          file: null,
          error: true,
          isUploading: false,
        }));
        toast.error("Failed to Upload File");
        return;
      }

      const { data } = await response.json();

      await fetch(data.signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-type": file.type,
        },
      });

      setFileState({ isUploading: false, error: false });
      toast.success("Image Uploaded Successfully.");

      return;
    } catch (error) {
      setFileState((prev) => ({
        isUploading: false,
        error: true,
      }));
      toast.error("Failed To Upload File");
      return;
    }
  };

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
        isDragActive
          ? "border border-primary bg-primary/30"
          : "border border-dashed border-primary/40 ",
        "p-0 cursor-pointer h-50 hover:bg-secondary transition flex flex-col items-center justify-center",
      )}
    >
      {previewUrl ? (
        <DropZonePreview
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
        />
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
              {fileState.isUploading ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
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
        </>
      )}
    </Card>
  );
}
