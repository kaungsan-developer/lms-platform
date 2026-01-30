const CourseDetailPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const res = await fetch(`http://localhost:3000/api/course/${courseId}`);
  const { data: course } = await res.json();
  return <div>{course.title}</div>;
};

export default CourseDetailPage;
