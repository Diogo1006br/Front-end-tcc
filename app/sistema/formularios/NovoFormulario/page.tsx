"use client";


//Imports system
import React, { useState } from 'react';


//Imports components
import { FormBuilder } from '@/components/formbuilder/FormBuilder';
import { FormName } from '@/components/formbuilder/FormName';
import { Preview } from '@/components/formbuilder/Preview';
import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

//Imports icons



//Interfaces
interface Props {
  params: { formulario: string };
}

interface State {
  isOverlayActive: boolean;
}


//Functions

class Form extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOverlayActive: false,
    };
  }

  toggleOverlay = (active: boolean) => {
    this.setState({ isOverlayActive: active });
  };

  render() {
    const { isOverlayActive } = this.state;
    const { params } = this.props; // Desestruture 'params' de 'props'
    const { formulario } = params; // Acesse 'formulario' de 'params'

    return (
      <div className="relative flex min-h-screen w-full flex-col bg-muted/40">
        {isOverlayActive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-auto"></div>
        )}

        <header className="flex items-center gap-4 px-4 sm:border-t">
          <Breadcrumb>
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
                    <Link href="#">Novo Formulário</Link>
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
                    <FormName id = {undefined}   onToggleOverlay={this.toggleOverlay} />
                  </CardHeader>
              </div>
            </Card>
          </section>

          <section className='flex flex-col mt-4 z-30 gap-4 lg:flex-row'>
            <Card className='min-h-96 rounded-2xl lg:flex-1'>
              <FormBuilder id={undefined}/>
            </Card>
            <Card className='min-h-96 rounded-2xl p-8 lg:min-w-[500px] lg:justify-end lg:items-end lg:ml-auto'>
              <Preview id={undefined} />
            </Card>
          </section>

        </main>
      </div>
    );
  }
}

export default Form;
