"use client";
import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
// import { useAppState } from "@/state/state"
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";


import { TableContent, columns } from "./columns";
import { DataTable } from '@/components/newtable/data-table';
import { useState, useEffect } from 'react';

// async function getForms(): Promise<TableContent[]> {
//     try {
//         const response = await api.get('/forms/');
//         console.log(response.data);
//         return response.data;
//     } catch (error) {
//         console.error(error);
//         return [];
//     }
// }

export default function Forms() {
    const [Forms, setForms] = useState<TableContent[]>([]);
    const [searchTermAll, setSearchTermAll] = useState("");
    const [searchTermActive, setSearchTermActive] = useState("");
    const [searchTermArchived, setSearchTermArchived] = useState("");
    // const {resetForms} = useAppState();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getForms();
            setForms(data);
        };

        if (typeof window !== 'undefined') {
            fetchData();
        }
    }, []);

    const formStatusActive = Forms.filter((item: any) => item.status === "Ativo");
    const formStatusArchived = Forms.filter((item: any) => item.status === "Arquivado");

    const filteredDataAll = Forms.filter(item => {
        const createdDate = new Date(item.created_at);
        const dayCreated = ("0" + createdDate.getDate()).slice(-2);
        const monthCreated = ("0" + (createdDate.getMonth() + 1)).slice(-2);
        const yearCreated = createdDate.getFullYear();
        const formattedCreatedDate = `${dayCreated}/${monthCreated}/${yearCreated}`;

        const updatedDate = new Date(item.updated_at);
        const dayUpdated = ("0" + updatedDate.getDate()).slice(-2);
        const monthUpdated = ("0" + (updatedDate.getMonth() + 1)).slice(-2);
        const yearUpdated = updatedDate.getFullYear();
        const formattedUpdatedDate = `${dayUpdated}/${monthUpdated}/${yearUpdated}`;

        return (
            Object.values(item).some(s =>
                String(s).toLowerCase().includes(searchTermAll.toLowerCase())
            ) ||
            formattedCreatedDate.includes(searchTermAll) ||
            formattedUpdatedDate.includes(searchTermAll)
        );
    });

    const filteredDataActive = formStatusActive.filter(item => {
        const createdDate = new Date(item.created_at);
        const dayCreated = ("0" + createdDate.getDate()).slice(-2);
        const monthCreated = ("0" + (createdDate.getMonth() + 1)).slice(-2);
        const yearCreated = createdDate.getFullYear();
        const formattedCreatedDate = `${dayCreated}/${monthCreated}/${yearCreated}`;

        const updatedDate = new Date(item.updated_at);
        const dayUpdated = ("0" + updatedDate.getDate()).slice(-2);
        const monthUpdated = ("0" + (updatedDate.getMonth() + 1)).slice(-2);
        const yearUpdated = updatedDate.getFullYear();
        const formattedUpdatedDate = `${dayUpdated}/${monthUpdated}/${yearUpdated}`;

        return (
            Object.values(item).some(s =>
                String(s).toLowerCase().includes(searchTermActive.toLowerCase())
            ) ||
            formattedCreatedDate.includes(searchTermActive) ||
            formattedUpdatedDate.includes(searchTermActive)
        );
    });

    const filteredDataArchived = formStatusArchived.filter(item => {
        const createdDate = new Date(item.created_at);
        const dayCreated = ("0" + createdDate.getDate()).slice(-2);
        const monthCreated = ("0" + (createdDate.getMonth() + 1)).slice(-2);
        const yearCreated = createdDate.getFullYear();
        const formattedCreatedDate = `${dayCreated}/${monthCreated}/${yearCreated}`;

        const updatedDate = new Date(item.updated_at);
        const dayUpdated = ("0" + updatedDate.getDate()).slice(-2);
        const monthUpdated = ("0" + (updatedDate.getMonth() + 1)).slice(-2);
        const yearUpdated = updatedDate.getFullYear();
        const formattedUpdatedDate = `${dayUpdated}/${monthUpdated}/${yearUpdated}`;

        return (
            Object.values(item).some(s =>
                String(s).toLowerCase().includes(searchTermArchived.toLowerCase())
            ) ||
            formattedCreatedDate.includes(searchTermArchived) ||
            formattedUpdatedDate.includes(searchTermArchived)
        );
    });

    return (
        <div className="flex min-h-screen flex-col bg-muted/40 dark:bg-[#141417]">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-6 sm:pr-6 mt-30">
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
                                    <Link href="#">Formulários</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <Card x-chunk="dashboard-06-chunk-0" className="relative">
                    <div className="flex items-center">
                        <div className="basis-2/3">
                            <CardHeader>
                                <CardTitle>Formulários</CardTitle>
                                <CardDescription>
                                    Gerencie seus Formulários.
                                </CardDescription>
                            </CardHeader>
                        </div>
                        <div className="flex basis-1/3 justify-end mr-8">
                            <Link href="/sistema/formularios/NovoFormulario">
                                <Button className="mb-2" >
                                    Novo Formulário
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                <Tabs defaultValue="all">
                    <div className="flex items-center dark:ml-6">
                        <TabsList>
                            <TabsTrigger value="all">Todos</TabsTrigger>
                            <TabsTrigger value="active">Ativos</TabsTrigger>
                            <TabsTrigger value="archived" className="hidden sm:flex">Arquivados</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="all">
                        <Card x-chunk="dashboard-06-chunk-0" className="relative">
                                    <Link href="/sistema/lista">
                                    <div className="flex">
                                    <Button className="mt-4 ml-auto mr-8">Nova lista</Button>
                                    </div>
                                    </Link>
                            <CardContent className="overflow-auto h-[500px]">
                                <div className="container mx-auto py-12">
                                    <div className="flex items-center space-x-2 w-64 h-9">
                                        <Search className="w-8 ml-[-6px]" />
                                        <Input
                                            className="flex-1"
                                            placeholder="Buscar Formulários"
                                            onChange={(e) => setSearchTermAll(e.target.value)}
                                        />
                                    </div>
                                    <DataTable columns={columns} data={filteredDataAll} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="active">
                        <Card x-chunk="dashboard-06-chunk-0" className="relative">
                            <CardContent className="overflow-auto h-[500px]">
                                <div className="container mx-auto py-10">
                                    <div className="flex items-center space-x-2 w-64 h-9">
                                        <Search className="w-8 ml-[-6px]" />
                                        <Input
                                            className="flex-1"
                                            placeholder="Buscar Projetos"
                                            onChange={(e) => setSearchTermActive(e.target.value)}
                                        />
                                    </div>
                                    <DataTable columns={columns} data={filteredDataActive} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="archived">
                        <Card x-chunk="dashboard-06-chunk-0" className="relative">
                            <CardContent className="overflow-auto h-[500px]">
                                <div className="container mx-auto py-12">
                                    <div className="flex items-center space-x-2 w-64 h-9">
                                        <Search className="w-8 ml-[-6px]" />
                                        <Input
                                            className="flex-1"
                                            placeholder="Buscar Projetos"
                                            onChange={(e) => setSearchTermArchived(e.target.value)}
                                        />
                                    </div>
                                    <DataTable columns={columns} data={filteredDataArchived} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
