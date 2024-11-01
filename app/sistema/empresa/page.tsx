"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/newtable/data-table";
import { columns } from "./columns"; 
import api from "@/Modules/Auth";
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport } from "@/components/ui/toast";

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
  user_email: string[];
  logotipo?: File;
}

interface User {
  email: string;
  firstName: string;
  lastName: string;
  companyPosition: string;
  password: string;
}

interface EmailSuggestion {
  email: string;
}

interface EmailSuggestionsResponse {
  results: EmailSuggestion[];
}

export default function EmpresaPage() {
  const [company, setCompany] = useState<Company | undefined>();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<EmailSuggestion[]>([]);
  const [emailSuggestions, setEmailSuggestions] = useState<EmailSuggestionsResponse>({ results: [] });
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant: 'default' | 'destructive' } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [userPostData, setUserPostData] = useState<User | undefined>();
  const [hasUserAdd, setHasUserAdd] = useState(false);

  useEffect(() => {
    api.get(`companies/`)
      .then((response) => {
        if (response.data.image) {
          fetchImageAndSetPostData(response.data.image, response.data);
        }
        setCompany(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [hasUserAdd]);

  useEffect(() => {
    api.get('users/').then(response => setEmailSuggestions(response.data));
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

      // Crie um objeto do tipo Company e adicione a imagem
      const updatedCompany: Company = {
        ...CompanyData,
        logotipo: file,
        user_email: CompanyData.user_email || [],
        companyName: CompanyData.companyName || '',
        comercialEmail: CompanyData.comercialEmail || '',
        telephone: CompanyData.telephone || '',
        CNPJ: CompanyData.CNPJ || '',
        address: CompanyData.address || '',
        site: CompanyData.site || ''
      };

      // Atualize o estado da empresa com os novos dados
      setCompany(updatedCompany);
    } catch (error) {
      console.error("Erro ao buscar a imagem:", error);
    }
  }

  const getSuggestions = (inputValue: string) => {
    const normalizedInput = inputValue.trim().toLowerCase();
    if (!normalizedInput) return [];
    const suggestionsArray = emailSuggestions.results || [];
    return suggestionsArray.filter(email =>
      email.email.toLowerCase().includes(normalizedInput)
    );
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handlePostUser = () => {
    api.post('users/', userPostData)
      .then((response) => {
        if (response.status === 201) {
          setToastMessage({ title: 'Sucesso', description: 'Usuário criado com sucesso.', variant: 'default' });
          setHasUserAdd(!hasUserAdd);
        } else {
          setToastMessage({ title: 'Erro', description: 'Erro ao criar o usuário.', variant: 'destructive' });
        }
      })
      .catch((error) => {
        setToastMessage({ title: 'Erro', description: 'Erro ao criar o usuário.', variant: 'destructive' });
      });
  };

  const handleSave = () => {
    api.put(`companies/${company?.id}/`, company, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        if (response.status === 200) {
          setToastMessage({ title: 'Sucesso', description: 'Dados salvos com sucesso.', variant: 'default' });
        } else {
          setToastMessage({ title: 'Erro', description: 'Erro ao salvar os dados.', variant: 'destructive' });
        }
      })
      .catch((error) => {
        setToastMessage({ title: 'Erro', description: 'Erro ao salvar os dados.', variant: 'destructive' });
      });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setCompany((currentCompany) => ({ ...currentCompany, logotipo: file }) as Company | undefined);
    }
  };

  const handleSuggestionClick = (email: string) => {
    if (company?.user_email.includes(email)) {
      setToastMessage({ title: 'Erro', description: 'Membro já está no projeto.', variant: 'destructive' });
    } else {
      setCompany(prev => {
        if (!prev) return prev;
        const updatedCompany = {
          ...prev,
          user_email: [...prev.user_email, email]
        };
        return updatedCompany;
      });
      setValue('');
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
                <CardTitle>{company?.companyName || 'Nome da Empresa Indisponível'}</CardTitle>
                <CardDescription>Gerencie os dados da sua empresa</CardDescription>
              </CardHeader>
            </div>
            <div className="flex basis-1/3 justify-end">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline">Adicionar Membro</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Adicionar Membro</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <Input 
                        type="text" 
                        placeholder="Digite o email do membro" 
                        value={userPostData?.email || ''}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setUserPostData((currentUser) => ({ ...currentUser, email: newValue }) as User | undefined);
                        }}
                      />
                      <label className="block text-sm font-medium text-gray-700">Primeiro Nome</label>
                      <Input 
                        type="text" 
                        placeholder="Digite o primeiro nome do membro"
                        value={userPostData?.firstName || ''}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setUserPostData((currentUser) => ({ ...currentUser, firstName: newValue }) as User | undefined);
                        }}
                      />
                      <label className="block text-sm font-medium text-gray-700">Sobrenome</label>
                      <Input 
                        type="text" 
                        placeholder="Digite o sobrenome do membro"
                        value={userPostData?.lastName || ''}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setUserPostData((currentUser) => ({ ...currentUser, lastName: newValue }) as User | undefined);
                        }}
                      />
                      <label className="block text-sm font-medium text-gray-700">Cargo</label>
                      <Input 
                        type="text" 
                        placeholder="Digite o cargo do membro"
                        value={userPostData?.companyPosition || ''}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setUserPostData((currentUser) => ({ ...currentUser, companyPosition: newValue }) as User | undefined);
                        }}
                      />
                      <label className="block text-sm font-medium text-gray-700">Senha</label>
                      <Input 
                        type="password" 
                        placeholder="Digite a senha do membro"
                        value={userPostData?.password || ''}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setUserPostData((currentUser) => ({ ...currentUser, password: newValue }) as User | undefined);
                        }}
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Cancelar</Button>
                    <Button onClick={handlePostUser}>Salvar</Button>
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
            <div className="mt-4">
              <div className="border border-gray-300 p-4 rounded-lg bg-white">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                  <Input 
                    type="text" 
                    placeholder="Nome da Empresa" 
                    className="w-full" 
                    value={company?.companyName || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCompany((currentCompany) => ({ ...currentCompany, companyName: newValue }) as Company | undefined);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                  <Input 
                    type="text" 
                    placeholder="CNPJ" 
                    className="w-full" 
                    value={company?.CNPJ || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCompany((currentCompany) => ({ ...currentCompany, CNPJ: newValue }) as Company | undefined);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Site</label>
                  <Input 
                    type="text" 
                    placeholder="Site" 
                    className="w-full" 
                    value={company?.site || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCompany((currentCompany) => ({ ...currentCompany, site: newValue }) as Company | undefined);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email da Empresa</label>
                  <Input 
                    type="email" 
                    placeholder="Email da Empresa" 
                    className="w-full" 
                    value={company?.comercialEmail || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCompany((currentCompany) => ({ ...currentCompany, comercialEmail: newValue }) as Company | undefined);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone da Empresa</label>
                  <Input 
                    type="text" 
                    placeholder="Telefone da Empresa" 
                    className="w-full" 
                    value={company?.telephone || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCompany((currentCompany) => ({ ...currentCompany, telephone: newValue }) as Company | undefined);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Endereço da Empresa</label>
                  <Input 
                    type="text" 
                    placeholder="Endereço da Empresa" 
                    className="w-full" 
                    value={company?.address || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCompany((currentCompany) => ({ ...currentCompany, address: newValue }) as Company | undefined);
                    }}
                  />
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm mt-5 w-40 h-10">
                      Carregar logotipo
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
            <Card>
              <div className="rounded-lg shadow p-4 min-h-[calc(100%+20px)]">
                <DataTable columns={columns} data={company?.user_Data ?? []} />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        <ToastViewport />
        {showToast && (
          <Toast onOpenChange={setShowToast} variant={toastMessage?.variant}>
            <ToastTitle>{toastMessage?.title}</ToastTitle>
            <ToastDescription>{toastMessage?.description}</ToastDescription>
            <ToastClose />
          </Toast>
        )}
      </div>
    </ToastProvider>
  );
}