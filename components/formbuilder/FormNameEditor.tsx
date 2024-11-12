import React, { useEffect, useState } from "react";
import { useAppStateEditor } from "@/state/stateEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BsPencil } from "react-icons/bs";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const editNameSchema = z.object({
  name: z.string(),
});

export function FormNameEditor({ id, onToggleOverlay }) {
  const { forms, selectedForm, updateFormName , fetchforms } = useAppStateEditor(id);
  const [editName, setEditName] = useState(false);


  fetchforms(id)

  function toggleEdit() {
    setEditName(!editName);
    onToggleOverlay && onToggleOverlay(!editName); 
  }

  const form = useForm<z.infer<typeof editNameSchema>>({
    resolver: zodResolver(editNameSchema),
  });

  useEffect(() => {
    if (forms) {
      form.setValue("name", forms[selectedForm].name);
    }
  }, [selectedForm]);

  function onSubmit(values: z.infer<typeof editNameSchema>) {
    toggleEdit();
    updateFormName(values.name);
  }

  if (editName) {
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 rounded-md">
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="focus:outline-none focus:ring-0 focus:border-transparent"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button size="sm" className="h-9 w-16" type="submit">
                  Salvar
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </>
    );
  } else
    return (
      <>
        <div className="flex flex-col">
          <h3 className="flex items-center gap-1 text-2xl font-semibold tracking-tight">
            {forms && forms[selectedForm].name}
            <BsPencil
              onClick={toggleEdit}
              className="mb-1 ml-1 cursor-pointer"
              size={22}
            />
          </h3>
          <p className="text-lg text-blue-400">
            {forms && forms[selectedForm].fields.length} Campos
          </p>
        </div>
      </>
    );
}
