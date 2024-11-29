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

import api from "@/Modules/Auth";
import { columns } from "./columns";
import { DataTable } from '@/components/newtable/data-table';
import { useState, useEffect } from 'react';

interface Props {
  params: { dropboxlist: string };
}

interface Dropboxlist {
  name: string;
  list: { [key: string]: any };
}

export default function Dropboxlist({ params }: Props) {
  const [dropboxlist, setDropboxlist] = useState<Dropboxlist>({ name: '', list: {} });
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    console.log('rodou useEffect');
    // Para fazer uma solicitação GET
    api.get(`/api/dropboxanswers/${params.dropboxlist}`)
      .then(response => {
        setDropboxlist(response.data);
        console.log('Api data', response.data);
      })
      .catch(error => {
        console.error(error);
      });
    console.log(hasChanged);
  }, [params.dropboxlist , hasChanged]); // Inclui params.dropboxlist na lista de dependências

  const Datalist = dropboxlist.list || {};
  const valuesArray = [];
  for (let key in Datalist) {
    if (Datalist.hasOwnProperty(key)) {
      valuesArray.push({ item: Datalist[key] });
    }
  }

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
                  <Link href="/sistema/lista">Listas</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Detalhes da lista</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <Card x-chunk="dashboard-06-chunk-0" className="relative">
          <div className="flex items-center">
            <div className="basis-2/3">
              <CardHeader>
                <CardTitle>{dropboxlist.name}</CardTitle>
                <CardDescription>Itens cadastrados na lista.</CardDescription>
              </CardHeader>
            </div>
            <div className="flex basis-1/3 justify-end mr-8">
              <Link href="/sistema/formularios/NovoFormulario">
                <Button className="mb-2">
                  Editar
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card x-chunk="dashboard-06-chunk-0" className="relative">
          <CardContent className="overflow-auto h-[500px]">
            <div className="container mx-auto py-10">
              <DataTable columns={columns} data={valuesArray} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
