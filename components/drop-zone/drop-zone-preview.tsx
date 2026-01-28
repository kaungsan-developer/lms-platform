import Image from "next/image";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const DropZonePreview = ({
  field,
  previewUrl,
  setPreviewUrl,
}: {
  field: any;
  previewUrl: string;
  setPreviewUrl: (a: string | undefined) => void;
}) => {
  return (
    <div className="flex gap-4 h-full">
      <Image
        src={previewUrl}
        alt=""
        onLoad={() => URL.revokeObjectURL(previewUrl)}
        width={100}
        height={100}
        className="w-auto h-auto"
      />
      <Button
        variant={"ghost"}
        type="button"
        onClick={() => {
          field.onChange(undefined);
          setPreviewUrl(undefined);
        }}
      >
        <X />
      </Button>
    </div>
  );
};

export default DropZonePreview;
