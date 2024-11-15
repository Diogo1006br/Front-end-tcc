"use client";

import { Button } from "@/components/ui/button"; // Importando botão do shadcn
import { DataTable } from "@/components/newtable/data-table";
import { columns } from "./columns";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';
import Image from 'next/image'; // Importando o componente Image do Next.js para otimização
import api from "@/Modules/Auth";
import { useState, useEffect, useRef, useCallback } from "react";
import { TableContent } from './columns';
interface Props {
  params: { projetoconfig: string };
}

export default function ProjectUsers({ params }: Props) {
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

  interface Projects {
    projectName: string;
    projectDescription: string;
    members: string[];
    image: File | null;
    user_Data: string[];
    owner: string;
  }

  const [project, setProject] = useState<Projects>({
    projectName: '',
    projectDescription: '',
    members: [],
    user_Data: [],
    image: null,
    owner: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const Users: [] = [];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [emailSuggestions, setEmailSuggestions] = useState<{ results: { email: string }[] } | null>(null);

  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant: 'default' | 'destructive' } | null>(null);

  const data: TableContent[] = Array.isArray(project?.user_Data)
    ? project.user_Data.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        company: item.company,
        registrationDate: item.registrationDate,
        lastConnection: item.lastConnection,
      }))
    : [];
  // Função encapsulada no useCallback para evitar recriações desnecessárias
  const fetchImageAndSetPostData = useCallback(async (imagePath: string, ProjectData: any) => {
    try {
      const imageUrl = `${imagePath}`;
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const fileName = imagePath.split('/').pop() || "profileImage.jpg";
      const file = new File([blob], fileName, { type: blob.type });

      const updatedProject: Projects = {
        ...ProjectData,
        image: file,
        members: ProjectData.members || [],
        projectName: ProjectData.projectName || '',
        projectDescription: ProjectData.projectDescription || '',
        owner: ProjectData.owner || ''
      };

      setProject(updatedProject);
    } catch (error) {
      console.error("Erro ao buscar a imagem:", error);
    }
  }, []);

  const [isOverlayActive, setOverlayActive] = useState(false);

  useEffect(() => {
    // Solicitação GET para obter os dados do projeto
    api
      .get(`projects/${params.projetoconfig}`)
      .then((response) => {
        if (response.data.image) {
          fetchImageAndSetPostData(response.data.image, response.data);
        }
        setProject(response.data);
        setImageUrl(`${response.data.image}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [params.projetoconfig, fetchImageAndSetPostData]);

  useEffect(() => {
    try {
      api.get('users/').then(response => setEmailSuggestions(response.data));
    } catch (error) {
      console.error('Erro ao buscar sugestões de email:', error);
    }
  }, []);

  const getSuggestions = (inputValue: string) => {
    const normalizedInput = inputValue.trim().toLowerCase();
    if (!normalizedInput) return [];
    // Assume que emailSuggestions é um objeto com uma propriedade results que é um array
    const suggestionsArray = emailSuggestions?.results || [];
    return suggestionsArray
      .filter(email => email.email.toLowerCase().includes(normalizedInput))
      .map(email => email.email);
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

  const addMember = () => {
    if (!validateEmail(value)) {
      setToastMessage({ title: 'Erro', description: 'Formato de email inválido.', variant: 'destructive' });
      return;
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addMember();
      if (!validateEmail(value)) {
        setToastMessage({ title: 'Erro', description: 'Formato de email inválido.', variant: 'destructive' });
      }
    }
  };

  const handleSuggestionClick = (email: string) => {
    if (project.members.includes(email)) {
      setToastMessage({ title: 'Erro', description: 'Membro já está no projeto.', variant: 'destructive' });
    } else {
      setProject(prev => {
        const updatedProject = {
          ...prev,
          members: [...prev.members, email]
        };
        return updatedProject;
      });
      setValue('');
      setSuggestions([]);
      setToastMessage({ title: 'Sucesso', description: 'Membro adicionado com sucesso.', variant: 'default' });
    }
  };

  const handleRemoveMember = (email: string) => {
    setProject(prev => ({
      ...prev,
      members: prev.members.filter(member => member !== email)
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setProject((currentPostData) => ({ ...currentPostData, image: file }));
    }
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
    setOverlayActive((prev) => !prev);
  };

  const handleSave = () => {
    api
      .put(`projects/${params.projetoconfig}/`, project, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setProject(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <ToastProvider>
      <div className="p-6 bg-gray-100 min-h-screen relative">
        <nav className="text-sm text-gray-500 mb-4">
          Dashboard &gt; Projetos &gt; Nome do projeto &gt; Configurações
        </nav>

        {isEditing && <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>}

        <div className={`relative z-50 flex items-start p-4 ${isEditing ? 'bg-white' : 'bg-gray-50'} rounded-lg shadow mb-6`}>
          <div className="relative group">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              disabled={!isEditing}
            />
            {imageUrl && imageUrl.trim() !== "http://localhost:8000/" ? (
              <Image
                src={imageUrl}
                alt="Imagem carregada"
                width={64}
                height={64}
                className={`w-16 h-16 rounded-md ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={isEditing ? handleIconClick : undefined}
              />
            ) : (
              <User
                width={64}
                height={64}
                className={`w-16 h-16 rounded-md ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={isEditing ? handleIconClick : undefined}
              />
            )}
            <span className={`absolute left-1/2 bottom-[-30px] transform -translate-x-1/2 bg-primary text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${isEditing ? '' : 'hidden'}`}>
              Troque a imagem
            </span>
          </div>

          <div className="ml-4 flex flex-col flex-grow">
            {isEditing ? (
              <div className="flex flex-col">
                <input
                  type="text"
                  value={project.projectName}
                  onChange={(e) => setProject((currentProject) => ({ ...currentProject, projectName: e.target.value }))}
                  className="text-lg font-semibold border-b border-gray-300 focus:outline-none mb-2"
                  placeholder="Nome do Projeto"
                />
                <input
                  type="text"
                  value={project.projectDescription}
                  onChange={(e) => setProject((currentProject) => ({ ...currentProject, projectDescription: e.target.value }))}
                  className="text-gray-500 border-b border-gray-300 focus:outline-none"
                  placeholder="Descrição do Projeto"
                />
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold">{project.projectName}</h2>
                <p className="text-gray-500">{project.projectDescription}</p>
              </>
            )}
          </div>

          <div className="ml-4 flex items-center mt-4">
            {isEditing ? (
              <Button variant="outline" onClick={handleSave}>
                Salvar
              </Button>
            ) : (
              <Button onClick={toggleEditing}>
                Editar
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mt-20 p-6">
          <div className="flex justify-start p-4 ">
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
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="cursor-pointer hover:bg-gray-200"
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex flex-wrap">
                      {project.members && project.members.length > 0 && (
                        project.members.map((member: string, index: number) => (
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
            <ToastViewport />
            {toastMessage && (
              <Toast variant={toastMessage.variant} open={!!toastMessage} onOpenChange={() => setToastMessage(null)}>
                <ToastTitle>{toastMessage.title}</ToastTitle>
                <ToastDescription>{toastMessage.description}</ToastDescription>
                <ToastClose />
              </Toast>
            )}
          </div>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </ToastProvider>
  );
}
