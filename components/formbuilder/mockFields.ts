import { FormField } from "@/schema"

export const mockFields: FormField[] = [
  {
    id: "username",
    label: "Username",
    placeholder: "username",
    key: "username",
    type: "string",
    defaultValue: "",
    required: true,
    validation: { min: 1, max: 255 },
  },
  {
    id: "mmm",
    label: "Number",
    key: "myNumber",
    type: "number",
    required: true,
    validation: { min: 1, max: 9999 },
  },
  {
    id: "email",
    label: "Email",
    key: "email",
    defaultValue: "",
    type: "string",
    required: true,
    validation: { format: "email", min: 1, max: 255 },
  },
  {
    id: "bool",
    label: "Security emails",
    desc: "Receive emails about your account security.",
    key: "securityEmails",
    defaultValue: false,
    type: "boolean",
    required: true,
  },
  {
    id: "dateee",
    label: "Date of birth",
    placeholder: "Pick a date",
    desc: "Your date of birth is used to calculate your age.",
    key: "dateOfBirth",
    type: "date",
    required: true,
  },
  {
    id: "file",
    label: "Profile Photo",
    desc: "Upload a profile photo.",
    key: "file",
    type: "file", // Specifies this field as a file input
    accept: "image/jpeg,image/png", // Specifies accepted file types
    required: true,
  },
]
