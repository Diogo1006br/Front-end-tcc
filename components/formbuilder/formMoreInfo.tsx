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
    setName,
    inputs,
    handleChangeInput,
    handleRemoveInput,
    handleAddInput,
    handleSaveOptions,
    fields,
    update,
  }: {
    id: string
    idx: number
    type: FieldTypes
    moreInfo: any
    form: any
    onfieldchange: any
    setName: any,
    inputs: any,
    handleChangeInput: any,
    handleRemoveInput: any,
    handleAddInput: any,
    handleSaveOptions: any,
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
      } else {
        return <TableRow className="border-b">&nbsp;</TableRow>
      }
    } else return <></>
  }
