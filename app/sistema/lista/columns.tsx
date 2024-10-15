"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast'; 
import { Button } from "@/components/ui/button"
import ConfirmDeleteDialog from "@/components/ui/modal";
import api from "@/Modules/Auth";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"; // Importe o Sheet
import { Input } from "@/components/ui/input"; // Importe o componente de input
import { Label } from "@/components/ui/label"; // Importe o componente de label

export type TableContent = {
  id: string
  name: string 
  company: string
  list: {}
}

export const columns: ColumnDef<TableContent>[] = [
  {
    accessorKey: "Nome",
    accessorFn: (row) => row.name,
    header: () => <div className="text-left">Nome</div>,
    cell: ({ row }) => {
      const TableContent = row.original

      return (
        <Link href={`/sistema/lista/${TableContent.id}`}>
          <div className="cursor-pointer">{TableContent.name}</div>
        </Link>
      )
    },
  },
  {
    accessorKey: "Empresa",
    accessorFn: (row) => row.company,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Empresa" />
    ),
    cell: ({ row }) => {
      const TableContent = row.original

      return (
        <Link href={`/sistema/lista/${TableContent.id}`}>
          <div className="cursor-pointer">{TableContent.company}</div>
        </Link>
      )
    },
  },
  {
    id: "Ações",
    accessorFn: (row) => row.actions,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ações" />
    ),
    cell: ({ row }) => {
      const TableContent = row.original
      const [toastMessage, setToastMessage] = useState(null);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [newListFormData, setNewListFormData] = useState({
        listName: `${TableContent.name}`,
        items: Object.entries(TableContent.list).map(([key, value], index) => ({
          id: Date.now() + index, // ID único para cada item
          number: index + 1, // Um número sequencial para o campo "number"
          description: `${key}`, // A chave e o valor concatenados na descrição
        })),
      });
      const [isSheetOpen, setIsSheetOpen] = useState(false); // Estado para o Sheet
      const [confirmCallback, setConfirmCallback] = useState<null | ((projectName: string) => void)>(null);
      const [errorMessage, setErrorMessage] = useState("");
      const [formData, setFormData] = useState({
        name: TableContent.name,
        company: TableContent.company
      }); // Estado para os inputs
      const handleAddItem = () => {
        const newItemNumber = newListFormData.items.length + 1;
        setNewListFormData({
          ...newListFormData,
          items: [...newListFormData.items, { id: Date.now(), number: newItemNumber, description: '' }],
        });
      };
    
      const handleItemChange = (id, value) => {
        const updatedItems = newListFormData.items.map(item => 
          item.id === id ? { ...item, description: value } : item
        );
        setNewListFormData({ ...newListFormData, items: updatedItems });
      };
    
      const handleRemoveItem = (id) => {
        const updatedItems = newListFormData.items.filter(item => item.id !== id);
        const reindexedItems = updatedItems.map((item, index) => ({
          ...item,
          number: index + 1,
        }));
        setNewListFormData({ ...newListFormData, items: reindexedItems });
      };
    
      const handleSaveOptions = async () => {
        const postData = {
          name: newListFormData.listName,
          list: newListFormData.items.reduce((acc, item) => {
            acc[item.description] = item.description;
            return acc;
          }, {}),
        };
    
        // Salvar no localStorage
        localStorage.setItem('projectData', JSON.stringify(postData));
    
        try {
          const response = await api.put(`/dropboxanswers/${dropboxlist_id}/`, JSON.stringify(postData), {
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.status === 200) {
            setToastMessage({
              variant: 'success',
              title: 'Lista criada!',
              description: 'A nova lista foi salva com sucesso.',
            }); // Atualiza o estado para refletir que a lista foi alterada
            setIsSheetOpen(false); // Fecha a folha
          } else {
            setToastMessage({
              variant: 'destructive',
              title: 'Erro!',
              description: 'Não foi possível salvar a lista.',
            });
          }
        } catch (error) {
          console.error('Erro ao fazer a requisição:', error);
          setToastMessage({
            variant: 'destructive',
            title: 'Erro!',
            description: 'Ocorreu um erro ao salvar a lista.',
          });
        }
      };

      const dropboxlist_id = TableContent.id
      const handleDelete = (name: string) => {
        setConfirmCallback(() => async (inputName) => {
          if (inputName !== name) {
            setErrorMessage("Nome do projeto incorreto.");
            return;
          }

          try {
            await api.delete(`/dropboxanswers/${dropboxlist_id}`, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            window.location.reload(); // Recarregar a página após a exclusão
          } catch (error) {
            console.error(error);
          }
        });
        setIsDialogOpen(true);
        setErrorMessage("");
      };

      const handleEdit = () => {
        setIsSheetOpen(true); // Abre o Sheet ao clicar em Editar
      };

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
      };

      return (
        <>
         <ToastProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem> {/* Chama handleEdit */}
              <DropdownMenuItem onClick={() => handleDelete(TableContent.name)}>Deletar</DropdownMenuItem>
            </DropdownMenuContent>
            <ConfirmDeleteDialog
              isOpen={isDialogOpen}
              errorMessage={errorMessage}
              onClose={() => {
                setIsDialogOpen(false);
                setErrorMessage("");
              }}
              onConfirm={(projectName) => {
                if (confirmCallback) confirmCallback(projectName);
              }}
            />
          </DropdownMenu>

          {/* Componente Sheet */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
        </SheetTrigger>
        <SheetContent className="bg-white text-black dark:text-white">
          <form onSubmit={(e) => { e.preventDefault(); handleSaveOptions(); }}>
            <SheetHeader>
              <SheetTitle>Criar nova lista</SheetTitle>
              <SheetDescription>
                Crie sua nova lista preenchendo com os dados referentes
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  type="text"
                  value={newListFormData.listName}
                  onChange={(e) => setNewListFormData({ ...newListFormData, listName: e.target.value })}
                  placeholder="Nome da lista"
                  className="col-span-4 bg-gray-200 text-black"
                  required
                />
              </div>
              {newListFormData.items.map((item) => (
                <div key={item.id} className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, e.target.value)}
                    placeholder={`Item ${item.number}`}
                    className="bg-gray-200 text-black"
                    required
                  />
                  <Button type="button" variant="destructive" onClick={() => handleRemoveItem(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="container py-10 ml-9">
                <Button className="mb-2" type="button" onClick={handleAddItem}>
                  Adicionar Item
                </Button>
                <Button className="ml-4 mt-2" onClick={handleSaveOptions}>
            Salvar
            </Button>
              </div>
            </div>
            
          </form>
          {toastMessage && (
            <Toast className={toastMessage.variant === 'destructive' ? 'bg-red-600' : 'bg-green-600'}>
              <ToastTitle>{toastMessage.title}</ToastTitle>
              <ToastDescription>{toastMessage.description}</ToastDescription>
              <ToastClose />
            </Toast>
          )}
        </SheetContent>
          </Sheet>
          <ToastViewport />
          </ToastProvider>
        </>
      )
    },
  },
]
