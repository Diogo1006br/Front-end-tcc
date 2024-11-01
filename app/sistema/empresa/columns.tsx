"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import api from "@/Modules/Auth";
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport } from "@/components/ui/toast";

// Tipos
export type TableContent = {
  id: string;
  email: string;
  registrationDate: string;
  lastConnection: string;
};

interface User {
  email: string;
  firstName: string;
  lastName: string;
  companyPosition: string;
}

// Criando um componente separado para a célula que usa os hooks
const CellActionComponent: React.FC<{ row: any }> = ({ row }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant: 'default' | 'destructive' } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const TableContent = row.original;
  const [userPostData, setUserPostData] = useState<User>({
    email: '',
    firstName: '',
    lastName: '',
    companyPosition: ''
  });
  const [hasUserAdd, setHasUserAdd] = useState(false);

  useEffect(() => {
    console.log("TableContent", TableContent.id);
    try {
      api.get(`users/${TableContent.id}/`).then(response => setUserPostData(response.data));
      console.log("Estrutura", userPostData);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  }, [ TableContent.id, userPostData]);

  useEffect(() => {
    if (toastMessage) {
      setShowToast(true);
    }
  }, [toastMessage ,]);

  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const handlePostUser = () => {
    api.put(`users/${TableContent.id}/`, userPostData)
      .then((response) => {
        if (response.status === 201) {
          setToastMessage({ title: 'Sucesso', description: 'Usuário criado com sucesso.', variant: 'default' });
          setHasUserAdd(!hasUserAdd);
        } else {
          setToastMessage({ title: 'Erro', description: 'Erro ao criar o usuário.', variant: 'destructive' });
        }
      })
      .catch((error) => {
        setToastMessage({ title: 'Erro', description: 'Erro ao criar o usuário.', variant: 'destructive' });
      });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleOpenSheet}>Editar</DropdownMenuItem>
          <DropdownMenuItem>Deletar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Editar Membro</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="text"
                placeholder="Digite o email do membro"
                value={userPostData.email}
                onChange={(e) => setUserPostData({ ...userPostData, email: e.target.value })}
              />
              <label className="block text-sm font-medium text-gray-700">Primeiro Nome</label>
              <Input
                type="text"
                placeholder="Digite o primeiro nome do membro"
                value={userPostData.firstName}
                onChange={(e) => setUserPostData({ ...userPostData, firstName: e.target.value })}
              />
              <label className="block text-sm font-medium text-gray-700">Sobrenome</label>
              <Input
                type="text"
                placeholder="Digite o sobrenome do membro"
                value={userPostData.lastName}
                onChange={(e) => setUserPostData({ ...userPostData, lastName: e.target.value })}
              />
              <label className="block text-sm font-medium text-gray-700">Cargo</label>
              <Input
                type="text"
                placeholder="Digite o cargo do membro"
                value={userPostData.companyPosition}
                onChange={(e) => setUserPostData({ ...userPostData, companyPosition: e.target.value })}
              />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={handleCloseSheet}>
              Cancelar
            </Button>
            <Button onClick={handlePostUser}>Salvar</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {showToast && toastMessage && (
        <Toast onOpenChange={setShowToast} variant={toastMessage.variant}>
          <ToastTitle>{toastMessage.title}</ToastTitle>
          <ToastDescription>{toastMessage.description}</ToastDescription>
          <ToastClose />
        </Toast>
      )}
      <ToastViewport />
    </>
  );
};

// Definição das colunas com o uso do componente personalizado para a célula de ação
export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "Email",
    accessorFn: (row) => row.name,
    header: () => <div className="text-left">Email</div>,
    cell: ({ row }) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: "Cadastrado em",
    accessorFn: (row) => row.name,
    header: () => <div className="text-left">Cadastrado em</div>,
    cell: ({ row }) => <div>{row.original.registrationDate}</div>,
  },
  {
    accessorKey: "Última conexão",
    accessorFn: (row) => row.name,
    header: () => <div className="text-left">Última conexão</div>,
    cell: ({ row }) => <div>{row.original.lastConnection}</div>,
  },
  {
    accessorKey: "Ação",
    accessorFn: (row) => row.name,
    header: () => <div className="text-left">Ação</div>,
    cell: ({ row }) => <CellActionComponent row={row} />, // Usando o novo componente para a célula de ação
  },
];
