import { z } from "zod";

export const questionOptionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Option label is required"),
});

export const questionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Question title is required"),
  type: z.enum(["SHORT_ANSWER", "PARAGRAPH", "MULTIPLE_CHOICE", "CHECKBOX"]),
  options: z.array(questionOptionSchema).optional(),
  answer: z.union([z.string(), z.array(z.string())]).optional(),
  marks: z.number().min(0).optional(),
  required: z.boolean().default(false),
});

export const formDataSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Form title is required"),
  description: z.string().optional(),
  questions: z.array(questionSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const formResponseSchema = z.object({
  id: z.string(),
  formId: z.string(),
  responses: z.record(z.union([z.string(), z.array(z.string())])),
  submittedAt: z.date(),
});



// Change Password Validation schema
export const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .trim()
      .refine((val) => val.length > 0, {
        message: "Current password cannot be empty",
      })
      .refine((val) => !/\s/.test(val), {
        message: "Current password cannot contain spaces",
      }),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .trim()
      .refine((val) => val.length > 0, {
        message: "New password cannot be empty",
      })
      .refine((val) => !/\s/.test(val), {
        message: "New password cannot contain spaces",
      }),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password")
      .trim()
      .refine((val) => val.length > 0, {
        message: "Confirm password cannot be empty",
      })
      .refine((val) => !/\s/.test(val), {
        message: "Confirm password cannot contain spaces",
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });