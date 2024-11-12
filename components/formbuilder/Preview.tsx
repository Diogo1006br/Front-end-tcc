"use client"

//Imports systems
import React, { useEffect, useState } from "react"
import { FormField as FF } from "@/schema"
import { useAppState } from "@/state/state"
import { useAppStateEditor } from "@/state/stateEditor"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import api from "@/Modules/Auth"
import { useRouter } from 'next/navigation'

import { ptBR } from 'date-fns/locale';


import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { CommandList } from "cmdk"
import { time } from "console"


//Imports components
import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

//Imports icons
import {
  AlertCircle,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  FileWarning,
  Terminal,
} from "lucide-react"


//Imports types



export function Preview({ id }: { id: any }) {
  const { forms, selectedForm, resetForms } = useAppState(id);
  //Variables
  const [alert, setAlert] = useState({ message: '', type: '' });
  let formFields = forms[selectedForm].fields
  const router = useRouter()
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant: 'default' | 'destructive' } | null>(null);
  let formSchema = z.object({})
  const form = useForm<z.infer<any>>({
    // const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  //Functions
  async function onSubmit(data: any) {
    let values = { ...formFields, name: forms[selectedForm].name };

    if(id !== undefined){
      try {
        const response = await api.put(`/forms/${id}/`, values);
        resetForms();
        if (response.status === 200) {
          setToastMessage({ title: 'Sucesso', description: 'Formulário criado com sucesso.', variant: 'default' });
          setTimeout(() => {
            router.push('/sistema/formularios/');
          }, 1000);
        } else {
          setToastMessage({ title: 'Erro', description: 'Erro ao criar formulário.', variant: 'destructive' });
        }
      } catch (error) {
        console.error(error);
        setToastMessage({ title: 'Erro', description: 'Erro ao criar formulário.', variant: 'destructive' });
      }
    }else{
      try {
        const response = await api.post('/forms/', values);
        console.log(values);
        console.log(response.data);
        resetForms()
        if (response.status === 201) {
          setToastMessage({ title: 'Sucesso', description: 'Formulario editado com sucesso.', variant: 'default' });
          console.log("alertaaa",alert.message);
          setTimeout(() => {
            router.push('/sistema/formularios/');
          }, 1000);
        } else {
          setToastMessage({ title: 'Erro', description: 'Erro ao editar o formulario.', variant: 'destructive' });
        }
      } catch (error) {
        console.error(error);
        if ((error as any).response) {
            // O servidor retornou uma resposta que não é 2xx
            console.log((error as any).response.data);
            console.log((error as any).response.status);
            console.log((error as any).response.headers);
        } else if ((error as any).request) {
            // A requisição foi feita, mas não houve resposta
            console.log((error as any).request);
        } else {
            // Algo aconteceu na configuração da requisição que disparou um erro
            console.log('Error', (error as any).message);
        }
      }

    }
  }

  //Hooks
  useEffect(() => {
    const schema: Record<string, any> = {};
    for (let f of formFields) {
      switch (f.type) {
        case "string":
          if (f.validation?.format === "email") {
            schema[f.key] = z
              .string()
              .email({ message: 'Email inválido' })
              .min(1, { message: 'Campo obrigatório' })
              .max(f.validation?.max || 9999999999, { message: `Valor máximo é ${f.validation?.max}` });
          } else {
            schema[f.key] = z
              .string()
              .min(1, { message: 'Campo obrigatório' })
              .max(f.validation?.max || 9999999999, { message: `Valor máximo é ${f.validation?.max}` });
          }
          break;
        case "number":
          schema[f.key] = z
            .coerce.number()
            .min(f.validation?.min || 1, { message: `Valor mínimo é ${f.validation?.min}` })
            .max(f.validation?.max || 9999999999, { message: `Valor máximo é ${f.validation?.max}` });
          break;
        case "boolean":
          schema[f.key] = z.boolean();
          break;
        case "date":
          schema[f.key] = z.date().refine(date => !isNaN(date.getTime()), { message: 'Data inválida' });
          break;
        case "enum":
          schema[f.key] = z.string().min(1, { message: 'Campo obrigatório' });
          break;
        case "file":
          schema[f.key] = z
            .any()
            .refine(file => file instanceof File && ["image/jpeg", "image/png"].includes(file.type), {
              message: "Tipo de arquivo inválido",
            });
          break;
        case "ElementForm":
          schema[f.key] = z.number();
          break;
        default:
          break;
      }
    }
    
    // Atualizar o esquema do formulário com o novo schema
    const newFormSchema = z.object(schema);
    form.reset(newFormSchema);
  }, [formFields, selectedForm , form]);
  


  
  return (
    <main>
    <ToastProvider>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          {formFields.map((f) => (
            <React.Fragment key={f.key}>  {/* Adicionando a 'key' */}
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
          <Button onClick={() => form.getValues()}>Salvar</Button>

          {alert.message && (
            <div className={`alert ${alert.type}`}>
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{alert.type}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            </div>
          )}
        </form>
      </Form>
      <ToastViewport/>
      {toastMessage && (
        <Toast variant={toastMessage.variant} open={!!toastMessage} onOpenChange={() => setToastMessage(null)}>
          <ToastTitle>{toastMessage.title}</ToastTitle>
          <ToastDescription>{toastMessage.description}</ToastDescription>
          <ToastClose />
        </Toast>
      )}
    </ToastProvider>
  </main>
  )

  //ComboboxField
  function ComboboxField(f: FF) {
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <Card className="p-2">
            <FormItem className="flex flex-col rounded-lg border p-4">
              <FormLabel>{f.label}</FormLabel>
              <FormDescription>{f.desc}</FormDescription>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn("w-80 justify-between", !field.value && "text-muted-foreground")}>
                      {field.value
                        ? f.enumValues?.find((item) => item.value === field.value)?.label
                        : "Selecionar um item"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder={`Buscar ${f.enumName}...`} />
                    <CommandEmpty>No {f.enumName} found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {f.enumValues?.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value} 
                            onSelect={() => {
                              form.setValue(f.key, item.value)
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
              <FormMessage />
            </FormItem>
          </Card>
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
            <FormLabel>{f.label}</FormLabel>
            <FormDescription>{f.desc}</FormDescription>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {f.enumValues?.map((v) => (
                  <SelectItem key={v.value} value={v.value}>  {/* Adicionando 'key' */}
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <FormLabel>{f.label}</FormLabel>
            <FormDescription>{f.desc}</FormDescription>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                {f.enumValues?.map((v) => (
                  <FormItem key={v.value} className="flex items-center space-x-3 space-y-0">  {/* Adicionando 'key' */}
                    <FormControl>
                      <RadioGroupItem value={v.value} />
                    </FormControl>
                    <FormLabel className="font-normal">{v.label}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  //BooleanField
  function BooleanField(f: FF) {
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{f.label}</FormLabel>
              <FormDescription>{f.desc}</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    )
  }

  //DateField
  function DateField(f: FF) {
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-lg border p-4">
            <FormLabel>{f.label}</FormLabel>
            <FormDescription>{f.desc}</FormDescription>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecionar data</span>
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
                  // disabled={(date) =>
                  //   date > new Date() || date < new Date("1900-01-01")
                  // }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  //NumberField
  function NumberField(f: FF) {
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="rounded-lg border p-4">
            <FormLabel>{f.label}</FormLabel>
            <FormDescription>{f.desc}</FormDescription>
            <FormControl>
              <Input type="number" placeholder={f.placeholder} {...field} max={Number(f.validation?.max)} min={Number(f.validation?.min)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  //StringField
  function StringField(f: FF) {
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="rounded-lg border p-4">
            <FormLabel>{f.label}</FormLabel>
            <FormDescription>{f.desc}</FormDescription>
            <FormControl>
              {f.validation?.format === "email" ? (
                <Input type="email" placeholder={f.placeholder} {...field} />
              ) : (

                <Input placeholder={f.placeholder} {...field} max={Number(f.validation?.max)} min={Number(f.validation?.min)} maxLength={Number(f.validation?.max)} minLength={Number(f.validation?.min)}/>
              )}
            </FormControl>
            
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  //PhotoField
  function PhotoField(f: FF) {
    return (
       <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="rounded-lg border p-4">
            <FormLabel>{f.label}</FormLabel>
            <FormDescription>{f.desc}</FormDescription>
            <FormControl>
              <Input type="file" id="picture" {...field}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  //ElementButtonField
  function ElemenetButtonField(f: FF) {
    return (
      <FormField
        control={form.control}
        name={f.key}
        render={({ field }) => (
          <FormItem className="rounded-lg border p-4">
            <FormLabel>{f.label}</FormLabel>
            <FormControl>
              <Link href={`/sistema/subitem/${f.element}/${f.form}`}>
              <FormDescription>{f.desc}</FormDescription>
                <Button>Formulário do Elemento</Button>
              </Link>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

}




