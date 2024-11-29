"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import Link from "next/link";
import Image from "next/image"; // Importando o componente Image otimizado
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
import ConfirmDeleteDialog from "@/components/ui/modal"; // Importando o dialog

export type TableContent = {
  image: string;
  id: number;
  projectName: string;
  status: 'Ativo' | 'Arquivado';
  owner: string;
  created_at: string;
  uptaded_at: string;
  projectDescription: string;
};

const addColumnHover = (index: number, action: 'add' | 'remove') => {
  const table = document.querySelector('table');
  if (!table) return;
  const rows = Array.from(table.querySelectorAll('tr'));
  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    if (cells[index]) {
      if (action === 'add') {
        cells[index].classList.add('hover:bg-[#C4C4C4]');
      } else {
        cells[index].classList.remove('hover:bg-[#C4C4C4]');
      }
    }
  });
};

// Novo componente para a célula de Ações
const ActionCell = ({ row, hasChanged, setHasChanged }: { row: any, hasChanged: boolean, setHasChanged: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const TableContent = row.original;
  const project_id = TableContent.id;
  const NewStatusFiled = { status: "Pending" };
  const NewStatusActive = { status: "In Progress" };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState<null | ((projectName: string) => void)>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleArquivarClick = async () => {
    try {
      await api.patch(`change_project_status/${project_id}/`, NewStatusFiled, {
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
        await api.delete(`/projects/${project_id}`, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setHasChanged(!hasChanged);
      } catch (error) {
        console.error(error);
      }
    });
    setIsDialogOpen(true);
    setErrorMessage("");
  };

  const handleAtivoClick = async () => {
    try {
      await api.patch(`change_project_status/${project_id}/`, NewStatusActive, {
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
        <DropdownMenuItem onClick={() => handleDelete(TableContent.projectName)}>Deletar</DropdownMenuItem>

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
      accessorKey: "Nome projeto",
      accessorFn: (row) => `${row.projectName}`,
      header: () => <div className="text-left">Nome</div>,
      cell: ({ column, row }) => {
        const handleMouseEnter = () => {
          addColumnHover(Number(column.id), 'add');
        };

        const handleMouseLeave = () => {
          addColumnHover(Number(column.id), 'remove');
        };
        const TableContent = row.original;

        return (
          <Link href={`/sistema/projetos/${TableContent.id}`}>
            <div 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {row.getValue("Nome projeto")}
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: "Descricao Projeto",
      accessorFn: (row) => `${row.projectDescription}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descrição" />
      ),
      cell: ({ row }) => {
        const TableContent = row.original;
  
        return (
          <Link href={`/sistema/projetos/${TableContent.id}`}>
            <div className="cursor-pointer">{TableContent.projectDescription}</div>
          </Link>
        );
      },
    },
    {
      accessorKey: "Responsável",
      accessorFn: (row) => `${row.owner}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Responsável" />
      ),
      cell: ({ row }) => {
        const TableContent = row.original;
  
        return (
          <Link href={`/sistema/projetos/${TableContent.id}`}>
            <div className="cursor-pointer">{TableContent.owner}</div>
          </Link>
        );
      },
    },
    {
      accessorKey: "Data Criação",
      accessorFn: (row) => row.created_at,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data Criação" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("Data Criação")).toLocaleDateString();
        const TableContent = row.original;
        return (
          <Link href={`/sistema/projetos/${TableContent.id}`}>
            <div className="text-left">{date}</div>
          </Link>
        );
      },
    },
    {
      accessorKey: "Data de modificação",
      accessorFn: (row) => row.uptaded_at,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de modificação" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("Data de modificação")).toLocaleDateString();
        const TableContent = row.original;
        return (
          <Link href={`/sistema/projetos/${TableContent.id}`}>
            <div className="text-left">{date}</div>
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
