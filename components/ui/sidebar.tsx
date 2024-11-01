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
  useEffect(() => {
    api.get("logeduser/").then((response) => {
      setUser(response.data);
      setImageUrl(`${process.env.NEXT_PUBLIC_APIURL}${response.data.profileImage}`);
      console.log(response.data);

      if (response.data.profileImage) {
        fetchImageAndSetPostData(response.data.profileImage, response.data);
      }
    });
  },
  []);


  async function fetchImageAndSetPostData(imagePath: string, userData: any) {
    try {
      const imageUrl = `${process.env.NEXT_PUBLIC_APIURL}${imagePath}`;
      const res = await fetch(imageUrl);
      const blob = await res.blob();

      // Extraia o nome do arquivo do caminho da imagem
      const fileName = imagePath.split('/').pop() || "profileImage.jpg";
      const file = new File([blob], fileName, { type: blob.type });

      // Crie um objeto FormData e adicione o arquivo
      const formData = new FormData();
      formData.append("profileImage", file);

      // Adicione outros dados do usuário ao FormData
      Object.keys(userData).forEach((key) => {
        if (key !== "profileImage") {
          formData.append(key, userData[key]);
        }
      });

      // Atualize o userPostData com o FormData
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
                        href="/sistema/empresa"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg
                        text-muted-foreground transition-colors hover:text-card-foreground">
                          <Building2 className='w-5 h-5' />
                          <span className='sr-only'>Empresa</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side='right'>Empresa</TooltipContent>
                  </Tooltip>
                  <Tooltip>
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
                <Link href="#"
                      className="flex h-9 w-9 shrink-0 items-center justify-center
                      text-primary-foreground rounded-full">
                  <Image 
                    src="/logoReduzida.png" 
                    alt="Logo Reduzida"
                    width={24}   // Defina explicitamente a largura
                    height={24}  // Defina explicitamente a altura
                    className="w-6 h-6" // Estilos adicionais se necessários
                  />
                  <span className='sr-only'>Menu</span>
                </Link>
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
              <Link href="/sistema/empresa" className='flex items-center gap-4 px2.5 text-muted-foreground hover:text-foreground'>
                <Building2 className='w-5 h-5 transition-all' />
                Empresa
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

      {/* Config para sidebar no mobile */}
      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className='sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background  gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className='sm:hidden'>
                  <Menu className='w-5 h-5' />
                </Button>
            </SheetTrigger>
            <SunMoon className='ml-auto'/>
            <Switch id="darkMode" onCheckedChange={() => setIsDarkMode(true)}/>

            <SheetContent side="left" className='sm:max-w-x'>
              <nav className='"grid gap-6 text-lg font-medium'>

                <Link href="/sistema" className='flex items-center gap-4 px2.5 text-muted-foreground hover:text-foreground'>
                    <Home className='w-5 h-5 transition-all ' />
                    Inicio
                </Link>

                <Link href="/sistema/formularios" className='flex items-center gap-4 px2.5 text-muted-foreground hover:text-foreground'>
                    <FolderCheck className='w-5 h-5 transition-all ' />
                    Formulários
                </Link>

                <Link href="/sistema/projetos" className='flex items-center gap-4 px2.5 text-muted-foreground hover:text-foreground'>
                    <BookText className='w-5 h-5 transition-all ' />
                    Projetos
                </Link>

                <Link href="/sistema/empresa" className='flex items-center gap-4 px2.5 text-muted-foreground hover:text-foreground'>
                    <Building2 className='w-5 h-5 transition-all ' />
                    Empresa
                </Link>

                <Link href="/sistema/usuario" className='flex items-center gap-4 px2.5 text-muted-foreground hover:text-foreground'>
                    <User className='w-5 h-5 transition-all ' />
                    Usuário
                </Link>
                <Link href="/sistema/configuracoes" className='flex items-center gap-4 px2.5 text-muted-foreground hover:text-foreground'>
                    <Settings className='w-5 h-5 transition-all' /> 
                    Configurações
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
}




// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { SidebarItem } from "@/components/ui/sidebarItem";
// import { Home, User, Building2, BookText, FolderCheck, Bolt } from 'lucide-react';
// import api from "@/Modules/Auth";

// export function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [clientName, setClientName] = useState("Nome do Cliente");
//   const sidebarRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     api.get("logeduser/").then((response) => {
//       setClientName(response.data.firstName);
//     });
//   }, []);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleClickOutside = (event: MouseEvent) => {
//     if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div
//       ref={sidebarRef}
//       className={`flex h-screen border-0 dark:bg-darkSidebar bg-zinc-700 transition-all duration-500 ease-in-out ${isOpen ? 'w-56' : 'w-15'}`}
//     >
//       <div className={`flex flex-col items-center justify-between h-full text-gray-200 ${isOpen ? 'text-center' : 'text-left'}`}>
//         <div className={`p-2 mt-15 relative transition-all duration-300 ease-in-out ${isOpen ? 'text-center' : 'text-left'}`}>
//           <Button
//             size="icon"
//             aria-label="Home"
//             color="white"
//             className={`w-8 h-8 md:w-11 md:h-11 transition-all duration-300 ease-in-out ${isOpen ? 'w-8 h-8 ml-12 md:w-16 md:h-16 md:ml-8' : ''}`}
//             onClick={toggleSidebar}
//           >
//             <img src="/vercel.svg" alt="Logo" className="w-full h-full fill-foreground" />
//           </Button>

//           <div className={`flex items-center mt-2 ${isOpen ? 'ml-12 md:ml-8 ' : ''}`}>
        
//   {isOpen && (
//     <>
//       <h3 className="text-lg font-bold hidden md:block">{clientName}</h3>
//       <h6 className="text-sm font-bold block md:hidden ">{clientName}</h6>
//     </>
//   )}
// </div>


//           <div className={`border-t ${isOpen ? 'border-white' : 'border-transparent'} mt-1 pt-4 w-full ml-4 ${isOpen ? 'hidden md:block' : 'block md:hidden'}`}></div>



//         </div>

//         <div className="flex-1 flex flex-col items-center justify-center absolute inset-0 mt-35 ml-0.5 md:ml-1">
//           <ul className="flex flex-col gap-1 md:gap-8  w-full">
//             <Link href="/sistema" className="w-full">
//               <SidebarItem text="Inicio" Icon={Home} onClick={toggleSidebar} isOpen={isOpen} />
//             </Link>
//             <Link href='/sistema/formularios' className="w-full">
//               <SidebarItem text="Formulários" Icon={BookText} onClick={toggleSidebar} isOpen={isOpen} />
//             </Link>
//             <Link href='/sistema/projetos' className="w-full">
//               <SidebarItem text="Projetos" Icon={FolderCheck} onClick={toggleSidebar} isOpen={isOpen} />
//             </Link>
//             <Link href="/sistema/empresa" className="w-full">
//               <SidebarItem text="Empresa" Icon={Building2} onClick={toggleSidebar} isOpen={isOpen} />
//             </Link>
//             <Link href="/sistema/usuario" className="w-full">
//               <SidebarItem text="Usuário" Icon={User} onClick={toggleSidebar} isOpen={isOpen} />
//             </Link>
//             <Link href="/sistema/configs" className="w-full">
//               <SidebarItem text="Configurações" Icon={Bolt} onClick={toggleSidebar} isOpen={isOpen} />
//             </Link>
//           </ul>
//         </div>



//         <div className={`flex justify-center w-full p-2 ${isOpen ? 'mr-4' : 'mr-'} mt-auto`}>
//           {isOpen ? (
//             <img src="/logoCompleta.png" alt="Logo Completa" className="w-16 ml-12 md:w-32 md:ml-8 h-auto fill-foreground" />
//           ) : (
//             <img src="/logoReduzida.png" alt="Logo Reduzida" className="w-6 md:w-8  h-auto fill-foreground" />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// export default Sidebar;