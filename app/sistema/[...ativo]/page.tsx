"use client";

//import systems
import { useState, useEffect } from 'react';
import api from "@/Modules/Auth";

//Importing components
import Link from "next/link";
import { Input } from '@/components/ui/input';
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
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { columns } from "./columns";
import { DataTable } from "@/components/newtable/data-table";
import { Sender } from "@/components/formbuilder/SendResponse";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast"; // Importando os componentes de toast

import Image from "next/image"
import { ChevronDown, ChevronUp } from 'lucide-react';
import AddElement from '@/components/formbuilder/AddElement';

//Interface
interface Props {
  params: { ativo: string }
}

interface Asset {
  assetName: string;
  form: string;
  project: string;
}

export default function Asset({ params }: Props) {

  //Variables
  const [asset, setAsset] = useState<Asset>();
  const [elements, setElements] = useState([]);
  const [forms, setForms] = useState([]);
  const [form,setForm] = useState([]);
  const [NewElementFormData, setNewElementFormData] = useState({
    elementName: '',
    form: '',
    ativo: params.ativo[0],
  });
  const [haschanged, setHasChanged] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({
    title: '',
    description: '',
    variant: 'default', // Ou outro valor padrão que você quiser
  });

  const [showMore, setShowMore] = useState(false); // Estado para controlar a abertura do modal
  const toggleShowMore = () => {
    setShowMore(!showMore);
  }

  const [isSheetOpen, setIsSheetOpen] = useState(false); // Estado para controlar a abertura do Sheet

  const handleSelectForm = (value) => {
    setNewElementFormData({ ...NewElementFormData, form: value });
  };

  const elementsStatusActive = elements.filter((item: any) => item.status === "Ativo");
  const elementsStatusArchived = elements.filter((item: any) => item.status === "Arquivado");

  const [hasChangedImage, setHasChangedImage] = useState(false);

  //Hooks
  useEffect(() => {
    api.get(`assets/${params.ativo[0]}`)
      .then(response => {
        setAsset(response.data);
        api.get(`forms/${response.data.form}`)
        .then(response => {
          setForm(response.data);
          console.log("FORMS", response.data.form)
        })
        .catch(error => {
          console.error(error);
        })
      })
      .catch(error => {
        console.error(error);
      });
  }, [params.ativo]); // Adicionando params.ativo como dependência

  useEffect(() => {
    api.get(`forms/`)
      .then(response => {
        setForms(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    api.get('elementperasset/', {
      params: {
        Asset: params.ativo[0]
      }
    }).then(response => {
      setElements(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }, [params.ativo, haschanged]); // Adicionando params.ativo e haschanged como dependências

  function print() {
    console.log("FORMS", forms)
  }

  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchImages = async () => {
      if (form?.form) {
        const newImageUrls:any = {};
        for (const key of Object.keys(form.form)) {
          const item = form.form[key];
          try {
            const response = await api.get('images/', {
              params: {
                questionkey: item.key,
                content_type: 'Asset',
                object_id: params.ativo[0]
              }
            });
            const Data = response.data;
            newImageUrls[item.key] = Data[0]?.image || '';
          } catch (error) {
            console.error(error);
          }
        }
        setImageUrls(newImageUrls);
      }
    };

    fetchImages();
  }, [form, params.ativo , hasChangedImage]); // Adicionando params.ativo, form e hasChangedImage como dependências

  return (
    <ToastProvider>
      <div className="flex min-h-screen w-full flex-col bg-background sm:gap-4 sm:py-4 sm:pl-6 sm:pr-6">
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
                  <Link href={`/sistema/projetos/${asset?.project}`}>Voltar ao projeto</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">{asset?.assetName}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main>
          {/* Titulo da página */}
          <section>
            <Card className="relative">
              <div className="flex items-center justify-between p-4">
                <CardHeader>
                  <CardTitle>{asset?.assetName}</CardTitle>
                </CardHeader>
              </div>
            </Card>
          </section>

          <section className='flex flex-row gap-4'>
            {/* Conteudo do formulário do Ativo */}
            <section className='flex-col basis-3/5'>
              <Card>
                <CardHeader>
                  <CardTitle>Formulário</CardTitle>
                </CardHeader>
                <div className={`overflow-hidden ${showMore ? 'h-auto' : 'h-96'}`}>
                  <div className='p-4'>
                  {asset?.form && (
                    <Sender params={{ id: asset?.form, asset: params.ativo[0], instance: 'Asset' , setHasChangedImage:setHasChangedImage , hasChangedImage:hasChangedImage  }} />
                  )}
                  </div>
                </div>
                <div className='flex flex-row items-center justify-center mt-4'>
                  <button
                    className="flex flex-row items-center justify-center mt-4 hover:text-muted-foreground"
                    onClick={toggleShowMore}
                  >
                    {showMore? <ChevronUp/> : <ChevronDown/>}
                    {showMore ? 'Mostrar menos' : 'Mostrar mais'}
                  </button>
                </div>
              </Card>
            </section>

            {/* Mosaico das imagens linkadas nas perguntas do ativo */}
            <section className="basis-2/5">  
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Mosaico de fotos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {form?.form && Object.keys(form.form).map((key) => {
                        const item = form.form[key];
                        const url = imageUrls[item.key];
                        console.log("Image", imageUrls)
                        if (url && url.startsWith("http")) {
                          return (
                          
                            <div className='row-1 min-h-44 hover:min-h-96' key={key}>
                              <img
                                alt="Product image"
                                className="aspect-square w-full rounded-md object-cover"
                                width={300}
                                height={300}
                                src={url}
                              />
                              <div className="text-center">{item.label}</div>
                            </div>
                          
                        );
                      }
                      return null;
                    })}
                  </div>
                  
                </CardContent>
              </Card>
            </section>

          </section>

          {/* Tabela de elementos linkados no ativo */}
          <section>
              <div className="flex flex-col gap-4 p-4">
                <Tabs defaultValue="all">
                  <TabsList className="p-2">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="active">Ativos</TabsTrigger>
                    <TabsTrigger value="archived">Arquivados</TabsTrigger>
                  </TabsList>

                  <AddElement forms={forms} />

                  <TabsContent value="all" className="p-4">
                    <DataTable columns={columns} data={elements} />
                  </TabsContent>
                  <TabsContent value="active" className="p-4">
                    <DataTable columns={columns} data={elementsStatusActive} />
                  </TabsContent>
                  <TabsContent value="archived" className="p-4">
                    <DataTable columns={columns} data={elementsStatusArchived} />
                  </TabsContent>
                </Tabs>
              </div> 
          </section>

        </main>

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
      </div>

    </ToastProvider>
  );
}
