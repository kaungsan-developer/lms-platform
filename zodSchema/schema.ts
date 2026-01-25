import z from "zod";

export const CourseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  fileKey: z.string().min(1, "File is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  duration: z.number().positive("Duration must be a positive number"),
  smallDescription: z.string().min(1, "Small description is required"),
  category: z.string().min(1, "Category is required"),
  slug: z.string().min(1, "Slug is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  price: z.coerce.number().int().min(1, "Price must be a non-negative number"),
});
