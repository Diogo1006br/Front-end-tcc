import { z } from "zod";

export const fieldTypes = [
  "string",
  "number",
  "boolean",
  "date",
  "enum",
  "file",
  "ElementForm",
] as const;

export type FieldTypes = "string" | "number" | "boolean" | "date" | "enum" | "file" | "ElementForm";

export const types: { value: FieldTypes; label: string }[] = [
  {
    value: "string",
    label: "String",
  },
  {
    value: "number",
    label: "Number",
  },
  {
    value: "boolean",
    label: "Boolean",
  },
  {
    value: "enum",
    label: "Enum",
  },
  {
    value: "date",
    label: "Date",
  },
  {
    value: "file",
    label: "File",
  },
  {
    value: "ElementForm",
    label: "Element Form",
  },
];

const fieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1).max(50),
  desc: z.string().min(1).max(50).optional(),
  placeholder: z.string().min(1).max(50).optional(),
  key: z.string().min(1).max(50),
  type: z.enum(fieldTypes),
  required: z.boolean(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  style: z.enum(["radio", "select", "combobox" , "file","ElementForm"]).optional(),
  enumValues: z
    .array(z.object({ label: z.string(), value: z.string(), id: z.string() }))
    .optional(),
  enumName: z.string().min(1).max(50).optional(),
  validation: z
    .object({
      format: z.enum(["email", "string"]).optional(),
      min: z.coerce.number().min(1).optional(),
      max: z.coerce.number().max(99999999999).optional(),
      maxSize: z.coerce.number().optional(), // Para validar tamanho máximo de arquivo
    })
    .optional(),
  accept: z.string().optional(),
  file: typeof window === 'undefined' ? z.any() : z.instanceof(FileList), // Adiciona a propriedade accept para tipos de arquivos
  form: z.number().optional(),
  element: z.number().optional()
});

export const formBuilderSchema = z.object({
  name: z.string().min(1).max(50),
  fields: z.array(fieldSchema),
});

export type Form = z.infer<typeof formBuilderSchema>;
export type FormField = z.infer<typeof fieldSchema>;
