import { useFormContext } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from "@/components/ui/command"

  import { CommandList } from "cmdk"

  import { ChevronDown } from "lucide-react"
  import { cn } from "@/lib/utils"
  import { AiOutlineCheck } from "react-icons/ai"

  export const fieldTypes = [
    "string",
    "number",
    "boolean",
    "date",
    "file",
    ] as const
    
export type FieldTypes = "string" | "number" | "boolean" | "date" |  "file";

export function Type({ idx }: { idx: number }) {
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
        value: "date",
        label: "Data",
    },
    {
        value: "file",
        label: "Imagem",
    },
    ]
    const form = useFormContext();
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
                      : "Select type"}
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