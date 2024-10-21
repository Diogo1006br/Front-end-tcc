"use client"


//Imports system
import { useFieldArray, useForm } from "react-hook-form"
import { use, useEffect, useState } from "react"
import { checkDuplicates } from "@/utils/checkDuplicates"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { useAppState } from "@/state/state"
import { CommandList } from "cmdk"
import api from "@/Modules/Auth"


//Imports components
import { Form as F, formBuilderSchema } from "@/schema"

import {
  newBooleanField,
  newDateField,
  newEnumField,
  newNumberField,
  newStringField,
  newPhotoField,
  newElementFormField,
} from "@/utils/newField"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

//Import icons
import { AiOutlineCheck } from "react-icons/ai"
import { ChevronsUpDown, ChevronDown, ChevronUp, Trash  } from "lucide-react"

//Interfaces
export const fieldTypes = [
  "string",
  "number",
  "boolean",
  "date",
  "enum",
  "file",
  "ElementForm",
] as const

export type FieldTypes = "string" | "number" | "boolean" | "date" | "enum" | "file" | "ElementForm"
const types: { value: FieldTypes; label: string }[] = [
  {
    value: "string",
    label: "Texto",
  },
  {
    value: "number",
    label: "Numero",
  },
  {
    value: "boolean",
    label: "Caixa de opção",
  },
  {
    value: "enum",
    label: "Lista",
  },
  {
    value: "date",
    label: "Data",
  },
  {
    value: "file",
    label: "Imagem",
  },
  {
    value: "ElementForm",
    label: "Elemento",
  },
]
const style: { value: "combobox" | "select" | "radio"; label: string }[] = [
  {
    value: "combobox",
    label: "ComboBox",
  },
  {
    value: "select",
    label: "Select",
  },
  {
    value: "radio",
    label: "Radio",
  },
]

const defaultValues = {
  fields: [
    {
      required: false, 
    },
  ],
};

//Functions
export function FormBuilder() {

  //Variables
  const { control, handleSubmit } = useForm({
    defaultValues,
  });
  const { forms, newForm, selectedForm, updateFormFields } = useAppState()
  const { toast } = useToast()
  const form = useForm<F>({
    resolver: zodResolver(formBuilderSchema),
    defaultValues: {
      name: forms[selectedForm]?.name||"",
      fields: forms[selectedForm]?.fields||[],
    },
  })
  form.watch()

  const [moreInfo, setMoreInfo] = useState<string[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [enumlist, setEnumList] = useState([])
  const [Elementformlist, setElementFormList] = useState([])
  const [hasChanged, setHasChanged] = useState(false)

  const [inputs, setInputs] = useState([{ id: 1, value: '' }]);
  const [name, setName] = useState('');

  const { fields, append, update, prepend, remove, swap, move, insert } =
    useFieldArray({
      control: form.control,
      name: "fields",
    })

  //Hooks
  useEffect(() => {
    form.setValue("name", forms[selectedForm].name)
    form.setValue("fields", forms[selectedForm].fields)
  }, [selectedForm])

  useEffect(() => {
    updateFormFields(form.getValues("fields"))
  }, [form.getValues("fields")])

  useEffect(() => {
    // Para fazer uma solicitação GET
    api.get('dropboxanswers/')
    .then(response => {
      setEnumList(response.data);
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }, [hasChanged]);

  useEffect(() => {
    // Para fazer uma solicitação GET
    api.get('elements/')
    .then(response => {
      setElementFormList(response.data);
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);


  //Functions
  function onSubmit(values: z.infer<typeof formBuilderSchema>) {
    console.log("values", values)
  }

  function onfieldchange(){
    console.log("mudando o campo")
    updateFormFields(form.getValues("fields"))
  }

  function showCodeDialog() {
    if (form.getValues("fields").length === 0) {
      toast({
        variant: "destructive",
        title: "Form has 0 Fields",
      })
      return
    }
    const result = checkDuplicates(form.getValues("fields"))
    if (result.hasDuplicates) {
      if (result.duplicates.key.length > 0)
        toast({
          variant: "destructive",
          title: "Duplicate Keys found",
          description: result.duplicates.key.toString(),
        })
      if (result.duplicates.enum.length > 0)
        toast({
          variant: "destructive",
          title: "Duplicate Enum Names found",
          description: result.duplicates.enum.toString(),
        })
    } else {
      setDialogOpen(true)
      // const code = generateCode(form.getValues())
      // setGeneratedCode(code)
    }
  }
  const handleAddInput = () => {
    setInputs([...inputs, { id: inputs.length + 1, value: '' }]);
};

const handleRemoveInput = (id) => {
    setInputs(inputs.filter(input => input.id !== id));
};

const handleChangeInput = (id, newValue) => {
    setInputs(inputs.map(input => input.id === id ? { ...input, value: newValue } : input));
};

const handleSaveOptions = () => {
  const newSaveOptions = inputs.reduce<{ [key: string]: string }>((acc, { id, value }) => {
      acc[value] = value;
      return acc;
  }, {});

  let postdata = {
      name: name,
      list: newSaveOptions,
  }
  console.log(postdata);


  // Salvar no localStorage
  localStorage.setItem('projectData', JSON.stringify(postdata));

  try {
      api.post('dropboxanswers/', JSON.stringify(postdata), {
          headers: {
              'Content-Type': 'application/json',
          },
      }).then(response => {
        //Devido a inviabilidade tecnicas e de tempo provisoriamente fica com o reload. !!!consertar depois
          if (response.status === 201) {
              setHasChanged(!hasChanged)
          }
          // Lidar com a resposta e possíveis erros aqui
      }).catch(error => {
          // Lidar com o erro aqui
      });
  } catch (error) {
      // Lidar com o erro aqui
  }
};


  function printStyle() {
    console.log(types);
  }

  function toggleMoreInfo(id: string) {
    if (moreInfo.find((s) => s === id))
      setMoreInfo(moreInfo.filter((s) => s !== id))
    else setMoreInfo(moreInfo.concat([id]))
  }

  return (
    <main className="flex flex-col w-full">
      <Form {...form}>
        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead> {/* Célula vazia para os ícones */}
                <TableHead>Pergunta</TableHead>
                <TableHead>Tipo de resposta</TableHead>
                <TableHead>*</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                {/* <TableHead>More</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.getValues("fields").map((field, idx) => (
                <>
                  <TableRow key={field.id}>

                    {/* Row up and down */}
                    <TableCell className="p-1">
                      <ChevronUp
                        size={16}
                        className="cursor-pointer"
                        onClick={() => move(idx, idx - 1)}
                      />
                      <ChevronDown
                        size={16}
                        className="cursor-pointer"
                        onClick={() => move(idx, idx + 1)}
                      />
                    </TableCell>

                    {/* Pergunta */}
                    <TableCell className="p-1">
                      <FormField
                        control={form.control}
                        name={`fields.${idx}.label`}
                        render={({ field }) => (
                          <FormItem className="py-1 min-w-36">
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(e) => {
                                  form.setValue(`fields.${idx}.label`, e.target.value);
                                  onfieldchange();
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Tipo de resposta */}
                    <TableCell className="p-1">
                      <Type idx={idx} />
                    </TableCell>

                    {/* Obrigatoria */}
                    <TableCell className="p-1">
                      <FormField
                        control={control}
                        name={`fields.${idx}.required`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Deletar */}
                    <TableCell className="p-1">
                      <Trash
                        className="cursor-pointer"
                        size={18}
                        onClick={() => remove(idx)}
                      />
                    </TableCell>

                    {/* Mais */}
                    <TableCell className="p-1">
                      <ChevronDown
                        className="cursor-pointer"
                        size={25}
                        onClick={() => toggleMoreInfo(field.key)}
                      />
                    </TableCell>
                  </TableRow>
                  {MoreInfo({ idx, type: field.type, id: field.key })}
                </>
              ))}
            </TableBody>
          </Table>
        </form>
      </Form>

      <div className="flex m-8">
        <Button onClick={() => append(newStringField())}>Adicinar pergunta</Button>
      </div>
    </main>
  )

  //More Info
  function MoreInfo({
    id,
    type,
    idx,
  }: {
    id: string
    idx: number
    type: FieldTypes
  }) {
    if (moreInfo.find((s) => s === id)) {
      if (type === "string") {
        return (
          <TableRow className="border-b">
            <td></td>
            <TableCell
              style={{ display: "table-cell" }}
              colSpan={9}
              className="flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name={`fields.${idx}.desc`}
                render={({ field }) => (
                  <FormItem className="py-1">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input className="w-1/2" {...field} 
                      onChange={(e) => {
                        console.log("e", e.target.value)
                        form.setValue(`fields.${idx}.desc`, e.target.value);
                        console.log(form.getValues("fields")[idx].desc)
                        onfieldchange()
                      }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`fields.${idx}.validation.max`}
                  render={({ field }) => (
                    <FormItem className="py-1">
                      <FormLabel>Max</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => {
                        console.log("e", e.target.value)
                        form.setValue(`fields.${idx}.validation.max`, Number(e.target.value));
                        console.log(form.getValues("fields")[idx].placeholder)
                        onfieldchange()}
                        }/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TableCell>
          </TableRow>
        )
      } else if (type === "number") {
        return (
          <TableRow className="border-b">
            <td></td>
            <TableCell
              style={{ display: "table-cell" }}
              colSpan={9}
              className="flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name={`fields.${idx}.desc`}
                render={({ field }) => (
                  <FormItem className="py-1">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input className="w-1/2" {...field}
                      onChange={(e) => {
                        console.log("e", e.target.value)
                        form.setValue(`fields.${idx}.desc`, e.target.value);
                        console.log(form.getValues("fields")[idx].desc)
                        onfieldchange()
                      }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`fields.${idx}.validation.max`}
                  render={({ field }) => (
                    <FormItem className="py-1">
                      <FormLabel>Max</FormLabel>
                      <FormControl>
                        <Input type="number" {...field}onChange={(e) => {
                        console.log("e", e.target.value)
                        form.setValue(`fields.${idx}.validation.max`, Number(e.target.value));
                        console.log(form.getValues("fields")[idx].placeholder)
                        onfieldchange()}
                        }/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TableCell>
          </TableRow>
        )
      } else if (type === "boolean") {
        return (
          <TableRow className="border-b">
            <td></td>
            <TableCell
              style={{ display: "table-cell" }}
              colSpan={9}
              className="flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name={`fields.${idx}.desc`}
                render={({ field }) => (
                  <FormItem className="py-1">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input className="w-1/2" {...field} 
                      onChange={(e) => {
                        console.log("e", e.target.value)
                        form.setValue(`fields.${idx}.desc`, e.target.value);
                        console.log(form.getValues("fields")[idx].desc)
                        onfieldchange()
                      }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TableCell>
          </TableRow>
        )
      } else if (type === "enum") {
        
          // Verifique se o campo já tem um valor antes de definir o valor padrão
          if (!form.getValues(`fields.${idx}.style`)) {
            form.setValue(`fields.${idx}.style`, style[0].value); // Defina o valor padrão aqui
          }
        
        return (
          <TableRow className="border-b">

          <TableCell
            style={{ display: "table-cell" }}
            colSpan={9}
            className=""
          >
            <div className="flex gap-5">
              <div>
              <FormField
                  control={form.control}
                  name={`fields.${idx}.enumName`}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-2 ">
                      <FormControl>
                      <Popover>
                      <PopoverTrigger asChild>

                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? enumlist.find((item) => item.name === field.value)?.name
                              : "Selecione a lista"}
                            <ChevronDown
                              size={22}
                              className="ml-2 h-4 w-4 shrink-0 opacity-50"
                            />
                          </Button>
                        </FormControl>

                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search types..." />
                          <CommandEmpty>No type found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {enumlist.map((list) => (
                                <CommandItem
                                  key={list.name}
                                  value={list.name}
                                  onSelect={() => {
                                    form.setValue(`fields.${idx}.enumName`, list.name);
                                    const entries = Object.entries(list.list);
                                    const enumValues = entries.map(
                                      ([key, value], idxx: number) => ({
                                        id: `${idxx}`,
                                        label: key,
                                        value,
                                      })
                                    );
                                    update(idx, {
                                      ...form.getValues("fields")[idx],
                                      enumValues,
                                    });
                                    onfieldchange();
                                  }}
                                >
                                  {list.name}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                      </FormControl>
                      <FormMessage />
                      <div className="ml-2 bottom-1.5 relative">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button className="">Criar lista</Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Criar nova lista</SheetTitle>
                            <SheetDescription>
                              Crie sua nova lista preenchendo com os dados referente
                            </SheetDescription>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="flex flex-col gap-4">
                              <Input
                                type="text"
                                placeholder="Nome da lista"
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                              />
                              {inputs.map(input => (
                                    <div key={input.id} className="flex w-full max-w-sm items-center space-x-2">
                                        <Input
                                            type="text"
                                            value={input.value}
                                            onChange={(e) => handleChangeInput(input.id, e.target.value)}
                                            placeholder=""
                                        />
                                        <Button type="button" variant="destructive" onClick={() => handleRemoveInput(input.id)}>
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>

                                ))}
                            </div>
                          </div>
                          <div className="container py-10 ml-9">
                          <Button className="mb-2" onClick={handleAddInput}>
                              Adicionar
                          </Button>
                          <Button className="ml-4 mt-2" onClick={handleSaveOptions}>
                              Salvar
                          </Button>
                          </div>
                          <SheetFooter>
                            <SheetClose asChild> </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>
                    </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`fields.${idx}.style`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            {/* Aplicando a classe hidden para esconder o botão */}
                            <Button
                              variant="outline"
                              role="combobox"
                              className="hidden"
                            >
                              {field.value
                                ? style.find((item) => item.value === field.value)?.label
                                : "Selecione o estilo"}
                              <ChevronDown size={22} className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar estilo..." />
                            <CommandEmpty>Nenhum estilo encontrado.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {style.map((item) => (
                                  <CommandItem
                                    key={item.value}
                                    value={item.label}
                                    onSelect={() => {
                                      form.setValue(`fields.${idx}.style`, item.value);
                                    }}
                                  >
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
                  )}
                />

                <FormField
                  control={form.control}
                  name={`fields.${idx}.desc`}
                  render={({ field }) => (
                    <FormItem className="py-1">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input className="w-full" {...field} 
                         onChange={(e) => {
                          console.log("e", e.target.value)
                          form.setValue(`fields.${idx}.desc`, e.target.value);
                          console.log(form.getValues("fields")[idx].desc)
                          onfieldchange()
                        }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                {EnumValues()}
              </div>
            </div>
          </TableCell>
        </TableRow>
        )
      } else if (type === "date") {
        return (
          <TableRow className="border-b">
            <td></td>
            <TableCell
              style={{ display: "table-cell" }}
              colSpan={9}
              className="flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name={`fields.${idx}.desc`}
                render={({ field }) => (
                  <FormItem className="py-1">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input className="w-1/2" {...field} 
                      onChange={(e) => {
                        console.log("e", e.target.value)
                        form.setValue(`fields.${idx}.desc`, e.target.value);
                        console.log(form.getValues("fields")[idx].desc)
                        onfieldchange()
                      }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TableCell>
          </TableRow>
        )
      }
      else if (type === "file") {
        return (
          <TableRow className="border-b">
            <td></td>
            <TableCell
              style={{ display: "table-cell" }}
              colSpan={9}
              className="flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name={`fields.${idx}.desc`}
                render={({ field }) => (
                  <FormItem className="py-1">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input className="w-1/2" {...field} 
                      onChange={(e) => {
                        console.log("e", e.target.value)
                        form.setValue(`fields.${idx}.desc`, e.target.value);
                        console.log(form.getValues("fields")[idx].desc)
                        onfieldchange()
                      }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TableCell>
          </TableRow>
        ) 
      }else if (type === "ElementForm") {
        return (
          <TableRow className="border-b">
            <td></td>
            <TableCell
              style={{ display: "table-cell" }}
              colSpan={9}
              className="flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name={`fields.${idx}.desc`}
                render={({ field }) => (
                  <FormItem className="py-1">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input className="w-1/2" {...field} 
                      onChange={(e) => {
                        console.log("e", e.target.value)
                        form.setValue(`fields.${idx}.desc`, e.target.value);
                        console.log(form.getValues("fields")[idx].desc)
                        onfieldchange()
                      }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
                  <FormField
                    control={form.control}
                    name={`fields.${idx}.enumName`}
                    render={({ field }) => (
                      <FormItem className="py-1">
                        <FormLabel>Elemento a linkar</FormLabel>
                        <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between  flex",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? style.find(
                                      (item) => item.value === field.value
                                    )?.label
                                  : "Select item"}
                                <ChevronsUpDown
                                  size={22}
                                  className="ml-2 h-4 w-4 shrink-0 opacity-50"
                                />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search types..." />
                              <CommandEmpty>No type found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                {Elementformlist.map((formlist) => {
                                    return (
                                      <CommandItem
                                        key={formlist.elementName} // use a chave do dicionário como key
                                        value={formlist.elementName}
                                        onSelect={() => {
                                            form.setValue(`fields.${idx}.form`, formlist.form);
                                            form.setValue(`fields.${idx}.element`, formlist.id);
                                          onfieldchange()
                                        }}
                                      >
                                        {formlist.elementName}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              

            </TableCell>
          </TableRow>
        )
        
      
      }else {
        return <TableRow className="border-b">&nbsp;</TableRow>
      }
    } else return <></>

    function EnumValues() {

      console.log("enumvalues", form.getValues("fields")[idx].enumValues)

      function deleteCurrentEnum(idx:number, idxx:number){
       let enumValues = fields[idx].enumValues?.filter((val, index)=>index!==idxx)
       console.log("enumvalues", enumValues)
       update(idx, {
        ...form.getValues("fields")[idx],
        enumValues,
      })
      }

      return (
        <div className="flex w-1/4 flex-col items-start gap-2">
          <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <Table className="min-w-full border-collapse table-auto p-0 m-0">
                <TableHead className="p-0 m-0">
                  <TableRow className="p-0 m-0">
                    <TableCell className="p-0 m-0 text-left font-semibold border-0 whitespace-nowrap w-auto">
                      Preview da Lista
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="p-0 m-0">
                  {fields[idx].enumValues?.map((f, idxx: number) => (
                    <TableRow key={f.id} className="p-0 m-0 border-0">
                      <TableCell className="p-0 m-0 border-0">{f.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
             </div>
           </div>
          <div className="flex gap-4">
            
          </div>
        </div>
      )
    }
  }


  function Type({ idx }: { idx: number }) {
    return (
      <FormField
        control={form.control}
        name={`fields.${idx}.type`}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn("justify-between",!field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? types.find((item) => item.value === field.value)?.label
                      : "Select item"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search types..." />
                  <CommandEmpty>No type found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {types.map((item) => {
                        return (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue(`fields.${idx}.type`, item.value)
                            }}
                          >
                            <AiOutlineCheck
                              className={cn(
                                "mr-2 h-4 w-4",
                                item.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {item.label}
                          </CommandItem>
                        );
                      })}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }
}