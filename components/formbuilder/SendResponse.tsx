"use client"

import React, { useEffect, useState } from "react"
import { FormField as FF } from "@/schema"
import { useAppStateEditor } from "@/state/stateEditor"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, set } from "date-fns"
import api from "@/Modules/Auth"
import Link from "next/link"


import {
  AlertCircle,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  FileWarning,
  Terminal,
  ImageDown,
  CheckCheck,
  MessageCirclePlus,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { object, z } from "zod"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
// import { newPhotoField } from "@/utils/newField"
import Image  from 'next/image'
const formSchema = z.object({
  file: z.instanceof(FileList).optional(),
});
import ImageUploader from "@/components/formbuilder/ImageUploader"


import AddElement from '@/components/formbuilder/AddElement';



export function Sender({params}: {params: {id: string, asset: string, instance: string, forms: any  }}) {
  const { id, asset, instance } = params;
  const [formsAll,setAllForm] = useState([]);
  
  const { forms, selectedForm,fetchforms } = useAppStateEditor(id)
  const [error, setError] = useState<string>()
  const [file, setFile] = useState<{ [key: string]: File }>({});
 

  console.log("params.id.id", id)
  fetchforms(id)

  let formFields = forms[selectedForm].fields
  console.log("formFields", formFields)

  let formSchema = z.object({})

  useEffect(() => {
    for (let f of formFields) {
      switch (f.type) {
        case "string":
          if (f.validation?.format === "email") {
            Object.assign(formSchema, {
              [f.key]: z.string().email().min(1).max(9999999999),
            })
          } else {
            Object.assign(formSchema, {
              [f.key]: z.string().email().min(1).max(9999999999),
            })
          }
          break
        case "number":
          Object.assign(formSchema, {
            [f.key]: z.coerce
              .number()
              .min(f.validation?.min || 1)
              .max(f.validation?.max || 9999999999),
          })
          break
        case "boolean":
          Object.assign(
            formSchema,

            {
              [f.key]: z.boolean(),
            }
          )
          break
        case "date":
          Object.assign(formSchema, {
            [f.key]: z.date(),
          })

          break
        case "enum":
          Object.assign(formSchema, {
            [f.key]: z.string(),
          })
          break
        case "file":
          Object.assign(formSchema, {
            [f.key]: z.any().refine(file => {
            if (file instanceof File) {
              return ["image/jpeg", "image/png"].includes(file.type);
            }
            return false;
          }, {
            message: "Invalid file type or size",
          }),
        })
        case "ElementForm":
          Object.assign(formSchema, {
            [f.key]: z.number({}),
          })
          break
        default:
      }
    }
    formSchema = z.object({})
    console.log("ffff", form.getValues(), formSchema.strip())
  }, [selectedForm])

  const form = useForm<z.infer<any>>({
    // const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })




  useEffect(() => {
    api.get(`forms/`)
      .then(response => {
        setAllForm(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    api.get('form-responses/', {
      params: {
        formID: params.id,
        Asset: params.asset,
        content_type: params.instance

      }
    }).then(response => {
      // Acessando diretamente a chave response dentro do objeto de resposta
      const formData = response.data;
      console.log('formData', formData);
      const responses = formData.response;
      console.log("responses 1",responses)
      if (formData.response.length === 0) {
        form.getValues().forEach((key: string) => {
          form.setValue(key, '');
        });
      } else {
        // Se pelo menos um valor não for nulo, continue com a lógica atual
        Object.entries(responses).forEach(([key, value]) => {
          if (value === undefined) {
            return;
          }
          form.setValue(key, value);
        });
          }
    })
    .catch(error => {
      console.error(error);
    });
  }, []);
  const validateForm = (fields: any[]) => {
    let isValid = true;
    
    fields.forEach(field => {
      console.log('field',form.getValues()[field.key]);
      if (field.required && !form.getValues()[field.key]){
        isValid = false;
        setError("Please fill all required fields");
      } else {
        setError("");
      }
    });
    return isValid;
  };
    

  async function onSubmit() {
    const fields = formFields
    if (validateForm(fields)) {
        let values = { formID: id,response: form.getValues(), object_id: asset, response_type: instance,};
        // console.log("respostas", form.getValues());
        // console.log("form Fields", formFields);
        // console.log("selectedForm", selectedForm);
        // console.log("form name", forms[selectedForm].name);
        try {
          const response = await api.post(`/form-responses/`, values);
          // console.log(values);
          // console.log(response.data);
      } catch (error) {
          console.error(error);
          if (error.response) {
              // O servidor retornou uma resposta que não é 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
          } else if (error.request) {
              // A requisição foi feita, mas não houve resposta
              console.log(error.request);
          } else {
              // Algo aconteceu na configuração da requisição que disparou um erro
              console.log('Error', error.message);
          }
      }
      try{
        // para cada iamgem em file
        let ImageData
        for (let key in file) {
          ImageData={
            image: file[key],
            object_id: params.asset,
            response_type: "Asset",
            questionKey: key

          }
          

        }
        const response = await api.post(`/images/`, ImageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

      }catch (error) {
        console.error(error);
        if (error.response) {
            // O servidor retornou uma resposta que não é 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // A requisição foi feita, mas não houve resposta
            console.log(error.request);
        } else {
            // Algo aconteceu na configuração da requisição que disparou um erro
            console.log('Error', error.message);
        }
    }
  }else{
    setError("Form submission failed. Please check the required fields.");
  }
  }
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {formFields.map((f) => (
          <>
            {f.type === "string" && StringField(f)}
            {f.type === "number" && NumberField(f)}
            {f.type === "date" && DateField(f)}
            {f.type === "boolean" && BooleanField(f)}
            {f.style === "radio" && RadioField(f)}
            {f.style === "select" && SelectField(f)}
            {f.style === "combobox" && ComboboxField(f)}
            {f.type === "file" && PhotoField(f)}
            {f.type === "ElementForm" && ElemenetButtonField(f)}
          </>
        ))}
        {error && (
              <Alert className="">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
        <Button className = "dark:bg-background dark:text-foreground" onClick={() => form.getValues()}>Salvar</Button>

    
      </form>
    </Form>
  )
  function ComboboxField(f: FF) {
    
    return (

      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-lg border p-4">
            <FormLabel>
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn("justify-between w-72 dark:bg-background dark:text-foreground",
                      !field.value && "text-muted-foreground "
                    )}
                  >
                    {field.value
                      ? f.enumValues?.find((item) => item.value === field.value)?.label
                      : "Selecione..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder={`Buscar em ${f.enumName}...`} required={f.required} />
                  <CommandEmpty>Não encontrado</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {f.enumValues?.map((item) => (
                        <CommandItem
                          value={item.label}
                          key={item.value}
                          onSelect={() => {
                            form.setValue(f.key, item.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.value === field.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {item.label}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <ImageUploader fileKey={f.key} file={file} params={params} setFile={setFile} />
            <FormDescription>{f.desc}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  function SelectField(f: FF) {
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{f.label}{f.required && <span className="text-red-500">*</span>}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} required={f.required}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={f.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {f.enumValues?.map((v) => (
                  <SelectItem value={v.value}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>{f.desc}</FormDescription>
            <ImageUploader fileKey={f.key} file={file} params={params} setFile={setFile} />
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  function RadioField(f: FF) {
    
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>{f.label}{f.required && <span className="text-red-500">*</span>}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className = {f.required ? "border-red-500 flex flex-col space-y-1" : "flex flex-col space-y-1" }
                required={f.required}
              >
                {f.enumValues?.map((v) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={v.value} />
                    </FormControl>
                    <FormLabel className="font-normal">{v.label}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <ImageUploader fileKey={f.key} file={file} params={params} setFile={setFile} />
            <FormDescription>{f.desc}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  function BooleanField(f: FF) {
    
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-lg border p-4 w-full">
              <FormLabel className="text-base justify-start">{f.label}{f.required && <span className="text-red-500">*</span>}</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} required={f.required} />
              </FormControl>
              <ImageUploader fileKey={f.key} file={file} params={params} setFile={setFile} />
              <FormDescription>{f.desc}</FormDescription>
          </FormItem>
        )}
      />
    )
  }

  function DateField(f: FF) {
    
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-lg border p-4">
            <FormLabel>{f.label}{f.required && <span className="text-red-500">*</span>}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal dark:bg-background dark:text-foreground",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>{f.placeholder}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  required={f.required}
                  // disabled={(date) =>
                  //   date > new Date() || date < new Date("1900-01-01")
                  // }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <ImageUploader fileKey={f.key} file={file} params={params} setFile={setFile} />
            <FormDescription>{f.desc}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  function NumberField(f: FF) {
    
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="rounded-lg border p-4">
            <FormLabel>{f.label}{f.required && <span className="text-red-500">*</span>}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={f.placeholder} {...field} required={f.required} onChange={field.onChange} />
            </FormControl>
            <ImageUploader fileKey={f.key} file={file} params={params} setFile={setFile} />
            <FormDescription>{f.desc}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  function StringField(f: FF) {
    // Componente funcional para lidar com a seleção de imagem e exibição
    
  
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="rounded-lg border p-4">
            <FormLabel>{f.label}{f.required && <span className="text-red-500">*</span>}</FormLabel>
            <FormControl>
                {f.validation?.format === "email" ? (
                  <Input
                    type="email"
                    placeholder={f.placeholder}
                    {...field}
                    required={!!f.required}
                    onChange={field.onChange}
                    
                  />
                ) : (
                  console.log('f.required:', f.required),
                  <Input
                    placeholder={f.placeholder}
                    {...field}
                    required={!!f.required}
                    onChange={field.onChange}
                    
                  />
                )}
            </FormControl>
            <ImageUploader fileKey={f.key} file={file} params={params} setFile={setFile} />
            <FormDescription>{f.desc}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function PhotoField(f: FF) {
    return (
       <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-lg border p-4">
            <FormLabel>{f.label}{f.required && <span className="text-red-500">*</span>}</FormLabel>
            <FormControl>
              <Input className="hover:cursor-pointer" type="file" id="picture" {...field} required={f.required} onChange={field.onChange}/>
            </FormControl>
            <FormDescription>{f.desc}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function ElemenetButtonField(f: FF) {
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-lg border p-4">
            <FormLabel>{f.label}</FormLabel>
            <FormControl>
            <AddElement elementData={formsAll} />
              {/* <Link href={`/sistema/subitem/${f.element}/${f.form}`}>
                <Button>Adicionar Elemento</Button>
              </Link> */}
            </FormControl>
            <FormDescription>{f.desc}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

}