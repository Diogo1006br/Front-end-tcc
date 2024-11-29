"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import api from "@/Modules/Auth";
import ConfirmDeleteDialog from "@/components/ui/modal";

export type TableContent = {
  id: string;
  elementName: string;
  form: string;
  status: "Active" | "Archived";
};

const RowLink = ({ element_id, form_id, children }: { element_id: string; form_id: string; children: React.ReactNode }) => (
  <Link href={`/sistema/subitem/${element_id}/${form_id}`} passHref>
    <div className="cursor-pointer hover:bg-gray-100">
      {children}
    </div>
  </Link>
);

const ActionCell = ({ row }: { row: { original: TableContent } }) => {
  const TableContent = row.original;
  const element_id = TableContent.id;
  const form_id = TableContent.form;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState<null | ((projectName: string) => void)>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleArquivarClick = async () => {
    try {
      await api.post(`/api/change_asset_status/${element_id}/`, { status: "Arquivado" }, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      window.location.reload();
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
        await api.delete(`/api/projects/${element_id}`, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
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
      await api.post(`/api/change_asset_status/${element_id}/`, { status: "Ativo" }, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      window.location.reload();
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
        <DropdownMenuItem onClick={() => handleDelete(TableContent.elementName)}>Deletar</DropdownMenuItem>
        <DropdownMenuItem onClick={handleArquivarClick}>Arquivar</DropdownMenuItem>
        <DropdownMenuItem onClick={handleAtivoClick}>Ativo</DropdownMenuItem>
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

export const columns: ColumnDef<TableContent>[] = [
  {
    accessorKey: "elementName",
    header: () => <div className="text-left">Nome</div>,
    cell: ({ row }) => {
      const { id, form } = row.original;
      return (
        <RowLink element_id={id} form_id={form}>
          <div className="py-2 px-4">{row.getValue("elementName")}</div>
        </RowLink>
      );
    }
  },
  {
    accessorKey: "form",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Formulário" />
    ),
    cell: ({ row }) => {
      const { id, form } = row.original;
      return (
        <RowLink element_id={id} form_id={form}>
          <div className="py-2 px-4">{row.getValue("form")}</div>
        </RowLink>
      );
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { id, form } = row.original;
      return (
        <RowLink element_id={id} form_id={form}>
          <div className="py-2 px-4">{row.getValue("status")}</div>
        </RowLink>
      );
    }
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ações" />
    ),
    cell: (props) => <ActionCell {...props} />,
  },
];
