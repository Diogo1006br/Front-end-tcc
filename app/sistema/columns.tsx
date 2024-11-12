"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
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

// Define a reusable component for clickable rows
const ClickableRow = ({ form_id, children }: { form_id: string; children: React.ReactNode }) => (
  <Link href={`/sistema/formularios/FormEdit/${form_id}`} passHref>
    <div className="cursor-pointer">
      {children}
    </div>
  </Link>
);




// Define the type for table content
export type TableContent = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  company: string;
};

// Define column definitions
export const columns: ColumnDef<TableContent>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-left">id</div>,
    cell: ({ row }) => (
      <ClickableRow form_id={row.original.id}>
        <div className="text-left">{row.getValue("id")}</div>
      </ClickableRow>
    ),
  },
  {
    accessorKey: "Nome",
    accessorFn: (row) => `${row.name}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => (
      <ClickableRow form_id={row.original.id}>
        <div className="text-left">{row.getValue("Nome")}</div>
      </ClickableRow>
    ),
  },
  {
    accessorKey: "Criado em",
    accessorFn: (row) => row.created_at,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => (
      <ClickableRow form_id={row.original.id}>
        <div className="text-left">
          {new Date(row.getValue("Criado em")).toLocaleDateString()}
        </div>
      </ClickableRow>
    ),
  },
  {
    accessorKey: "Modificado em",
    accessorFn: (row) => row.updated_at,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modificado em" />
    ),
    cell: ({ row }) => (
      <ClickableRow form_id={row.original.id}>
        <div className="text-left">
          {new Date(row.getValue("Modificado em")).toLocaleDateString()}
        </div>
      </ClickableRow>
    ),
  },
];
