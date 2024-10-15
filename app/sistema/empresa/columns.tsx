// components/usuarios/columns.tsx
"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export type TableContent = {
  email: string;
  registrationDate: string;
  lastConnection: string;
}
export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: "registrationDate",
    header: "Cadastrado em",
    cell: ({ row }) => <div>{row.original.registrationDate}</div>,
  },
  {
    accessorKey: "lastConnection",
    header: "Última conexão",
    cell: ({ row }) => <div>{row.original.lastConnection}</div>,
  },
  {
    id: "actions",
    header: "Ação",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem>Deletar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
