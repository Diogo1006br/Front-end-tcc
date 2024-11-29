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
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,

} from "@/components/ui/sheet";

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

import Image from "next/image";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Label } from '@/components/ui/label';

//Interface
interface Props {
  params: { subitem: string };
}

interface Asset {
  id: string;
  assetName: string;
  form: string;
  project: string;
}

const ActionCell: React.FC<{ row: any }> = ({ row }) => {
  const TableContent = row.original;
  const [value, setValue] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant: 'default' | 'destructive' } | null>(null);

  const handleEdit = () => {
    setIsSheetOpen(true); // Abre o Sheet ao clicar em Editar
  };

  const handleSave = () => {
    console.log("Actions", TableContent);
    
    api.put(`/api/actions/${TableContent.id}/`, TableContent, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setToastMessage({ title: 'Sucesso', description: 'Ação salva com sucesso.', variant: 'default' });
        }
      })
      .catch((error) => {
        console.error(error);
        setToastMessage({ title: 'Erro', description: 'Falha ao salvar a ação. Tente novamente.', variant: 'destructive' });
      });
  };

  return (
    <>
      <ToastProvider>
        <Button variant="ghost" onClick={handleEdit}>
          Editar
        </Button>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full max-w-2xl p-6 mx-auto rounded-lg shadow-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Editar Ação</SheetTitle>
            </SheetHeader>

            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={TableContent.title}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Digite o título da ação"
                />
              </div>
              {/* Outros campos de edição podem ser adicionados aqui */}

              <SheetFooter className="flex justify-end">
                <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Salvar</Button>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>

        {toastMessage && (
          <Toast className={toastMessage.variant === 'destructive' ? 'bg-red-600' : 'bg-green-600'}>
            <ToastTitle>{toastMessage.title}</ToastTitle>
            <ToastDescription>{toastMessage.description}</ToastDescription>
            <ToastClose />
          </Toast>
        )}

        <ToastViewport />
      </ToastProvider>
    </>
  );
};

export default function Asset({ params }: Props) {
  // Variables
  const [subitem, setSubitem] = useState<Asset>();
  const [form, setForm] = useState<{ [key: string]: any } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState<{
    title: string;
    description: string;
    variant: 'default' | 'destructive';
  }>({
    title: '',
    description: '',
    variant: 'default',
  });

  const [showMore, setShowMore] = useState(false);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hasChangedImage, setHasChangedImage] = useState(false);

  // Hooks
  useEffect(() => {
    api.get(`/api/elements/${params.subitem[0]}`)
      .then(response => {
        setSubitem(response.data);

        api.get(`/api/forms/${response.data.form}`)
          .then(response => {
            setForm(response.data);
            console.log("FORMS", response.data.form);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }, [params.subitem]);


  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchImages = async () => {
      if (form?.form) {
        const newImageUrls: any = {};
        for (const key of Object.keys(form.form)) {
          const item = form.form[key];
          try {
            const response = await api.get('/api/images/', {
              params: {
                questionkey: item.key,
                content_type: 'Asset',
                object_id: params.subitem[0]
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
  }, [form, params.subitem, hasChangedImage]);

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
                  <Link href={`/sistema/projetos/${subitem?.project}`}>Voltar ao projeto</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">{subitem?.assetName}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main>
          <section>
            <Card className="relative">
              <div className="flex items-center justify-between p-4">
                <CardHeader>
                  <CardTitle>{subitem?.assetName}</CardTitle>
                </CardHeader>
              </div>
            </Card>
          </section>

          <section className='flex flex-row gap-4'>
            <section className='flex-col basis-3/5'>
              <Card>
                <CardHeader>
                  <CardTitle>Formulário</CardTitle>
                </CardHeader>
                <div className={`overflow-hidden ${showMore ? 'h-auto' : 'h-96'}`}>
                  <div className='p-4'>
                    {subitem?.form && (
                      <Sender params={{ id: subitem?.form, asset: params.subitem[0], instance: 'Element'}} />
                    )}
                  </div>
                </div>
                <div className='flex flex-row items-center justify-center mt-4'>
                  <button
                    className="flex flex-row items-center justify-center mt-4 hover:text-muted-foreground"
                    onClick={toggleShowMore}
                  >
                    {showMore ? <ChevronUp /> : <ChevronDown />}
                    {showMore ? 'Mostrar menos' : 'Mostrar mais'}
                  </button>
                </div>
              </Card>
            </section>

            <section className="basis-2/5">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Mosaico de fotos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {form?.form && Object.keys(form.form).map((key) => {
                      const item = form.form[key];
                      const url = imageUrls[item.key];
                      if (url && url.startsWith("http")) {
                        return (
                          <div className='row-1 min-h-44 hover:min-h-96' key={key}>
                            <Image
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
        </main>

        <ToastViewport />
        {showToast && (
          <Toast onOpenChange={setShowToast} variant={toastContent.variant}>
            <ToastTitle>{toastContent.title}</ToastTitle>
            <ToastDescription>{toastContent.description}</ToastDescription>
            <ToastClose />
          </Toast>
        )}
      </div>
    </ToastProvider>
  );
}
