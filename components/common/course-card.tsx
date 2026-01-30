import Image from "next/image";
import { Card } from "../ui/card";
import { CreateCourseSchema } from "@/zodSchema/schema";
import z from "zod";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import {
  MoreVertical,
  Pencil,
  Trash2Icon,
  LibraryBig,
  ChartNoAxesColumnIncreasing,
  Clock,
} from "lucide-react";

const CourseCard = ({
  course,
}: {
  course: z.infer<typeof CreateCourseSchema>;
}) => {
  return (
    <Card className="p-0 group relative">
      <div className="absolute top-2 right-2 z-30">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={"ghost"} size={"icon-sm"}>
              <MoreVertical
                className="text-black/40 mix-blend-difference"
                size={"lg"}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={"/"}>
                {" "}
                <Pencil />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/"}>
                <Trash2Icon />
                Remove
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative w-full h-58 overflow-hidden">
        <Image
          src={course.imageUrl}
          alt={course.title}
          fill
          className="object-cover hover:scale-110"
        />
      </div>
      <div className="px-2">
        <h1 className="text-lg uppercase">{course.title}</h1>
        <div className="flex flex-col gap-2 mt-3">
          <p className="flex items-center gap-2" aria-label="Category">
            <LibraryBig size={15} /> {course.category}
          </p>
          <p className="flex items-center gap-2">
            <ChartNoAxesColumnIncreasing size={15} /> {course.level}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={15} />
            {course.duration}
          </p>
        </div>
        <p className="line-clamp-1 text-muted-foreground mt-2">
          {course.smallDescription}
        </p>
      </div>
      <div>
        <Link
          href={`/admin/courses/${course.id}`}
          className={buttonVariants({ className: "w-full" })}
        >
          View
        </Link>
      </div>
    </Card>
  );
};

export default CourseCard;
