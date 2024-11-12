"use client";
import React, { useState } from 'react';
import { FormBuilder } from '@/components/formbuilder/FormBuilder';
import { FormName } from '@/components/formbuilder/FormName';
import {
  Card,
  CardHeader,
} from "@/components/ui/card";
import { Preview } from '@/components/formbuilder/Preview';

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  params: { formulario: string };
}

export default function Form({ params }: Props) {
  const [isOverlayActive, setOverlayActive] = useState(false);

  const toggleOverlay = (active: boolean) => { // Tipagem de `active` adicionada aqui
    setOverlayActive(active);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-muted/40">
      {isOverlayActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-auto"></div>
      )}
      <header>
        <Breadcrumb className="flex items-center gap-4 px-4 sm:border-t">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                  <Link href="/sistema">Inicio</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                  <Link href="/sistema/formularios">Formulários</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                  <Link href="#">Editar Formulário</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="mr-4 ml-4 sm:m-4">
        <section>
          <Card x-chunk="dashboard-06-chunk-0" className='relative z-50 p-4 bg-white shadow-lg'>
            <div className="flex items-center">
                <CardHeader>
                  <FormName id={params.formulario} onToggleOverlay={toggleOverlay} />
                </CardHeader>
            </div>
          </Card>
        </section>

        <section className='flex flex-col mt-4 z-30 gap-4 lg:flex-row'>
          <Card className='min-h-96 rounded-2xl lg:flex-1'>
            <FormBuilder id={params.formulario} />
          </Card>
          <Card className='min-h-96 rounded-2xl p-8 lg:min-w-[300px] lg:justify-end lg:items-end lg:ml-auto'>
            <Preview id={params.formulario} />
          </Card>


        </section>

      </main>        
    </div>
  );
}
