"use client"

//Imports Systems
import api from "@/Modules/Auth"
import { useState, useEffect } from 'react';

//Imports Components
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { createColumns , TableContent } from './columns';
import { DataTable } from '@/components/newtable/data-table';
import AddProject from '@/components/addproject/addproject';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

//Imports Icons
import {
    Search,
  } from "lucide-react"


//Imports Functions
async function getProjects(): Promise<TableContent[]> {
    try {
        const response = await api.get('/api/projects/');
        return response.data;
        
    } catch (error) {
        console.error(error);
        return [];
    }
}


//Exports
export default function Projects() {

    //Variables
    const [projects, setProjects] = useState<TableContent[]>([]);
    const [filteredDataAll, setFilteredDataAll] = useState<TableContent[]>([]);
    const [filteredDataActive, setFilteredDataActive] = useState<TableContent[]>([]);
    const [filteredDataArchived, setFilteredDataArchived] = useState<TableContent[]>([]);
    const [searchTermAll, setSearchTermAll] = useState('');
    const [searchTermActive, setSearchTermActive] = useState('');
    const [searchTermArchived, setSearchTermArchived] = useState('');
    const [hasChanged, setHasChanged] = useState(false);
    const columns = createColumns({ hasChanged, setHasChanged });

    //Hooks
    useEffect(() => {
        const fetchData = async () => {
            const data = await getProjects();
            setProjects(data);
            setFilteredDataAll(data);
            setFilteredDataActive(data.filter(project => project.status === 'Ativo'));
            setFilteredDataArchived(data.filter(project => project.status === 'Arquivado'));
        };

        if (typeof window !== 'undefined') {
            fetchData();
        }
    }, [hasChanged]);

    useEffect(() => {
        if (!searchTermAll) {
            setFilteredDataAll(projects);
        } else {
            setFilteredDataAll(
                projects.filter(item => {
                    const createdDate = new Date(item.created_at);
                    const dayCreated = ("0" + createdDate.getDate()).slice(-2);
                    const monthCreated = ("0" + (createdDate.getMonth() + 1)).slice(-2);
                    const yearCreated = createdDate.getFullYear();
                    const formattedCreatedDate = `${dayCreated}/${monthCreated}/${yearCreated}`;

                    const updatedDate = new Date(item.uptaded_at);
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
                })
            );
        }
    }, [searchTermAll, projects]);

    useEffect(() => {
        if (!searchTermActive) {
            setFilteredDataActive(projects.filter(project => project.status === 'Ativo'));
        } else {
            setFilteredDataActive(
                projects.filter(item => {
                    const createdDate = new Date(item.created_at);
                    const dayCreated = ("0" + createdDate.getDate()).slice(-2);
                    const monthCreated = ("0" + (createdDate.getMonth() + 1)).slice(-2);
                    const yearCreated = createdDate.getFullYear();
                    const formattedCreatedDate = `${dayCreated}/${monthCreated}/${yearCreated}`;

                    const updatedDate = new Date(item.uptaded_at);
                    const dayUpdated = ("0" + updatedDate.getDate()).slice(-2);
                    const monthUpdated = ("0" + (updatedDate.getMonth() + 1)).slice(-2);
                    const yearUpdated = updatedDate.getFullYear();
                    const formattedUpdatedDate = `${dayUpdated}/${monthUpdated}/${yearUpdated}`;

                    return (
                        (item.status === 'Ativo') &&
                        (Object.values(item).some(s =>
                            String(s).toLowerCase().includes(searchTermActive.toLowerCase())
                        ) ||
                        formattedCreatedDate.includes(searchTermActive) ||
                        formattedUpdatedDate.includes(searchTermActive))
                    );
                })
            );
        }
    }, [searchTermActive, projects]);

    useEffect(() => {
        if (!searchTermArchived) {
            setFilteredDataArchived(projects.filter(project => project.status === 'Arquivado'));
        } else {
            setFilteredDataArchived(
                projects.filter(item => {
                    const createdDate = new Date(item.created_at);
                    const dayCreated = ("0" + createdDate.getDate()).slice(-2);
                    const monthCreated = ("0" + (createdDate.getMonth() + 1)).slice(-2);
                    const yearCreated = createdDate.getFullYear();
                    const formattedCreatedDate = `${dayCreated}/${monthCreated}/${yearCreated}`;

                    const updatedDate = new Date(item.uptaded_at);
                    const dayUpdated = ("0" + updatedDate.getDate()).slice(-2);
                    const monthUpdated = ("0" + (updatedDate.getMonth() + 1)).slice(-2);
                    const yearUpdated = updatedDate.getFullYear();
                    const formattedUpdatedDate = `${dayUpdated}/${monthUpdated}/${yearUpdated}`;

                    return (
                        (item.status === 'Arquivado') &&
                        (Object.values(item).some(s =>
                            String(s).toLowerCase().includes(searchTermArchived.toLowerCase())
                        ) ||
                        formattedCreatedDate.includes(searchTermArchived) ||
                        formattedUpdatedDate.includes(searchTermArchived))
                    );
                })
            );
        }
    }, [searchTermArchived, projects]);

    return (
        // Breadcrumbs
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
                                <Link href="#">Projetos</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
    
            <main className="flex-grow mr-4 ml-4 sm:m-4">
                {/* CardHeader Projects */}
                <section>
                    <Card x-chunk="dashboard-06-chunk-0">
                        <div className="flex items-center">
                            <div className="basis-2/3">
                                <CardHeader>
                                    <CardTitle>Projetos</CardTitle>
                                    <CardDescription>
                                        Gerencie seus Projetos.
                                    </CardDescription>
                                </CardHeader>
                            </div>
                            <div className="flex basis-1/3 justify-end mr-8">
                                <AddProject setHasChanged={setHasChanged} hasChanged={hasChanged} />
                            </div>
                        </div>
                    </Card>
                </section>
    
                <section className="mt-4 flex-grow">
                    <Tabs defaultValue="active">
                        <TabsList>
                            <TabsTrigger value="all">Todos</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all">
                            <Card x-chunk="dashboard-06-chunk-0" className="h-full w-full">
                                <CardContent className="flex flex-col w-full h-full mt-2">
                                    <div className="flex items-center gap-2">
                                        <Search className="w-8" />
                                        <Input
                                            className="w-64"
                                            placeholder="Buscar Projetos"
                                            onChange={(e) => setSearchTermAll(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-2 overflow-auto flex-grow w-full">
                                        <DataTable columns={columns} data={filteredDataAll} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="active">
                            <Card x-chunk="dashboard-06-chunk-0" className="h-full w-full">
                                <CardContent className="flex flex-col w-full h-full mt-2">
                                    <div className="flex items-center gap-2">
                                        <Search className="w-8" />
                                        <Input
                                            className="w-64"
                                            placeholder="Buscar Projetos"
                                            onChange={(e) => setSearchTermActive(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-2 overflow-auto flex-grow w-full">
                                        <DataTable columns={columns} data={filteredDataActive} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="archived">
                            <Card x-chunk="dashboard-06-chunk-0" className="h-full w-full">
                                <CardContent className="flex flex-col w-full h-full mt-2">
                                    <div className="flex items-center gap-2">
                                        <Search className="w-8" />
                                        <Input
                                            className="w-64"
                                            placeholder="Buscar Projetos"
                                            onChange={(e) => setSearchTermArchived(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-2 overflow-auto flex-grow w-full">
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