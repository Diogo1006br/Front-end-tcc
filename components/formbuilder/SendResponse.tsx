import React, { useEffect, useState, useRef } from "react";
import { FormField as FF } from "@/schema";
import { useAppStateEditor } from "@/state/stateEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import api from "@/Modules/Auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import { ChevronsUpDown, Check, CalendarIcon } from "lucide-react";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandList, CommandItem } from "@/components/ui/command";
import 'react-toastify/dist/ReactToastify.css';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/formbuilder/ImageUploader";
import AddElement from '@/components/formbuilder/AddElement';

// Utility function to conditionally join class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Sender({ params }: { params: { id: any, asset: string, instance: string } }) {
  const { id, asset, instance } = params;
  const [formsAll, setAllForm] = useState([]);
  const { forms, selectedForm } = useAppStateEditor(id);
  const [error, setError] = useState<string>();
  const [file, setFile] = useState<{ [key: string]: File }>({});

  let formFields = forms[selectedForm].fields;

  let formSchema = z.object({});

  const formSchemaRef = useRef(z.object({}));

  const form = useForm<z.infer<any>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const schema: Record<string, any> = {};
    for (let f of formFields) {
      switch (f.type) {
        case "string":
          schema[f.key] = f.validation?.format === "email"
            ? z.string().email().min(1).max(9999999999)
            : z.string().min(1).max(f.validation?.max || 9999999999);
          break;
        case "number":
          schema[f.key] = z.coerce.number().min(f.validation?.min || 1).max(f.validation?.max || 9999999999);
          break;
        case "boolean":
          schema[f.key] = z.boolean();
          break;
        case "date":
          schema[f.key] = z.date();
          break;
        case "enum":
          schema[f.key] = z.string();
          break;
        case "file":
          schema[f.key] = z.any().refine(file => {
            if (file instanceof File) {
              return ["image/jpeg", "image/png"].includes(file.type);
            }
            return false;
          }, {
            message: "Invalid file type or size",
          });
          break;
        case "ElementForm":
          schema[f.key] = z.number();
          break;
        default:
      }
    }

    formSchemaRef.current = z.object(schema);
  }, [formFields, selectedForm, form]);

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
      const formData = response.data;
      const responses = formData.response;

      if (responses.length === 0) {
        form.getValues().forEach((key: string) => {
          form.setValue(key, '');
        });
      } else {
        Object.entries(responses).forEach(([key, value]) => {
          if (value !== undefined) {
            form.setValue(key, value);
          }
        });
      }
    })
      .catch(error => {
        console.error(error);
      });
  }, [form, params.asset, params.id, params.instance]);

  const validateForm = (fields: any[]) => {
    let isValid = true;

    fields.forEach(field => {
      if (field.required && !form.getValues()[field.key]) {
        isValid = false;
        setError("Preencha todos os campos obrigatorios.");
      } else {
        setError("");
      }
    });
    return isValid;
  };

  async function onSubmit() {
    const fields = formFields;
    if (validateForm(fields)) {
      let values = { formID: id, response: form.getValues(), object_id: asset, response_type: instance };
      try {
        const response = await api.post(`/form-responses/`, values).then(response => {
          if (response.status === 200) {
            toast.success("Resposta enviada com sucesso.");
          } else {
            toast.error("Erro ao enviar resposta.");
          }
        });
      } catch (error: any) {
        console.error(error);
        toast.error("Erro ao enviar resposta.");
      }
      try {
        let ImageData;
        for (let key in file) {
          ImageData = {
            image: file[key],
            object_id: params.asset,
            response_type: "Asset",
            questionKey: key
          };
        }
        if (ImageData?.object_id !== undefined) {
        const response = await api.post(`/images/`, ImageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        }
      } catch (error: any) {
        console.error(error);
        toast.error("Erro ao enviar imagem.");
      }
    } else {
      setError("Preencha todos os campos obrigatorios.");
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
          <React.Fragment key={f.key}>
            {f.type === "string" && StringField(f)}
            {f.type === "number" && NumberField(f)}
            {f.type === "date" && DateField(f)}
            {f.type === "boolean" && BooleanField(f)}
            {f.style === "radio" && RadioField(f)}
            {f.style === "select" && SelectField(f)}
            {f.style === "combobox" && ComboboxField(f)}
            {f.type === "file" && PhotoField(f)}
            {f.type === "ElementForm" && ElemenetButtonField(f)}
          </React.Fragment>
        ))}
        {error && (
          <Alert className="">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button className="dark:bg-background dark:text-foreground" onClick={() => form.getValues()}>Salvar</Button>
      </form>
      <ToastContainer />
    </Form>
  );

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
                      !field.value ? "text-muted-foreground" : ""
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
    );
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
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>{f.desc}</FormDescription>
            <ImageUploader fileKey={f.key} file={file} params={params} setFile={setFile} />
            <FormMessage />
          </FormItem>
        )}
      />
    );
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
                className={f.required ? "border-red-500 flex flex-col space-y-1" : "flex flex-col space-y-1"}
                required={f.required}
              >
                {f.enumValues?.map((v) => (
                  <div key={v.value} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={v.value} />
                    </FormControl>
                    <FormLabel className="font-normal">{v.label}</FormLabel>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <ImageUploader fileKey={f.key} file={file} params={params} setFile={setFile} />
            <FormDescription>{f.desc}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
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
    );
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
                      !field.value ? "text-muted-foreground" : ""
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
    );
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
    );
  }

  function StringField(f: FF) {
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
              <Input className="hover:cursor-pointer" type="file" id="picture" {...field} required={f.required} onChange={field.onChange} />
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
              <AddElement forms={formsAll} asset={asset} />
            </FormControl>
            <FormDescription>{f.desc}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
}