"use client";
import { buttonVariants } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const courses = [
  {
    title: "Introduction to Programming",
    description:
      "Learn the basics of programming using Python. Perfect for beginners!",
    icon: "💻",
  },
  {
    title: "Web Development Fundamentals",
    description:
      "Build modern websites using HTML, CSS, and JavaScript from scratch.",
    icon: "🌐",
  },
  {
    title: "Data Structures & Algorithms",
    description:
      "Understand core data structures and algorithms to write efficient code.",
    icon: "🧠",
  },
  {
    title: "JavaScript Essentials",
    description:
      "Master the fundamentals of JavaScript for interactive web applications.",
    icon: "⚡",
  },
  {
    title: "React for Beginners",
    description: "Learn how to build dynamic user interfaces using React.",
    icon: "⚛️",
  },
  {
    title: "Backend Development with Node.js",
    description: "Create scalable backend services using Node.js and Express.",
    icon: "🛠️",
  },
  {
    title: "Database Design Basics",
    description:
      "Learn how to design, query, and manage databases effectively.",
    icon: "🗄️",
  },
  {
    title: "UI/UX Design Principles",
    description:
      "Design intuitive and user-friendly interfaces with proven UX principles.",
    icon: "🎨",
  },
  {
    title: "Cybersecurity Fundamentals",
    description:
      "Understand common security threats and how to protect applications.",
    icon: "🔐",
  },
  {
    title: "Cloud Computing Basics",
    description:
      "Learn the foundations of cloud platforms and modern deployment.",
    icon: "☁️",
  },
  {
    title: "Version Control with Git",
    description:
      "Track changes, collaborate with teams, and manage code using Git.",
    icon: "🔀",
  },
];

const HomePage = () => {
  const router = useRouter();
  return (
    <div>
      <section>
        <div className="w-full flex flex-col  items-center text-center space-y-15 mt-10">
          <Badge variant={"outline"} className="py-2 px-3">
            <BadgeCheck data-icon="inline-start" />
            <p> The Future of Online Education</p>
          </Badge>
          <h1 className="text-6xl font-bold text-center">
            Elevate Your Learning Experience
          </h1>
          <h3 className="max-w-185 text-xl  opacity-75">
            A flexible learning management system designed to simplify training
            and improve outcomes. A flexible learning management system designed
            to simplify training and improve outcomes.
          </h3>
          <div className="flex gap-10">
            <Link
              href="/"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Explore Courses
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow hover:-translate-y-0.5 "
            >
              <CardHeader>
                <div className="text-4xl mb-4">{course.icon}</div>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>{course.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
