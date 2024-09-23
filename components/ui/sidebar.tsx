'use client';
// Imports systems
import { useState } from 'react';
import { useEffect } from 'react';


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
  SunMoon 
} from 'lucide-react';


export function Sidebar() {
 
 

  return (
    <div className="flex flex-col bg-muted/40">

      {/* Config para Header Desktop */}
      <header className='fixed p-4 z-10 hidden bg-background/0 sm:flex flex-col w-full items-end justify-end '>
        <nav className='flex flex-row gap-4'>
          <SunMoon className='ml-auto'/>
          <Switch 
            id="darkMode"
            />
        </nav>
      </header>
      
      {/* Config para SideBar Desktop */}
      <Sheet>
        <SheetTrigger asChild>
            {/* Conteudo da Sidebar Fechada */}
            <aside className='fixed inset-y-0 left-0 z-20 hidden w-14 border-r-2 bg-background sm:flex flex-col'>
              <nav className='flex flex-col items-center gap-4 px-2 py-5'>
                <TooltipProvider>
                  <Link href="/sistema/usuario" className="flex h-9 w-9 shrink-0 items-center justify-center text-primary-foreground rounded-full mb-10">
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
                  <img src="/logoReduzida.png"  className="w-6 h-6" />
                  <span className='sr-only'>Menu</span>
                </Link>
              </nav>
            </aside>
        </SheetTrigger>
        {/* Conteudo da sidebar Aberta */}
        <SheetContent side='left'>
          <aside className='flex flex-col h-full'>
            <nav className='flex flex-col gap-4 px-2 py-5'>
              <div className='ml-24 mb-6'>
               
                <span className='text-muted-foreground text-sm border-b'></span>
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
            </nav>
            <nav className='mt-auto '>
              <img src="" alt="Logo Completa" className="w-32" />
            </nav>
          </aside>
        </SheetContent>
      </Sheet>

      {/* Config para sidebar no mobile */}
      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className='sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className='sm:hidden'>
                <Menu className='w-5 h-5' />
              </Button>
            </SheetTrigger>

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
              </nav>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
}