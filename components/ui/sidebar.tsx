'use client';
// Imports systems
import { useState } from 'react';
import { useEffect } from 'react';
import api from "@/Modules/Auth";
import Image from 'next/image';
//Imports Components
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Switch } from "@/components/ui/switch"

import {TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent 
}
from '@/components/ui/tooltip';

import {Sheet,
  SheetContent,
  SheetTrigger  
} 
from '@/components/ui/sheet';

// Imports icons
import { 
  Menu, 
  Home, 
  User, 
  Building2, 
  BookText, 
  FolderCheck, 
  SunMoon,
  Clapperboard,
  Settings 
} from 'lucide-react';


export function Sidebar() {
  //Vars
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [user, setUser] = useState({
    id: "",
    email: "",
    company: "",
    firstName: "",
    lastName: "",
    companyPosition: "",
    CPF: "",
    phone: "",
    birthDate: "",
    profileImage: null as File | null,
  });

  //Hooks
  
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
    } catch (error) {
      console.error("Erro ao buscar a imagem:", error);
    }
  }
  

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark', !isDarkMode);
    console.log('Dark Mode:', isDarkMode);
  };

  return (
    <div className="flex flex-col bg-muted/40 ">

      {/* Config para Header Desktop */}
      <header className='sticky top-0 p-4 z-20 hidden bg-background sm:flex flex-col w-full items-end justify-end '>
        <nav className='flex flex-row gap-4'>
          <SunMoon className='ml-auto'/>
          <Switch 
            id="darkMode"
            onCheckedChange={() => handleToggleDarkMode()} />
        </nav>
      </header>
      
      {/* Config para SideBar Desktop */}
      <Sheet>
        <SheetTrigger asChild>
            {/* Conteudo da Sidebar Fechada */}
            <aside className='fixed inset-y-0 left-0 z-20 hidden w-14 border-r-2 bg-sidebar text-sidebar-foreground sm:flex flex-col'>
              <nav className='flex flex-col items-center gap-4 px-2 py-5'>
                <TooltipProvider>
                  <Link href="/sistema/usuario" className="flex h-9 w-9 shrink-0 items-center justify-center text-primary-foreground rounded-full mb-10">
                    {imageUrl && imageUrl.trim() !== "http://localhost:8000/" ? (
                      <Image
                        src={imageUrl}
                        alt="Uploaded"
                        width={36}
                        height={36}
                        className="rounded-full bg-zinc-300"
                      />
                    ) : (
                      <User width={36} height={36} className="rounded-full bg-zinc-300 mt-10 mb-10" />
                    )}
                    <span className='sr-only'>Menu</span>
                  </Link>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link 
                        href="/sistema"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg
                        text-muted-foreground transition-colors hover:text-card-foreground">
                          <Home className='w-5 h-5' />
                          <span className='sr-only'>Inicio</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side='right'>Inicio</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <Link 
                        href="/sistema/formularios"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg
                        text-muted-foreground transition-colors hover:text-card-foreground">
                          <BookText className='w-5 h-5' />
                          <span className='sr-only'>Fromulários</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side='right'>Formulários</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <Link 
                        href="/sistema/projetos"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg
                        text-muted-foreground transition-colors hover:text-card-foreground">
                          <FolderCheck className='w-5 h-5' />
                          <span className='sr-only'>Projetos</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side='right'>Projetos</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link 
                        href="/sistema/usuario"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg
                        text-muted-foreground transition-colors hover:text-card-foreground">
                          <User className='w-5 h-5' />
                          <span className='sr-only'>Usuário</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side='right'>Usuário</TooltipContent>
                  </Tooltip>

                </TooltipProvider>
              </nav>
              <nav className='mt-auto flex flex-col items-center gap-4 px-2 py-5'>
              </nav>
            </aside>
        </SheetTrigger>
        {/* Conteudo da sidebar Aberta */}
        <SheetContent side='left'>
          <aside className='flex flex-col h-full '>
            <nav className='flex flex-col gap-4 px-2 py-5 '>
              <div className='flex flex-col items-center justify-center '>
                {imageUrl && imageUrl.trim() !== "http://localhost:8000/" ? (
                  <Image
                    src={imageUrl}
                    alt="Uploaded"
                    width={96}
                    height={96}
                    className="rounded-full bg-zinc-300"
                  />
                ) : (
                  <User width={60} height={60} className="rounded-full bg-zinc-300 mb-5" />
                )}
                <span className='text-muted-foreground text-sm border-b mb-10'>{user.firstName}</span>
              </div>
              <Link href="/sistema" className='flex items-center gap-4 px2.5 text-muted-foreground hover:text-foreground'>
                <Home className='w-5 h-5 transition-all' />
                Inicio
              </Link>
              <Link href="/sistema/formularios" className='flex items-center gap-4 px2.5 text-muted-foreground hover:text-foreground'>
                <FolderCheck className='w-5 h-5 transition-all' />
                Formulários
              </Link>
              <Link href="/sistema/projetos" className='flex items-center gap-4 px2.5 text-muted-foreground hover:text-foreground'>
                <BookText className='w-5 h-5 transition-all' />
                Projetos
              </Link>
              <Link href="/sistema/usuario" className='flex items-center gap-4 px2.5 text-muted-foreground hover:text-foreground'>
                <User className='w-5 h-5 transition-all' />
                Usuário
              </Link>
              <Link href="/sistema/configuracoes" className='flex items-center gap-4 px2.5 text-muted-foreground hover:text-foreground'>
                    <Settings className='w-5 h-5 transition-all' /> 
                    Configurações
                </Link>
            </nav>
            <nav className='flex flex-col items-center justify-center mt-auto mr-2 '>
           
            </nav>
          </aside>
        </SheetContent>
      </Sheet>
    </div>
  );
}