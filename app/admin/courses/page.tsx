import BackButton from "@/components/back-button";
import CourseCard from "@/components/common/course-card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
const AdminCoursesPage = async () => {
  const res = await fetch("http://localhost:3000/api/course/get");
  const { data: courses } = await res.json();
  console.log(courses);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
        {courses?.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        {courses?.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        {courses?.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default AdminCoursesPage;
