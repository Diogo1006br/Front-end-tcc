"use client"
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import Link from "next/link";
import api from "@/Modules/Auth";
import ConfirmDeleteDialog from "@/components/ui/modal"; // Importando o dialog

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
export type TableContent = {
  id: string;
  assetName: string;
  form_name: string;
  form: string;
  status: "Active" | "Archived";
};

// Novo componente para a célula de Ações
const ActionCell = ({ row, hasChanged, setHasChanged }: { row: any, hasChanged: boolean, setHasChanged: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const TableContent = row.original;
  const ativo_id = TableContent.id;
  const NewStatusFiled = { status: "Arquivado" };
  const NewStatusActive = { status: "Ativo" };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState<null | ((projectName: string) => void)>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleArquivarClick = async () => {
    try {
      await api.post(`/api/change_asset_status/${ativo_id}/`, NewStatusFiled, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setHasChanged(!hasChanged);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (projectName: string) => {
    setConfirmCallback(() => async (inputProjectName: string) => {
      if (inputProjectName !== projectName) {
        setErrorMessage("Nome do projeto incorreto.");
        return;
      }

      try {
        await api.delete(`/api/assets/${ativo_id}`, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setHasChanged(!hasChanged);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    });
    setIsDialogOpen(true);
    setErrorMessage("");
  };

  const handleAtivoClick = async () => {
    try {
      await api.post(`/api/change_asset_status/${ativo_id}/`, NewStatusActive, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setHasChanged(!hasChanged);
    } catch (error) {
      console.error(error);
    }
  };

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
        {TableContent.status !== "Arquivado" && (
          <DropdownMenuItem onClick={handleArquivarClick}>Arquivar</DropdownMenuItem>
        )}
        {TableContent.status !== "Ativo" && (
          <DropdownMenuItem onClick={handleAtivoClick}>Ativo</DropdownMenuItem>
        )}
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
  );
};

export const createColumns = ({ hasChanged, setHasChanged }: { hasChanged: boolean, setHasChanged: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const columns: ColumnDef<TableContent>[] = [
    {
      accessorKey: "Nome do ativo",
      accessorFn: (row) => `${row.assetName}`,
      header: () => <div className="text-left">Nome</div>,
      cell: ({ row }) => {
        const TableContent = row.original;

        return (
          <Link href={`/sistema/ativos/${TableContent.id}`}>
            <div className="cursor-pointer">{TableContent.assetName}</div>
          </Link>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => {
        const TableContent = row.original;

        return (
          <Link href={`/sistema/ativos/${TableContent.id}`}>
            <div className="cursor-pointer">{TableContent.status}</div>
          </Link>
        );
      },
    },
    {
      accessorKey: "formulario",
      accessorFn: (row) => `${row.form_name}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="formulario" />
      ),
      cell: ({ row }) => {
        const TableContent = row.original;

        return (
          <Link href={`/sistema/ativos/${TableContent.id}`}>
            <div className="cursor-pointer">{TableContent.form_name}</div>
          </Link>
        );
      },
    },
    {
      id: "Ações",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ações" />
      ),
      cell: ({ row }) => <ActionCell row={row} hasChanged={hasChanged} setHasChanged={setHasChanged} />,
    },
  ];
  return columns;
};
