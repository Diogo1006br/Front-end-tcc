"use client"
import Image from "next/image"
import Link from "next/link"
import { Label } from '@/components/ui/label';
import { InputTags } from '@/components/ui/inputTag';
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
  } from "@tanstack/react-table"
import api from "@/Modules/Auth"
import { Sender } from "@/components/formbuilder/SendResponse";

interface Props{
  params: {subitem: string ,form: string}

}


export default function itemdetail({ params }: Props) {
   

console.log(params)
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-6 sm:pr-6">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/sistema">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#">Projetos</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="">Nome do projeto</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#">Nome do item</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </BreadcrumbList>
            </Breadcrumb>
          </header>
      
          <Card x-chunk="dashboard-06-chunk-0" className="relative">
            <div className="flex items-center">
              <div className="basis-2/3">
                <CardHeader>
                  <CardTitle>Nome do item</CardTitle>
                </CardHeader>
              </div>
              <div className="flex basis-1/3 justify-end mr-8">
                <Button>Novo Item</Button>
              </div>
            </div>
          </Card>
      
          <div className="flex justify-between items-start gap-4 mt-4">
            <div className="w-3/5 bg-gray-100 p-4">
              <div className="flex w-full justify-center gap-4">
                <Sender params={{id: params.subitem[1], asset: params.subitem[0], instance: 'Element'}}/>
                <Button variant="secondary">Status</Button>
                <Button>Editar</Button>
              </div>
            </div>
            <div className="w-2/5 bg-gray-100 p-4">Mosaico de fotos</div>
          </div>
        </div>
        <div className="flex justify-center items-center w-full flex-col gap-4">
        <div className="w-[187vh] h-[20vh] bg-gray-100">
        <div className=" ml-4 mt-2 items-center flex justify-start text-2xl">
        Documentos anexados
        </div>
        </div>
        </div>
      </div>
      
    )
}