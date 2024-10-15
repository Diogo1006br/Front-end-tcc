"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ConfirmDeleteDialog from "@/components/ui/modal";
import api from "@/Modules/Auth";

export type TableContent = {
  email: string;
  company: string;
  registrationDate: string;
  lastConnection: string;
};

export const columns: ColumnDef<TableContent>[] = [
  {
    accessorKey: "email",
    header: () => <div className="text-left">Usuário</div>,
    cell: ({ row }) => {
      const { email } = row.original;
      return <div>{email}</div>;
    },
  },
  {
    accessorKey: "company",
    header: () => <div className="text-left">Empresa</div>,
    cell: ({ row }) => {
      const { company } = row.original;
      return <div>{company}</div>;
    },
  },
  {
    accessorKey: "registrationDate",
    header: () => <div className="text-left">Cadastrado em</div>,
    cell: ({ row }) => {
      const { registrationDate } = row.original;
      return <div>{registrationDate}</div>;
    },
  },
  {
    accessorKey: "lastConnection",
    header: () => <div className="text-left">Última conexão</div>,
    cell: ({ row }) => {
      const { lastConnection } = row.original;
      return <div>{lastConnection}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-left">Ação</div>,
    cell: ({ row }) => {

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem >Deletar</DropdownMenuItem>
            <DropdownMenuItem >Configuracoes</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
