"use client"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"
import { useEffect } from "react"

// Definição do tipo de dado para o conteúdo da tabela
export type TableContent = {
  item: string
}



export const columns: ColumnDef<TableContent>[] = [

  {
    accessorKey: "Item",
    accessorFn: (row) => `${row.item}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item" className="text-center"/>
    ),
    cell: ({ row }) => {
      return <div className="text-left">{row.original.item}</div>;
    },
},

]
