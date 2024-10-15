// pages/empresa.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Importar o seu componente de tabs
import { Button } from "@/components/ui/button"; // Botão do shadcn
import { Input } from "@/components/ui/input"; // Componente de input do shadcn
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"; // Componentes de select do shadcn
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { DataTable } from "@/components/newtable/data-table";
import { columns } from "./columns"; 
import api from "@/Modules/Auth";

import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport } from "@/components/ui/toast"; // Import Toast components
import { set } from "date-fns";

interface Company {
  id: string;
  companyName: string;
  users: [];
  CNPJ: string;
  site: string;
  comercialEmail: string;
  telephone: string;
  address: string;
  user_Data: string[];
  user_email: string[]; // Update the type to string[]
  logotipo?: File; // Add logotipo property
}

export default function EmpresaPage() {
  const [company, setCompany] = useState<Company | undefined>();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant: 'default' | 'destructive' } | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Para fazer uma solicitação GET
    api
      .get(`companies/`)
      .then((response) => {
        if (response.data.image) {
          fetchImageAndSetPostData(response.data.image, response.data);
        }
        setCompany(response.data);
        console.log(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    try {
      api.get('users/').then(response => setEmailSuggestions(response.data));
    } catch (error) {
      console.error('Erro ao buscar sugestões de email:', error);
    }
  }, []);

  useEffect(() => {
    if (toastMessage) {
      setShowToast(true);
    }
  }, [toastMessage]);

  async function fetchImageAndSetPostData(imagePath: string, CompanyData: any) {
    try {
      const imageUrl = `${imagePath}`;
      const res = await fetch(imageUrl);
      const blob = await res.blob();

      // Extraia o nome do arquivo do caminho da imagem
      const fileName = imagePath.split('/').pop() || "profileImage.jpg";
      const file = new File([blob], fileName, { type: blob.type });

      // Crie um objeto do tipo Projects e adicione a imagem
      const updatedCompany: Company = {
        ...CompanyData,
        Logotipo: file,
        user_email: CompanyData.user_email || [],
        companyName: CompanyData.companyName || '',
        comercialEmail: CompanyData.comercialEmail || '',
        telephone: CompanyData.telephone || '',
        CNPJ: CompanyData.CNPJ || '',
        address: CompanyData.address || '',
        site: CompanyData.site || ''
      };

      // Atualize o estado do projeto com os novos dados
      setCompany(updatedCompany);
    } catch (error) {
      console.error("Erro ao buscar a imagem:", error);
    }
  }

  const handleSave = () => {
    console.log("Company", company)
    api.put(`companies/${company?.id}/`, company, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setToastMessage({ title: 'Sucesso', description: 'Dados salvos com sucesso.', variant: 'default' });
        } else {
          setToastMessage({ title: 'Erro', description: 'Erro ao salvar os dados.', variant: 'destructive' });
        }
      })
      .catch((error) => {
        console.error(error);
        setToastMessage({ title: 'Erro', description: 'Erro ao salvar os dados.', variant: 'destructive' });
      });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setCompany((currentComapany) => ({ ...currentComapany, logotipo: file }) as Company | undefined);
      console.log(file);
    }
  };

  const getSuggestions = (inputValue: string) => {
    const normalizedInput = inputValue.trim().toLowerCase();
    if (!normalizedInput) return [];
    // Assume que emailSuggestions é um objeto com uma propriedade results que é um array
    const suggestionsArray = emailSuggestions.results || [];
    return suggestionsArray.filter(email =>
      email.email.toLowerCase().includes(normalizedInput)
    );
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue(value);
    setSuggestions(getSuggestions(value));
  };

  const handleSuggestionClick = (email: string) => {
    if (company?.user_email.includes(email)) {
      setToastMessage({ title: 'Erro', description: 'Membro já está no projeto.', variant: 'destructive' });
    } else {
      setCompany(prev => {
        const updatedCompany = {
          ...prev,
          user_email: [...prev.user_email, email]
        };
        console.log(updatedCompany.user_email); // Log após a atualização do estado
        return updatedCompany;
      });
      setValue('');
      setSuggestions([]);
      setToastMessage({ title: 'Sucesso', description: 'Membro adicionado com sucesso.', variant: 'default' });
    }
  };

  const addMember = () => {
    if (!validateEmail(value)) {
      setToastMessage({ title: 'Erro', description: 'Formato de email inválido.', variant: 'destructive' });
      return;
    }
  }

  const handleRemoveMember = (email: string) => {
    setCompany(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        user_email: prev.user_email.filter(member => member !== email) as string[]
      };
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addMember();
      if (!validateEmail(value)) {
        setToastMessage({ title: 'Erro', description: 'Formato de email inválido.', variant: 'destructive' });
      }
    }
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <ToastProvider>
      <div className="p-6 bg-gray-100 min-h-screen">
        <Card x-chunk="dashboard-06-chunk-0" className="relative">
          <div className="flex items-center">
            <div className="basis-2/3">
              <CardHeader>
                <CardTitle>{company?.companyName}</CardTitle>
                <CardDescription>Gerencie os dados da sua empresa</CardDescription>
              </CardHeader>
            </div>
            <div className="flex basis-1/3 justify-end mr-8">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline">+ Adicionar Membro</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Adicionar Membro</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <div className="col-span-3">
                      <Input
                        type="text"
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Adicione email dos membros"
                      />
                      <div>
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion.email)}
                            className="cursor-pointer hover:bg-gray-200"
                          >
                            {suggestion.email}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap">
                        {company?.user_email && company?.user_email.length > 0 && (
                          company?.user_email.map((member: string, index: number) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                            >
                              {member}
                              <button
                                type="button"
                                onClick={() => handleRemoveMember(member)}
                                className="ml-2 text-red-500"
                              >
                                &times;
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                  <SheetFooter>
                    <Button variant="outline" onClick={handleCloseSheet}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>Salvar</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </Card>
        <Tabs defaultValue="empresa" className="mt-4">
          <TabsList>
            <TabsTrigger value="empresa">Empresa</TabsTrigger>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          </TabsList>
          <TabsContent value="empresa">
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Configurações da Conta</h2>
              <div className="border border-gray-300 p-4 rounded-lg bg-white">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                  <Input type="text" placeholder="Nome da Empresa" className="w-full" value={company?.companyName}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCompany((currentComapany) => ({ ...currentComapany, companyName: newValue }) as Company | undefined);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                  <Input type="text" placeholder="CNPJ" className="w-full" value={company?.CNPJ}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCompany((currentComapany) => ({ ...currentComapany, CNPJ: newValue }) as Company | undefined);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Site</label>
                  <Input type="text" placeholder="Site" className="w-full" value={company?.site}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCompany((currentComapany) => ({ ...currentComapany, site: newValue }) as Company | undefined);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email da Empresa</label>
                  <Input type="email" placeholder="Email da Empresa" className="w-full" value={company?.comercialEmail}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCompany((currentComapany) => ({ ...currentComapany, comercialEmail: newValue }) as Company | undefined);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone da Empresa</label>
                  <Input type="text" placeholder="Telefone da Empresa" className="w-full" value={company?.telephone}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCompany((currentComapany) => ({ ...currentComapany, telephone: newValue }) as Company | undefined);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Endereço da Empresa</label>
                  <Input type="text" placeholder="Endereço da Empresa" className="w-full" value={company?.address}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCompany((currentComapany) => ({ ...currentComapany, address: newValue }) as Company | undefined);
                    }}

                  />
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-grow">

                    <label className="block text-sm font-medium">Plano</label>

                    <Select>
                      <SelectTrigger className="w-full h-10 bg-muted" />
                      <SelectContent>
                        <SelectItem value="plano1">Plano 1</SelectItem>
                        <SelectItem value="plano2">Plano 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm">
                          Carregar logotipo
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button className="bg-black text-white mt-5 w-40 h-10" onClick={handleSave}>Salvar</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        <TabsContent value="usuarios">
          <div className="p-6  min-h-screen">
            <div className=" rounded-lg shadow mt-4">
            <DataTable columns={columns} data={company?.user_Data} />
            </div>
          </div>
          </TabsContent>
        </Tabs>
        <ToastViewport />
        {showToast && (
          <Toast
            onOpenChange={setShowToast}
            variant={toastMessage?.variant}
          >
            <ToastTitle>{toastMessage?.title}</ToastTitle>
            <ToastDescription>{toastMessage?.description}</ToastDescription>
            <ToastClose />
          </Toast>
        )}
      </div>
    </ToastProvider>
  );
}