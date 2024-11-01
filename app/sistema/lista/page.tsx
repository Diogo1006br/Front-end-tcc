"use client"; 

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import api from '@/Modules/Auth'; 
import { columns } from "./columns";
import { DataTable } from "@/components/newtable/data-table";
import { useState, useEffect } from "react";
import { NewListSheet } from "@/components/addList/addList"; 

export default function Lista() {
  const [dropboxlist, setDropboxlist] = useState([]);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        const response = await api.get("dropboxanswers/");
        setDropboxlist(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };
    
    fetchData();
  }, [hasChanged]);

  const listStatusActive = dropboxlist.filter((item: any) => item.status === "Ativo");
  const listStatusArchived = dropboxlist.filter((item: any) => item.status === "Arquivado");

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
                  <Link href="#">Lista</Link>
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
                <CardTitle>Lista</CardTitle>
                <CardDescription>Gerencie suas listas.</CardDescription>
              </CardHeader>
            </div>
            <div className="flex basis-1/3 justify-end mr-8">
              <NewListSheet setHasChanged={setHasChanged} hasChanged={hasChanged} />
            </div>
          </div>
        </Card>

        <Tabs defaultValue="all">
          <div className="flex items-center dark:ml-6">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="archived" className="hidden sm:flex">
                Arquivados
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0" className="relative">
              <CardContent className="overflow-auto h-[500px]">
                <div className="container mx-auto py-10">
                  <DataTable columns={columns} data={dropboxlist} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card x-chunk="dashboard-06-chunk-0" className="relative">
              <CardContent className="overflow-auto h-[500px]">
                <div className="container mx-auto py-14">
                  <DataTable columns={columns} data={listStatusActive} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="archived">
            <Card x-chunk="dashboard-06-chunk-0" className="relative">
              <CardContent className="overflow-auto h-[500px]">
                <div className="container mx-auto py-10">
                  <DataTable columns={columns} data={listStatusArchived} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}