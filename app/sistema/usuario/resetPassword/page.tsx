"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/Modules/Auth"
import { useEffect, useState } from "react";
import Link from "next/link"


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

import Image from 'next/image'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast'; 
import { set } from "date-fns";

export default function Users() {
  const [password, setPassword] = useState({
    password: "",
  })
  const [userid, setUserid] = useState(0);
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant: 'default' | 'destructive' } | null>(null);
  useEffect(() => {
    api.get("logeduser/").then((response) => {
      setUserid(response.data.id);

    });
  },
  []);
  function UserUpdate() {
    api.put(`/password/${userid}/`, password, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
        if (response.status === 200) {
          setToastMessage({
            title: "Usuário atualizado com sucesso",
            description: "As informações do usuário foram atualizadas com sucesso.",
            variant: "default",
          });
        } else {
          setToastMessage({
            title: "Erro ao atualizar usuário",
            description: "Houve um erro ao atualizar as informações do usuário.",
            variant: "destructive",
          });
        }
      }
      );
  }
  

  return (

    <ToastProvider>
    <div className="flex min-h-screen w-full flex-col bg-muted/40 ">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-6 sm:pr-6">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                  <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                          <Link href="/sistema/">Dashboard</Link>
                      </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                          <Link href="/sistema/usuario">Projetos</Link>     
                      </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />                               
              </BreadcrumbList>
          </Breadcrumb> 
        </header>
        <Card x-chunk="dashboard-06-chunk-0" className="relative">
          <div className="flex items-center">
              <div className = "basis-2/3">
                  <CardHeader>
                      <CardTitle>Trocar senha</CardTitle>
                  </CardHeader>
              </div>
              <div className = "flex basis-1/3 justify-end mr-8">
              
              </div>
          </div>
        </Card>
        <div className="h-screen p-4 bg-zinc-50 rounded-md">      
          <div className="grid grid-cols-4 grid-rows-4 gap-4">
            <div className="row-span-4">
              <h1 className="font-bold text-xl">Informações da conta</h1>
              <div className="flex flex-col items-center justify-center">
              
            </div>
            <div className="row-span-1 mt-10">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="font-bold" htmlFor="cargo">Nova senha</Label>
                <Input type="string" id="cargo" placeholder="" onChange={(e) => {
                    const newValue = e.target.value;
                    setPassword((currentPostData) => ({ ...currentPostData, password: newValue }));
                  }} />
              </div>
              <div>
                <Button className="mt-10" onClick={UserUpdate}>Salvar</Button>
              </div>
              
            </div>
            
            
            </div>
          </div>
        </div>
      </div>
    </div>
    <ToastViewport />
      {toastMessage && (
        <Toast variant={toastMessage.variant} open={!!toastMessage} onOpenChange={() => setToastMessage(null)}>
          <ToastTitle>{toastMessage.title}</ToastTitle>
          <ToastDescription>{toastMessage.description}</ToastDescription>
          <ToastClose />
        </Toast>
      )}
  </ToastProvider>
  );
}


