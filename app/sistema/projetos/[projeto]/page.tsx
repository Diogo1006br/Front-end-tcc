"use client";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { InputTags } from "@/components/ui/inputTag";
import {
  BellRing,
  Check,
  FolderOpenDot,
  ChevronRight,
  SearchCheck,
  Info,
  Plus,
  ListTodo,
  CalendarDays,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProjectCardInfo from "@/components/projects/ProjectCardInfo";
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import api from "@/Modules/Auth";

import { createColumns } from "./columns";
import { DataTable } from "@/components/newtable/data-table";

import { useState, useEffect, useRef } from "react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";

import { EditName } from '@/components/ui/EditName';

interface Props {
  params: { projeto: string };
}

export default function Projects({ params }: Props) {
  const [assets, setAssets] = useState([]);
  const [project, setProject] = useState([]);
  const [assetNumbers, setAssetNumbers] = useState([]);
  const [forms, setForms] = useState([]);
  const [assetHasChanged, setAssetHasChanged] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({ title: "", description: "", variant: "default" });
  const sheetRef = useRef(null);

  const [NewAssetFormData, setNewAssetFormData] = useState({
    assetName: "",
    form: "",
    project: params.projeto,
  });

  const columns = createColumns({
    hasChanged: assetHasChanged,
    setHasChanged: setAssetHasChanged,
  });

  const handleAddAsset = async (e) => {
    e.preventDefault();

    if (!NewAssetFormData.assetName || !NewAssetFormData.form) {
      setToastContent({ title: "Erro", description: "Nome do Ativo e Formulário são obrigatórios.", variant: "destructive" });
      setShowToast(true);
      return;
    }

    try {
      console.log(NewAssetFormData);
      await api.post("assets/", NewAssetFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAssetHasChanged(!assetHasChanged);
      setToastContent({ title: "Sucesso", description: "Item criado com sucesso.", variant: "default" });
      setShowToast(true);
      sheetRef.current?.click();
    } catch (error) {
      console.error(error);
      setToastContent({ title: "Erro", description: "Houve um problema ao criar o item.", variant: "destructive" });
      setShowToast(true);
    }
  };

  const handleSelectForm = (value) => {
    setNewAssetFormData({ ...NewAssetFormData, form: value });
    console.log(value);
  };

  useEffect(() => {
    // Para fazer uma solicitação GET
    api
      .get(`assets/`, {
        params: {
          project: params.projeto,
        },
      })
      .then((response) => {
        setAssets(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [assetHasChanged]);

  useEffect(() => {
    // Para fazer uma solicitação GET
    api
      .get(`projects/${params.projeto}`)
      .then((response) => {
        setProject(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [params.projeto]);

  useEffect(() => {
    // Para fazer uma solicitação GET
    api
      .get(`asset_numbers/${params.projeto}/`)
      .then((response) => {
        setAssetNumbers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [assetHasChanged, params.projeto]);

  useEffect(() => {
    // Para fazer uma solicitação GET
    api
      .get(`forms/`)
      .then((response) => {
        setForms(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const assetStatusActive =
    assets && assets.length > 0
      ? assets.filter((item: any) => item.status === "Ativo")
      : [];
  const assetStatusArchived =
    assets && assets.length > 0
      ? assets.filter((item: any) => item.status === "Arquivado")
      : [];

      const [isOverlayActive, setOverlayActive] = useState(false);

  const toggleOverlay = (active) => {
    setOverlayActive(active);
  };


  return (
    <div className="flex min-h-screen w-full flex-col sm:gap-4 sm:py-4 sm:pl-6 sm:pr-6">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/sistema">Inicio</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/sistema/projetos">Projetos</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main>
        <ToastProvider>
          <Card x-chunk="dashboard-06-chunk-0" className="relative">
            <div className="flex items-center">
              <div className="basis-2/3">
                <CardHeader>
                  <CardTitle>{project.projectName}</CardTitle>
                  <CardDescription>
                     {project.projectDescription}
                  </CardDescription>
                </CardHeader>
              </div>
              <div className="flex basis-1/3 justify-end mr-8">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="mb-2 mr-8" ref={sheetRef}>Novo Item</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Criar novo item</SheetTitle>
                      <SheetDescription>
                        Crie seu novo item preenchendo um nome e escolhendo um
                        formulário
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col gap-4">
                        <Input
                          type="text"
                          value={NewAssetFormData.assetName}
                          onChange={(e) =>
                            setNewAssetFormData({
                              ...NewAssetFormData,
                              assetName: e.target.value,
                            })
                          }
                          placeholder="Nome do Ativo"
                          className="col-span-3"
                        />
                        <Select onValueChange={handleSelectForm}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select um item" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Formulários</SelectLabel>
                              {forms.map((form: any) => (
                                <SelectItem key={form.id} value={form.id}>
                                  {form.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleAddAsset}>Adicionar Item</Button>
                    <SheetFooter>
                      <SheetClose asChild> </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </Card>
          <div className="flex rounded mt-4">
            {/* <p>{assetNumbers}</p> */}
          </div>
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
                    <DataTable columns={columns} data={assets} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="active">
              <Card x-chunk="dashboard-06-chunk-0" className="relative">
                <CardContent className="overflow-auto h-[500px]">

                  <div className="container mx-auto py-14 ">

                    <DataTable columns={columns} data={assetStatusActive} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="archived">
              <Card x-chunk="dashboard-06-chunk-0" className="relative">
                <CardContent className="overflow-auto h-[500px]">

                  <div className="container mx-auto py-14 ">
                   <DataTable columns={columns} data={assetStatusArchived} />

                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <ToastViewport />
          {showToast && (
            <Toast
              onOpenChange={setShowToast}
              variant={toastContent.variant}
            >
              <ToastTitle>{toastContent.title}</ToastTitle>
              <ToastDescription>{toastContent.description}</ToastDescription>
              <ToastClose />
            </Toast>
          )}
        </ToastProvider>
      </main>
    </div>
  );
}
