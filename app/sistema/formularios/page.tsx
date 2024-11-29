"use client";


// Imports Systems
import { useAppState } from "@/state/state"
import api from "@/Modules/Auth";
import { useState, useEffect } from 'react';

// Imports Components
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";

  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";
  
  import { TableContent, columns } from "./columns";
  import { DataTable } from '@/components/newtable/data-table';


  // Imports Icons
import {
  Search,
} from "lucide-react";


//Imports Functions
async function getForms(): Promise<TableContent[]> {
    try {
        const response = await api.get('/api/forms/');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default function Forms() {
    //Variables
    const [Forms, setForms] = useState<TableContent[]>([]);
    const [searchTermAll, setSearchTermAll] = useState("");
    const [searchTermActive, setSearchTermActive] = useState("");
    const [searchTermArchived, setSearchTermArchived] = useState("");
    const id = undefined;
    const {resetForms} = useAppState(id);

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

    //Hooks
    useEffect(() => {
        const fetchData = async () => {
            const data = await getForms();
            setForms(data);
        };

        if (typeof window !== 'undefined') {
            fetchData();
        }
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex items-center gap-4 px-4 sm:border-t">
                <Breadcrumb>
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
    
            <main className="flex-grow mx-4 sm:mx-8">
                {/* CardHeader Forms */}
                <section>
                    <Card x-chunk="dashboard-06-chunk-0">
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
                                    <Button className="mb-2" onClick={resetForms}>
                                        Novo Formulário
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </section>
    
                <section className="mt-4 flex-grow">
                    <Tabs defaultValue="active">
                        <TabsList>
                            <TabsTrigger value="all">Todos</TabsTrigger>
                            <TabsTrigger value="active">Ativos</TabsTrigger>
                            <TabsTrigger value="archived">Arquivados</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all">
                            <Card x-chunk="dashboard-06-chunk-0" className="w-full">
                                <CardContent className="flex flex-col w-full mt-2">
                                    <div className="flex items-center gap-2">
                                        <Search className="w-8" />
                                        <Input
                                            className="w-full"
                                            placeholder="Buscar Formulários"
                                            onChange={(e) => setSearchTermAll(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-2 overflow-auto w-full flex-grow">
                                        <DataTable columns={columns} data={filteredDataAll} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="active">
                            <Card x-chunk="dashboard-06-chunk-0" className="w-full">
                                <CardContent className="flex flex-col w-full mt-2">
                                    <div className="flex items-center gap-2">
                                        <Search className="w-8" />
                                        <Input
                                            className="w-full"
                                            placeholder="Buscar Formulários"
                                            onChange={(e) => setSearchTermActive(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-2 overflow-auto w-full flex-grow">
                                        <DataTable columns={columns} data={filteredDataActive} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="archived">
                            <Card x-chunk="dashboard-06-chunk-0" className="w-full">
                                <CardContent className="flex flex-col w-full mt-2">
                                    <div className="flex items-center gap-2">
                                        <Search className="w-8" />
                                        <Input
                                            className="w-full"
                                            placeholder="Buscar Formulários"
                                            onChange={(e) => setSearchTermArchived(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-2 overflow-auto w-full flex-grow">
                                        <DataTable columns={columns} data={filteredDataArchived} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </section>
            </main>
        </div>
    );
    
    
    
}
