import React, { useEffect, useState, useRef } from "react";
import { FormField as FF } from "@/schema";
import { useAppStateEditor } from "@/state/stateEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import api from "@/Modules/Auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import { jsPDF } from "jspdf";
import { ChevronsUpDown, Check, CalendarIcon } from "lucide-react";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandList, CommandItem } from "@/components/ui/command";
import "react-toastify/dist/ReactToastify.css";
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

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function handleSelect(form: any, key: string, value: string) {
  form.setValue(key, value);
}

function renderCommandItems(f: FF, form: any) {
  return (f.enumValues ?? []).map((item) => (
    <CommandItem
      value={item.label}
      key={item.value}
      onSelect={() => handleSelect(form, f.key, item.value)}
    >
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          item.value === form.getValues(f.key) ? "opacity-100" : "opacity-0"
        )}
      />
      {item.label}
    </CommandItem>
  ));
}

function ComboboxField(f: FF, form: any) {
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
                  className={cn(
                    "justify-between w-72 dark:bg-background dark:text-foreground",
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
                  <CommandList>{renderCommandItems(f, form)}</CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{f.desc}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function Sender({ params }: { params: { id: any; asset: string; instance: string } }) {
  const { id, asset, instance } = params;
  const { forms, selectedForm } = useAppStateEditor(id);
  const [error, setError] = useState<string>();
  const [file, setFile] = useState<{ [key: string]: File }>({});
  const [user, setUser] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    companyPosition: "",
    CPF: "",
    phone: "",
    birthDate: "",
    profileImage: null as File | null,
  });
  const [userPostData, setUserPostData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    companyPosition: "",
    CPF: "",
    phone: "",
    birthDate: "",
    profileImage: null as File | null,
  });

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
        default:
      }
    }

    formSchemaRef.current = z.object(schema);
  }, [formFields, selectedForm, form]);

  useEffect(() => {
    api.get(`/api/forms/`)
      .then(response => {
        // Handle response if needed
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    try {
      api.get('/api/users/').then(response => {
        const userdale = response.data.filter((userD: any) => userD.id == 2)[0];

        setUser({
          id: userdale.id,
          email: userdale.email,
          firstName: userdale.firstName,
          lastName: userdale.lastName,
          CPF: userdale.CPF,
          phone: userdale.phone,
          birthDate: userdale.birthDate,
          profileImage: null as File | null,
          companyPosition: userdale.companyPosition
        });
        setUserPostData({
          email: userdale.email,
          firstName: userdale.firstName,
          lastName: userdale.lastName,
          CPF: userdale.CPF,
          phone: userdale.phone,
          birthDate: userdale.birthDate,
          profileImage: null as File | null,
          companyPosition: userdale.companyPosition
        });
      });
    } catch (error) {
      console.error('Erro ao buscar sugestões de email:', error);
    }
  }, []);

  useEffect(() => {
    api.get("/api/form-responses/", {
      params: {
        formID: params.id,
        Asset: params.asset,
        content_type: params.instance,
      },
    })
      .then((response) => {
        const formData = response.data?.response || {};
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined) {
            form.setValue(key, value);
          }
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar dados do formulário:", error);
      });
  }, [params.asset, params.id, params.instance, form]);

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

  async function generatePDF(
    responseData: Record<string, any>,
    fileData: Record<string, File>,
    company: string,
    firstName: string,
    lastName: string
  ) {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const fullName = `${firstName} ${lastName}`.trim();
  
    const addHeaderAndFooter = (doc: jsPDF, pageNumber: number, fullName: string, company: string) => {
      doc.setFontSize(16);
      doc.setLineWidth(0.5);
      doc.rect(10, 10, 190, 25);
  
      doc.text("Relatório", 20, 20);
      doc.setFontSize(12);
      doc.text(`Usuário: ${fullName}`, 20, 27);
      doc.text(`Data: ${date}`, 20, 34);
  
      doc.rect(10, 280, 190, 15);
      doc.setFontSize(10);
      doc.text(`Empresa: ${company}`, 20, 290);
      doc.text(`Página ${pageNumber}`, 180, 290);
    };
  
    let y = 50;
    let pageNumber = 1;
  
    addHeaderAndFooter(doc, pageNumber, fullName, company);
  
    // Loop de respostas textuais
    for (const [key, value] of Object.entries(responseData)) {
      const label = formFields.find((f) => f.key === key)?.label || key;
      
      // Se for um arquivo, não imprimir aqui, pois será tratado no loop de imagens
      if (value instanceof File) {
        continue;
      }
  
      if (y > 270) {
        doc.addPage();
        y = 50;
        pageNumber++;
        addHeaderAndFooter(doc, pageNumber, fullName, company);
      }
  
      doc.setFontSize(12);
      doc.text(`${label}: ${value}`, 20, y);
      y += 10;
    }
  
    // Loop para arquivos (imagens)
    for (const [key, file] of Object.entries(fileData)) {
      const label = formFields.find((f) => f.key === key)?.label || key;
  
      if (y > 220) {
        doc.addPage();
        y = 50;
        pageNumber++;
        addHeaderAndFooter(doc, pageNumber, fullName, company);
      }
  
      // Apenas o label sem valor texto, pois a imagem será adicionada em seguida
      doc.text(`${label}:`, 20, y);
      y += 10;
  
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e: ProgressEvent<FileReader>) {
          const image = e.target?.result as string;
          resolve(image);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
  
      const format = file.type === "image/png" ? "PNG" : "JPEG";
      doc.addImage(imageDataUrl, format, 20, y, 50, 50);
      y += 60;
    }
  
    doc.save(`Relatorio_${date}.pdf`);
  }
  
  async function onSubmit() {
    const fields = formFields;
  
    if (validateForm(fields)) {
      const values = {
        formID: id,
        response: form.getValues(),
        object_id: asset,
        response_type: instance,
      };
  
      try {
        const response = await api.post(`/api/form-responses/`, values);
  
        if (response.status === 200) {
          toast.success("Resposta enviada com sucesso.");
  
          const updatedFormResponse = await api.get("/api/form-responses/", {
            params: {
              formID: params.id,
              Asset: params.asset,
              content_type: params.instance,
            },
          });
  
          const updatedResponses = updatedFormResponse.data?.response || {};
  
          if (Object.keys(updatedResponses).length > 0) {
            Object.entries(updatedResponses).forEach(([key, value]) => {
              form.setValue(key, value);
            });
          }
  
          const company = "Minha Empresa";
          // Agora usando os nomes do user
          const firstName = user.firstName;
          const lastName = user.lastName;
          
          await generatePDF(values.response, file, company, firstName, lastName);
        } else {
          toast.error("Erro ao enviar resposta.");
        }
      } catch (error) {
        console.error("Erro ao salvar resposta:", error);
        toast.error("Erro ao enviar resposta.");
      }
    } else {
      setError("Preencha todos os campos obrigatórios.");
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
            {f.type === "string" && StringField(f, form)}
            {f.type === "number" && NumberField(f, form)}
            {f.type === "date" && DateField(f, form)}
            {f.type === "boolean" && BooleanField(f, form)}
            {f.style === "radio" && RadioField(f, form)}
            {f.style === "select" && SelectField(f, form)}
            {f.style === "combobox" && ComboboxField(f, form)}
            {f.type === "file" && PhotoField(f, form, setFile)}
          </React.Fragment>
        ))}
        {error && (
          <Alert className="">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button className="dark:bg-background dark:text-foreground">
          Salvar
        </Button>
      </form>
      <ToastContainer />
    </Form>
  );
}

function SelectField(f: FF, form: any) {
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function RadioField(f: FF, form: any) {
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
          <FormDescription>{f.desc}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function BooleanField(f: FF, form: any) {
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
          <FormDescription>{f.desc}</FormDescription>
        </FormItem>
      )}
    />
  );
}

function DateField(f: FF, form: any) {
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
          <FormDescription>{f.desc}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function NumberField(f: FF, form: any) {
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
          <FormDescription>{f.desc}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function StringField(f: FF, form: any) {
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
          <FormDescription>{f.desc}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function PhotoField(f: FF, form: any, setFile: React.Dispatch<React.SetStateAction<{[key:string]:File}>>) {
  return (
    <FormField
      control={form.control}
      name={f.key}
      render={({ field }) => (
        <FormItem className="flex flex-col rounded-lg border p-4">
          <FormLabel>{f.label}{f.required && <span className="text-red-500">*</span>}</FormLabel>
          <FormControl>
            <Input
              className="hover:cursor-pointer"
              type="file"
              id="picture"
              required={f.required}
              accept="image/png, image/jpeg"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  form.setValue(f.key, selectedFile);
                  setFile(prev => ({ ...prev, [f.key]: selectedFile }));
                }
              }}
            />
          </FormControl>
          <FormDescription>{f.desc}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
