"use client";
import BackButton from "@/components/back-button";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseSchema } from "@/zodSchema/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldContent } from "@/components/ui/field";
import slugify from "slugify";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import DropZone from "@/components/drop-zone/drop-zone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2Icon } from "lucide-react";

const categories = [
  "Technology",
  "Business",
  "Science",
  "Arts & Design",
  "Health & Fitness",
  "Education",
  "Engineering",
  "Marketing",
  "Personal Development",
  "Language Learning",
];

const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const statuses = ["DRAFT", "PUBLISHED", "ARCHIVED"];

const AdminCreateCoursePage = () => {
  const router = useRouter();

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { handleSubmit, control, getValues, setValue } = useForm({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
      level: "BEGINNER",
      duration: 1,
      smallDescription: "",
      category: "Technology",
      slug: "",
      status: "DRAFT",
      price: "1",
    },
  });

  const imageUploader = async (file: File) => {
    try {
      const response = await fetch("/api/s3/upload", {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to Upload File");
        return;
      }

      const { signedUrl, publicUrl } = await response.json();

      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-type": file.type,
        },
      });

      return publicUrl;
    } catch (error) {
      toast.error("Failed To Upload Image");
      throw new Error();
    }
  };

  const onSubmit = async (data: z.infer<typeof CourseSchema>) => {
    setIsCreating(true);
    try {
      const publicUrl = await imageUploader(data.image);
      //remove image file from form data and only send uploaded image url to backend
      const { image, ...rest } = data;
      const payload = { ...rest, imageUrl: publicUrl };
      const res = await fetch("/api/course/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast.error("Failed to create course");
        return;
      }

      toast.success("New Course Created Successfully.");
      setIsCreating(false);
      router.push("/admin/courses");
    } catch (error) {
      toast.error("Failed to create course");
      setIsCreating(false);
      return;
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <BackButton />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>
              Provide the core information for your course. This helps students
              understand what they’ll learn before enrolling.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Course Title"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="slug"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                    <Field orientation="horizontal">
                      <Input
                        {...field}
                        id="slug"
                        aria-invalid={fieldState.invalid}
                        placeholder="Slug"
                        autoComplete="off"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          const title = getValues("title");
                          const slug = slugify(title, {
                            lower: true,
                            strict: true,
                          });
                          (setValue("slug", slug),
                            { shouldValidate: true, shouldDirty: true });
                        }}
                      >
                        Generate Slug
                      </Button>
                    </Field>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="smallDescription"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="small-description">
                      Small Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="small-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="Small Description"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="small-description">
                      Description
                    </FieldLabel>

                    <SimpleEditor field={field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="image"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="imageUrl">Image</FieldLabel>

                    <DropZone field={field} isCreating={isCreating} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Category and Category Select Duplicated Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                <Controller
                  name="category"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel htmlFor="category">Category</FieldLabel>
                      </FieldContent>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="category"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectSeparator />
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="level"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel htmlFor="level">Level</FieldLabel>
                      </FieldContent>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="level"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectSeparator />
                          {levels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                <Controller
                  name="status"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel htmlFor="status">Status</FieldLabel>
                      </FieldContent>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="status"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectSeparator />
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="price"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldContent>
                        <FieldLabel htmlFor="price">Price</FieldLabel>
                      </FieldContent>
                      <Input
                        placeholder="Price"
                        {...field}
                        type="number"
                        min={1}
                        value={field.value as string}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="duration"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldContent>
                      <FieldLabel htmlFor="duration">Duration</FieldLabel>
                    </FieldContent>
                    <Input
                      placeholder="Duration"
                      {...field}
                      type="number"
                      min={1}
                      value={field.value}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button
              type="submit"
              className="float-right mt-5"
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Create Course"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AdminCreateCoursePage;
