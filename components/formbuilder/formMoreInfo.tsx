import { ChevronsUpDown, ChevronDown, Trash  } from "lucide-react"
import { cn } from "@/lib/utils"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
  } from "@/components/ui/table"

  import { CommandList } from "cmdk"

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

  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from "@/components/ui/command"

import { Button } from "@/components/ui/button"

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  
  import { Input } from "@/components/ui/input"


export const fieldTypes = [
    "string",
    "number",
    "boolean",
    "date",
    "file",
  ] as const
  
  export type FieldTypes = "string" | "number" | "boolean" | "date" | "file" 

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
  



export function MoreInfo({
    id,
    type,
    idx,
    moreInfo,
    form,
    onfieldchange,
    enumlist,
    setName,
    inputs,
    handleChangeInput,
    handleRemoveInput,
    handleAddInput,
    handleSaveOptions,
    Elementformlist,
    fields,
    update,
  }: {
    id: string
    idx: number
    type: FieldTypes
    moreInfo: any
    form: any
    onfieldchange: any
    enumlist: any
    setName: any,
    inputs: any,
    handleChangeInput: any,
    handleRemoveInput: any,
    handleAddInput: any,
    handleSaveOptions: any,
    Elementformlist: any,
    fields: any,
    update: any,
  }) {


    if (moreInfo.find((s: string) => s === id)) {
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
                                {Elementformlist.map((formlist: { elementName: string; form: any; id: string }) => {
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
       let enumValues = fields[idx].enumValues?.filter((val: { id: string; label: string; value: string }, index: number) => index !== idxx)
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
                  {fields[idx].enumValues?.map((f: { id: string; label: string; value: string }, idxx: number) => (
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
