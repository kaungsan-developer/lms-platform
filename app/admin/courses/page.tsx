import BackButton from "@/components/back-button";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
const AdminCoursesPage = () => {
  return (
    <div>
      <div className="flex justify-between">
        <BackButton />
        <Link
          href={"/admin/courses/create"}
          className={buttonVariants({
            variant: "secondary",
          })}
        >
          Create Course
        </Link>
      </div>
    </div>
  );
};

export default AdminCoursesPage;
