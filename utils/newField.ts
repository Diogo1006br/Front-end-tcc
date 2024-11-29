import { FormField } from "@/schema"

import { randNum } from "./randNum"

export function newStringField(): FormField {
  return {
    id: "id" + randNum(),
    key: "key" + randNum(),
    label: "Texto",
    desc: "Descrição",
    placeholder: "",
    type: "string",
    defaultValue: "string",
    required: false,
    validation: {
      min: 1,
      max: 255,
    },
  }
}

export function newNumberField(): FormField {
  return {
    id: "id" + randNum(),
    key: "key" + randNum(),
    label: "Numero",
    desc: "Description",
    placeholder: "",
    type: "number",
    enumName: "myEnum",
    enumValues: [],
    defaultValue: 1,
    required: false,
    validation: {
      min: 1,
      max: 9999999999,
    },
  }
}

export function newBooleanField(): FormField {
  return {
    id: "id" + randNum(),
    key: "key" + randNum(),
    label: "Caixa de opção",
    desc: "Descrição",
    placeholder: "",
    type: "boolean",
    defaultValue: true,
    required: false,
  }
}


export function newDateField(): FormField {
  return {
    id: "id" + randNum(),
    key: "key" + randNum(),
    label: "Data",
    desc: "Descrição",
    placeholder: "Pick a date",
    type: "date",
    required: false,
  }
}

export function newPhotoField(): FormField {
  return {
    id: "id" + randNum(),
    key: "key" + randNum(),
    label: "Imagem",
    desc: "Selecione a imagem",
    placeholder: "Choose a file",
    type: "file", // Use "file" for file input
    accept: "image/jpeg,image/png", // Specify accepted file types
    required: false,

  }
}

export function newElementFormField(): FormField {
  return {
    id: "id" + randNum(),
    key: "key" + randNum(),
    label: "Elemento",
    desc: "Descrição",
    placeholder: "",
    type: "ElementForm",
    required: false,
    form: 1,
    element: 1,
  }
}
