import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { checkDuplicates } from "@/utils/checkDuplicates";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAppState } from "@/state/state";


import api from "@/Modules/Auth";

import { Form as F, formBuilderSchema } from "@/schema";
import { MoreInfo } from "@/components/formbuilder/formMoreInfo";
import { Type } from "@/components/formbuilder/FormType";

import {
  newBooleanField,
  newDateField,
  newEnumField,
  newNumberField,
  newStringField,
  newPhotoField,
  newElementFormField,
} from "@/utils/newField";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useToast } from "@/components/ui/use-toast";

import { ChevronDown, ChevronUp, Trash } from "lucide-react";

export type FieldTypes = "string" | "number" | "boolean" | "date" | "file";

const style: { value: "combobox" | "select" | "radio"; label: string }[] = [
  { value: "combobox", label: "ComboBox" },
  { value: "select", label: "Select" },
  { value: "radio", label: "Radio" },
];

const defaultValues = {
  fields: [{ required: false }],
};

interface FormBuilderEditorProps {
  id: any;
}

export const FormBuilder: React.FC<FormBuilderEditorProps> = ({ id }) => {
  const { control, handleSubmit } = useForm({ defaultValues });
  const { forms, newForm, selectedForm, updateFormFields } =  useAppState(id);
  const { toast } = useToast();
  const form = useForm<F>({
    resolver: zodResolver(formBuilderSchema),
    defaultValues: {
      name: forms[selectedForm]?.name || "",
      fields: forms[selectedForm]?.fields || [],
    },
  });
  form.watch();

  const [moreInfo, setMoreInfo] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [enumlist, setEnumList] = useState([]);
  const [Elementformlist, setElementFormList] = useState([]);
  const [hasChanged, setHasChanged] = useState(false);

  const [inputs, setInputs] = useState([{ id: 1, value: "" }]);
  const [name, setName] = useState("");

  const { fields, append, update, prepend, remove, swap, move, insert } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  useEffect(() => {
    const selectedFormName = forms[selectedForm]?.name || "";
    const selectedFormFields = forms[selectedForm]?.fields || [];

    form.setValue("name", selectedFormName);
    form.setValue("fields", selectedFormFields);
  }, [selectedForm, forms, form]);

  useEffect(() => {
    const fieldsValues = form.getValues("fields");
    updateFormFields(fieldsValues);
  }, [form, updateFormFields]);

  useEffect(() => {
    api.get("/api/dropboxanswers/")
      .then((response) => {
        setEnumList(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [hasChanged]);

  useEffect(() => {
    api.get("/api/elements/")
      .then((response) => {
        setElementFormList(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function onSubmit(values: z.infer<typeof formBuilderSchema>) {
    console.log("values", values);
  }

  function onfieldchange() {
    console.log("mudando o campo");
    updateFormFields(form.getValues("fields"));
  }

  const handleAddInput = () => {
    setInputs([...inputs, { id: inputs.length + 1, value: "" }]);
  };

  const handleRemoveInput = (id: number) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const handleChangeInput = (id: number, newValue: string) => {
    setInputs(inputs.map((input) => (input.id === id ? { ...input, value: newValue } : input)));
  };

  const handleSaveOptions = () => {
    const newSaveOptions = inputs.reduce<{ [key: string]: string }>((acc, { id, value }) => {
      acc[value] = value;
      return acc;
    }, {});

    let postdata = {
      name: name,
      list: newSaveOptions,
    };
    console.log(postdata);

    localStorage.setItem("projectData", JSON.stringify(postdata));

    try {
      api.post("/api/dropboxanswers/", JSON.stringify(postdata), {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 201) {
            setHasChanged(!hasChanged);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  function toggleMoreInfo(id: string) {
    if (moreInfo.find((s) => s === id)) setMoreInfo(moreInfo.filter((s) => s !== id));
    else setMoreInfo(moreInfo.concat([id]));
  }

  return (
    <main className="flex flex-col w-full">
      <Form {...form}>
        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Pergunta</TableHead>
                <TableHead>Tipo de resposta</TableHead>
                <TableHead>*</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, idx) => (
                <TableRow key={field.id}>
                  <TableCell className="p-1">
                    <ChevronUp size={16} className="cursor-pointer" onClick={() => move(idx, idx - 1)} />
                    <ChevronDown size={16} className="cursor-pointer" onClick={() => move(idx, idx + 1)} />
                  </TableCell>
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
                  <TableCell className="p-1">
                    <Type idx={idx} />
                  </TableCell>
                  <TableCell className="p-1">
                    <FormField
                      control={form.control}
                      name={`fields.${idx}.required`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                form.setValue(`fields.${idx}.required`, !!checked);
                                onfieldchange();
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Trash className="cursor-pointer" size={18} onClick={() => { remove(idx); onfieldchange(); }} />
                  </TableCell>
                  <TableCell className="p-1">
                    <ChevronDown className="cursor-pointer" size={25} onClick={() => toggleMoreInfo(field.key)} />
                  </TableCell>
                  {MoreInfo({
                    idx,
                    type: field.type,
                    id: field.key,
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
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </form>
      </Form>
      <div className="flex m-8">
        <Button onClick={() => { append(newStringField()); onfieldchange(); }}>Adicionar pergunta</Button>
      </div>
    </main>
  );
};