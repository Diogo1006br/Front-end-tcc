"use client";

//import systems
import { useState } from 'react';
import api from "@/Modules/Auth";

//Importing components
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

interface AddElementProps {
    forms: any[];
    asset: any;
}
interface NewElementFormData {
    elementName: string;
    form: string;
    asset: string;
}
export default function AddElement({ forms, asset }: AddElementProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [NewElementFormData, setNewElementFormData] = useState<NewElementFormData>({} as NewElementFormData);
    const [showToast, setShowToast] = useState(false);
    const [haschanged, setHasChanged] = useState(false);

    const [toastContent, setToastContent] = useState({
        title: '',
        description: '',
        variant: 'default', // Ou outro valor padrão que você quiser
      });

    const handleSelectForm = (value:any) => {
      console.log('value:',value);
      setNewElementFormData({ ...NewElementFormData, form: value });
    };

    const handleSubmitElements = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!NewElementFormData.elementName || !NewElementFormData.form) {
          setToastContent({
            title: "Erro",
            description: "Preencha todos os campos.",
            variant: "destructive",
          });
          setShowToast(true);
          return;
        }
    
        try {
          console.log('asset:',asset);
          const formDataWithAsset = { ...NewElementFormData, asset: asset };
          console.log('NewElementFormData:',formDataWithAsset);
          await api.post('elements/', formDataWithAsset, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setToastContent({
            title: "Sucesso",
            description: "Sub-item adicionado com sucesso.",
            variant: "default",
          });
          setShowToast(true);
          setHasChanged(!haschanged);
          setIsOpen(false);
          window.location.reload(); // Fecha o Sheet após o sucesso
        } catch (error) {
          console.error(error);
          setToastContent({
            title: "Erro",
            description: "Ocorreu um erro ao adicionar o sub-item.",
            variant: "destructive",
          });
          setShowToast(true);
        }
      };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant={'outline'} className="mb-2 mr-8 flex mt-4 dark:bg-background dark:text-foreground" onClick={() => setIsOpen(true)}>
                    Adicionar Sub-item
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Criar novo Sub-item</SheetTitle>
                    <SheetDescription>
                        Crie seu novo Sub-item preenchendo um nome
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            type="text"
                            value={NewElementFormData.elementName}
                            onChange={(e) => setNewElementFormData({ ...NewElementFormData, elementName: e.target.value })}
                            placeholder="Nome do sub-item"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Select onValueChange={handleSelectForm}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecione um item" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Formulários</SelectLabel>
                                    {forms && forms.length > 0 ? (
                                        forms.map((form) => (
                                            <SelectItem key={form.id} value={form.id}>
                                                {form.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value='1' disabled>Nenhum formulário disponível</SelectItem>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <SheetFooter>
                    <Button type="submit" className="items-start flex" onClick={handleSubmitElements}>
                        Adicionar
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
