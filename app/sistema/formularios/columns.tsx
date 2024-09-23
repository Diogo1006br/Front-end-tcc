"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
// import api from "@/Modules/Auth"
import { MoreHorizontal } from "lucide-react"
// import ConfirmDeleteDialog from "@/components/ui/modal";
import { useState } from "react";


// Define o tipo dos dados da tabela
export type TableContent = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  company: string;
  status: "Active" | "Archived";
};

// Componente para tornar a linha clicável
const ClickableRow = ({ form_id, children }: { form_id: string; children: React.ReactNode }) => (
  <Link href={`/sistema/formularios/FormEdit/${form_id}`} passHref>
    <div className="cursor-pointe">
      {children}
    </div>
  </Link>
);

export const columns: ColumnDef<TableContent>[] = [
  {
    accessorKey: "id",

    header: () => <div className="text-left">ID</div>,
    cell: ({ row }) => {
      const TableContent = row.original;
      return (
        <ClickableRow form_id={TableContent.id}>
          <div className="py-2 px-4">{TableContent.id}</div>
        </ClickableRow>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      const TableContent = row.original;
      return (
        <ClickableRow form_id={TableContent.id}>
          <div className="py-2 px-4">{TableContent.name}</div>
        </ClickableRow>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      const TableContent = row.original;
      return (
        <ClickableRow form_id={TableContent.id}>
          <div className="py-2 px-4">{TableContent.status}</div>
        </ClickableRow>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at")).toLocaleDateString();
      return (
        <ClickableRow form_id={row.original.id}>
          <div className="py-2 px-4 text-left">{date}</div>
        </ClickableRow>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modificado em" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("updated_at")).toLocaleDateString();
      return (
        <ClickableRow form_id={row.original.id}>
          <div className="py-2 px-4 text-left">{date}</div>
        </ClickableRow>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ações" />
    ),
    cell: ({ row }) => {
      // const TableContent = row.original;
      // const form_id = TableContent.id;
      // const NewStatusFiled = { status: "Arquivado" };
      // const NewStatusActive = { status: "Ativo" };


      // const [isDialogOpen, setIsDialogOpen] = useState(false);
      // const [confirmCallback, setConfirmCallback] = useState<null | ((projectName: string) => void)>(null);
      // const [errorMessage, setErrorMessage] = useState("");

      // const handleArquivarClick = async () => {
      //   try {
      //     await api.post(`change_form_status/${form_id}/`, NewStatusFiled, {
      //       headers: {
      //         'Content-Type': 'multipart/form-data',
      //       },
      //     });
      //     window.location.reload(); // Recarregar a página após a atualização

      //   } catch (error) {
      //     console.error(error);
      //   }
      // };

      // const handleAtivoClick = async () => {
      //   try {
      //     await api.post(`change_form_status/${form_id}/`, NewStatusActive, {

      //       headers: {
      //         'Content-Type': 'multipart/form-data',
      //       },
      //     });
      //     window.location.reload(); // Recarregar a página após a atualização

      //   } catch (error) {
      //     console.error(error);
      //   }
      // };

      // const handleDelete = (name: string) => {
      //   setConfirmCallback(() => async (inputName) => {
      //     if (inputName !== name) {
      //       setErrorMessage("Nome do projeto incorreto.");
      //       return;
      //     }

      //     try {
      //       const response = await api.delete(`/forms/${form_id}`, {
      //         headers: {
      //           'Content-Type': 'multipart/form-data',
      //         },
      //       });

      //       console.log(response.data);
            
      //       window.location.reload();
      //     } catch (error: any) {
      //       if (error.response){
      //         if (error.response.status === 400) {
      //           setErrorMessage("Formulário está sendo utilizado, nao pode ser deletado.");
      //           return;
      //         } else { 
      //           setErrorMessage("Erro ao deletar o formulário.");
      //         }
      //       } else if (error.request) {
      //         setErrorMessage("Erro ao deletar o formulário.");
      //       } else { 
      //         setErrorMessage("Erro ao deletar o formulário.");
      //       }
      //     }
      //   });
      //   setIsDialogOpen(true);
      //   setErrorMessage("");

      // };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            <DropdownMenuItem >Deletar</DropdownMenuItem>

              <DropdownMenuItem >Arquivar</DropdownMenuItem>
              <DropdownMenuItem >Ativo</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
