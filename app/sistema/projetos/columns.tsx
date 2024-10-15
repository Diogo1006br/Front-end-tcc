"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import Link from "next/link";
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
  status: "Active" | "Archived";
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


export const createColumns = ({ hasChanged, setHasChanged }: { hasChanged: boolean, setHasChanged: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const columns: ColumnDef<TableContent>[] = [
    {
      accessorKey: "imagem",
      accessorFn: (row) => `${row.image}`,
      header: () => <div className="text-left"></div>,
      cell: ({ row }) => {
        const url: string = row.getValue("imagem");
        const TableContent = row.original

        return (
          <Link href={`/sistema/projetos/${TableContent.id}`}>
          <div className="flex items-center">

            <div className="w-16 h-16 rounded-md" style={{ backgroundColor: "#FFFFFF" }}>
              <img
                src={process.env.NEXT_PUBLIC_MEDIAURL + url}
                alt="Project Image"
                className="w-full h-full object-cover rounded-md"

              />
            </div>
          </div>
          </Link>
        );
      },

    },
    {
      accessorKey: "Nome projeto",
      accessorFn: (row) => `${row.projectName}`,
      header: () => <div className="text-left">Nome</div>,
      cell: ({ column, row }) => {
        const handleMouseEnter = () => {
          addColumnHover(column.id, 'add');
        };

        const handleMouseLeave = () => {
          addColumnHover(column.id, 'remove');
        };
        const TableContent = row.original

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
      }
    },
    {
      accessorKey: "Descricao Projeto",
      accessorFn: (row) => `${row.projectDescription}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descrição" />
      ),
      cell: ({ row }) => {
        const TableContent = row.original
  
        return (
          <Link href={`/sistema/projetos/${TableContent.id}`}>
            <div className="cursor-pointer">{TableContent.projectDescription}</div>
          </Link>
        )
      },
    },
    {

      accessorKey: "status",
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => {
        const TableContent = row.original
  
        return (
          <Link href={`/sistema/projetos/${TableContent.id}`}>
            <div className="cursor-pointer">{TableContent.status}</div>
          </Link>
        )
      },
    },
    {
      accessorKey: "Responsável",
      accessorFn: (row) => `${row.owner}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Responsável" />
      ),
      cell: ({ row }) => {
        const TableContent = row.original
  
        return (
          <Link href={`/sistema/projetos/${TableContent.id}`}>
            <div className="cursor-pointer">{TableContent.owner}</div>
          </Link>
        )
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
        const TableContent = row.original
        return (
        <Link href={`/sistema/projetos/${TableContent.id}`}>
        <div className="text-left">{date}</div>
        </Link>
        )
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
        const TableContent = row.original
        return (
          <Link href={`/sistema/projetos/${TableContent.id}`}>
          <div className="text-left">{date}</div>
          </Link>
          )
      },
    },
    {
      id: "Ações",
      accessorFn: (row) => `${row.actions}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ações" />
      ),
      cell: ({ row }) => {
        const TableContent = row.original;
        const project_id = TableContent.id;
        const NewStatusFiled = { status: "Arquivado" };
        const NewStatusActive = { status: "Ativo" };

        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [confirmCallback, setConfirmCallback] = useState<null | ((projectName: string) => void)>(null);
        const [errorMessage, setErrorMessage] = useState("");

        const handleArquivarClick = async () => {
          try {
            await api.post(`change_project_status/${project_id}/`, NewStatusFiled, {
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
          setConfirmCallback(() => async (inputProjectName) => {
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
            await api.post(`change_project_status/${project_id}/`, NewStatusActive, {
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

              {TableContent.status !== "Arquivado" && (
                <DropdownMenuItem onClick={handleArquivarClick}>Arquivar</DropdownMenuItem>
              )}
              {TableContent.status !== "Ativo" && (
                <DropdownMenuItem onClick={handleAtivoClick}>Ativo</DropdownMenuItem>
              )}
              <Link href={`projetos/ProjetoConfig/${TableContent.id}`}>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              </Link>
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
      },
    },
  ];
  return columns;
};
