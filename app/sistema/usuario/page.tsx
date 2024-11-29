"use client"

// Imports system
import api from "@/Modules/Auth"
import { useEffect, useState, useRef } from "react";

// Imports components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"; // Importando o componente Image do Next.js

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
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
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast'; 

// Imports icons
import {
  User,
  LogOut,
  Lock,
} from "lucide-react"


export default function Users() {
  const [user, setUser] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    companyPosition: "",
    CPF: "",
    phone: "",
    birthDate: "",
    profileImage: null as File | null,
  });
  const [userPostData, setUserPostData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    companyPosition: "",
    CPF: "",
    phone: "",
    birthDate: "",
    profileImage: null as File | null,
  });
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant: 'default' | 'destructive' } | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
  
    setToastMessage({
      title: "Dica",
      description: "Após terminar de colocar seus dados, clique no botão Salvar.",
      variant: "default",
    });
  }, []);

  useEffect(() => {
    try {
      api.get('/api/users/').then(response => {
        const userdale = response.data.filter((userD: any) => userD.id == 2)[0];

        setUser({
          id: userdale.id,
          email: userdale.email,
          firstName: userdale.firstName,
          lastName: userdale.lastName,
          CPF: userdale.CPF,
          phone: userdale.phone,
          birthDate: userdale.birthDate,
          profileImage: null as File | null,
          companyPosition: userdale.companyPosition
        });
        setUserPostData({
          email: userdale.email,
          firstName: userdale.firstName,
          lastName: userdale.lastName,
          CPF: userdale.CPF,
          phone: userdale.phone,
          birthDate: userdale.birthDate,
          profileImage: null as File | null,
          companyPosition: userdale.companyPosition
        });
      });
    } catch (error) {
      console.error('Erro ao buscar sugestões de email:', error);
    }
  }, []);
  
  async function fetchImageAndSetPostData(imagePath: string, userData: any) {
    try {
      const imageUrl = `${process.env.NEXT_PUBLIC_APIURL}${imagePath}`;
      const res = await fetch(imageUrl);
      const blob = await res.blob();
  
      const fileName = imagePath.split('/').pop() || "profileImage.jpg";
      const file = new File([blob], fileName, { type: blob.type });
  
      const formData = new FormData();
      formData.append("profileImage", file);
  
      Object.keys(userData).forEach((key) => {
        if (key !== "profileImage") {
          formData.append(key, userData[key]);
        }
      });
  
      setUserPostData({
        ...userData,
        profileImage: file,
      });
    } catch (error) {
      console.error("Erro ao buscar a imagem:", error);
    }
  }
  
  function UserUpdate(){
    api.put(`/api/logeduser/${user.id}/`, userPostData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => {
      setUser(response.data);
      console.log(response.data);
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
    });
  }

  function Logout(){
    api.get(`/api/logout/` ,{
      headers: {
        'Content-Type': 'multipart/form-data',
    },
  }).then((response) => {
    window.location.href = "/login";
  });
  }

  const [errorMessage, setErrorMessage] = useState('');

  const validateDate = (date: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (validateDate(value)) {
      setUserPostData({...userPostData, birthDate: value});
      setErrorMessage('');
    } else {
      setErrorMessage('Formato inválido para data. Use o formato: YYYY-MM-DD.');
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setUserPostData((currentPostData) => ({ ...currentPostData, profileImage: file }));
      setUser((currentUser) => ({ ...currentUser, profileImage: file }));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const mascararCPF = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo que não é dígito
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o sexto e o sétimo dígitos
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca um hífen entre o nono e o décimo dígitos
  };

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
              <div className="basis-2/3">
                <CardHeader>
                  <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                </CardHeader>
              </div>
              <div className="flex basis-1/3 justify-end mr-8"></div>
            </div>
          </Card>

          <div className="h-screen p-4 bg-background rounded-md">      
            <div className="grid grid-cols-4 grid-rows-4 gap-4">
              <div className="row-span-4">
                <h1 className="font-bold text-xl">Informações da conta</h1>
                <div className="flex flex-col items-center justify-center">
                  <div className="relative group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }} // Oculta o input de arquivo
                    />
                    {imageUrl && imageUrl.trim() !== "http://localhost:8000/" ? (
                      <Image
                        src={imageUrl}
                        alt="Imagem carregada"
                        width={200}
                        height={200}
                        className="rounded-full bg-zinc-300 mt-10 mb-10 cursor-pointer"
                        onClick={handleIconClick}
                      />
                    ) : (
                      <User
                        width={200}
                        height={200}
                        className="rounded-full bg-zinc-300 mt-10 mb-10 cursor-pointer"
                        onClick={handleIconClick}
                      />
                    )}
                    <span className="absolute left-1/2 bottom-[-0px] transform -translate-x-1/2 text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-50 transition-opacity duration-300 whitespace-nowrap">
                      Troque a imagem
                    </span>
                  </div>
                
                  <div className="mt-10">
                    {user.firstName} {user.lastName}
                  </div>
                  <Button className="mt-10" onClick={Logout}> Fazer Logout <LogOut className="ml-4" /></Button>
                </div>
              </div>

              <div className="row-span-1 mt-10">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label className="font-bold" htmlFor="nome">Nome</Label>
                  <Input
                    type="string"
                    id="firstName"
                    value={user.firstName}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setUser((currentUser) => ({ ...currentUser, firstName: newValue }));
                      setUserPostData((currentPostData) => ({ ...currentPostData, firstName: newValue }));
                    }}
                  />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <Label className="font-bold" htmlFor="cpf">CPF</Label>
                  <Input
                    type="text"
                    id="cpf"
                    value={user.CPF}
                    maxLength={14}
                    onChange={(e) => {
                      const newValue = mascararCPF(e.target.value);
                      setUser((currentUser) => ({ ...currentUser, CPF: newValue }));
                      setUserPostData((currentPostData) => ({ ...currentPostData, CPF: newValue }));
                    }}
                  />
                </div>
              </div>

              <div className="row-span-1 mt-10">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label className="font-bold" htmlFor="sobrenome">Sobrenome</Label>
                  <Input
                    type="string"
                    id="sobrenoome"
                    value={user.lastName}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setUser((currentUser) => ({ ...currentUser, lastName: newValue }));
                      setUserPostData((currentPostData) => ({ ...currentPostData, lastName: newValue }));
                    }}
                  />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <Label className="font-bold" htmlFor="telefone">Telefone</Label>
                  <Input
                    type="number"
                    id="telefone"
                    value={user.phone}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setUser((currentUser) => ({ ...currentUser, phone: newValue }));
                      setUserPostData((currentPostData) => ({ ...currentPostData, phone: newValue }));
                    }}
                  />
                </div>
              </div>

              <div className="row-span-1 mt-10">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label className="font-bold" htmlFor="cargo">Cargo</Label>
                  <Input
                    type="string"
                    id="cargo"
                    value={user.companyPosition}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setUser((currentUser) => ({ ...currentUser, companyPosition: newValue }));
                      setUserPostData((currentPostData) => ({ ...currentPostData, companyPosition: newValue }));
                    }}
                  />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <Label className="font-bold" htmlFor="nascimento">Data Nascimento</Label>
                  <Input
                    type="date"
                    id="birthDate"
                    value={user.birthDate}
                    onChange={handleDateChange}
                  />
                </div>
              </div>

              <div className="col-span-3 col-start-2 row-start-2">
                <div className="grid w-full items-center gap-1.5">
                  <Label className="font-bold" htmlFor="permissao">Perfil de Permissão</Label>
                  <Input type="string" id="permissao" placeholder="Escolha" />
                </div>
              </div>

              <div className="col-start-2 row-start-3 space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label className="font-bold" htmlFor="cargo">Email</Label>
                  <Input
                    type="string"
                    id="cargo"
                    value={user.email}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setUser((currentUser) => ({ ...currentUser, email: newValue }));
                      setUserPostData((currentPostData) => ({ ...currentPostData, email: newValue }));
                    }}
                  />
                </div>
              </div>

              <div className="col-start-3 row-start-3 space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label className="font-bold" htmlFor="senha">Senha</Label>
                  *************
                </div>
                <Button><Lock className="mr-4" />Mudar Senha</Button>
              </div>

              <div className="col-start-4 row-start-3 space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">

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
