import Image from "next/image";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const DropZonePreview = ({
  file,
  setFile,
}: {
  file: string;
  setFile: (a: string | undefined) => void;
}) => {
  return (
    <div className="flex gap-4 h-full">
      <Image
        src={file}
        alt=""
        onLoad={() => URL.revokeObjectURL(file)}
        width={100}
        height={100}
        className="w-auto h-auto"
      />
      <Button
        variant={"ghost"}
        type="button"
        onClick={() => setFile(undefined)}
      >
        <X />
      </Button>
    </div>
  );
};

export default DropZonePreview;
