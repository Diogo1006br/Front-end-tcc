import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import api from '@/Modules/Auth'; // Ajuste o caminho de importação conforme necessário

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast'; // Ajuste o caminho de importação conforme necessário

export default function SheetNew({ setHasChanged, hasChanged }: { setHasChanged: (value: boolean) => void, hasChanged: boolean }) {
  const [emailSuggestions, setEmailSuggestions] = useState<any | null>(null);
  const [NewProjectFormData, setNewProjectFormData] = useState({
    projectName: '',
    projectDescription: '',
    members: [] as string[],
    image: null as File | null,
    modified_at: '',
    created_at: '',
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [value, setValue] = useState('');
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant: 'default' | 'destructive' } | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    try {
      api.get('/api/users/').then(response => setEmailSuggestions(response.data));
    } catch (error) {
      console.error('Erro ao buscar sugestões de email:', error);
    }
  }, []);

  const getSuggestions = (inputValue: string) => {
    const normalizedInput = inputValue.trim().toLowerCase();
    if (!normalizedInput) return [];
    const suggestionsArray = emailSuggestions || [];
    return suggestionsArray
      .filter((email: any) => email.email.toLowerCase().includes(normalizedInput))
      .map((email: any) => email.email);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

  const addMember = () => {
    if (!validateEmail(value)) {
      setToastMessage({ title: 'Erro', description: 'Formato de email inválido.', variant: 'destructive' });
      return;
    }

    const suggestedEmails = emailSuggestions && emailSuggestions.length > 0 ? emailSuggestions.map((email: any) => email.email.toLowerCase()) : [];

    if (value && suggestedEmails.includes(value.toLowerCase())) {
      setNewProjectFormData(prev => ({
        ...prev,
        members: [...prev.members, value]
      }));
      setValue('');
      setSuggestions([]);
      setToastMessage({ title: 'Sucesso', description: 'Membro adicionado com sucesso.', variant: 'default' });
    } else {
      setToastMessage({ title: 'Erro', description: 'Email não encontrado na lista de sugestões.', variant: 'destructive' });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue(value);
    setSuggestions(getSuggestions(value));
  };

  const handleSuggestionClick = (email: string) => {
    if (!NewProjectFormData.members.includes(email)) {
      setNewProjectFormData(prev => ({
        ...prev,
        members: [...prev.members, email]
      }));
      setValue('');
      setSuggestions([]);
      setToastMessage({ title: 'Sucesso', description: 'Membro adicionado com sucesso.', variant: 'default' });
    }
  };

  const handleRemoveMember = (email: string) => {
    setNewProjectFormData(prev => ({
      ...prev,
      members: prev.members.filter(member => member !== email)
    }));
  };

  const validateFormFields = (formData: any) => {
    if (!formData.projectName || !formData.projectDescription) {
      setToastMessage({ title: 'Erro', description: 'Nome e descrição do projeto são obrigatórios.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleMemberAddition = (value: string) => {
    if (!validateEmail(value)) {
      setToastMessage({ title: 'Erro', description: 'Formato de email inválido.', variant: 'destructive' });
      return false;
    }
    const suggestedEmails = emailSuggestions && emailSuggestions.length > 0 ? emailSuggestions.map((email: any) => email.email.toLowerCase()) : [];
    if (value && suggestedEmails.includes(value.toLowerCase())) {
      setNewProjectFormData((prev: any) => ({
        ...prev,
        members: [...prev.members, value]
      }));
      setValue('');
      setSuggestions([]);
      setToastMessage({ title: 'Sucesso', description: 'Membro adicionado com sucesso.', variant: 'default' });
      return true;
    } else {
      setToastMessage({ title: 'Erro', description: 'Email não encontrado na lista de sugestões.', variant: 'destructive' });
      return false;
    }
  };

  const handleApiResponse = (response: any) => {
    if (response.status === 201 || response.status === 200) {
      setToastMessage({ title: 'Sucesso', description: 'Projeto criado com sucesso.', variant: 'default' });
      setNewProjectFormData({
        projectName: '',
        projectDescription: '',
        members: [],
        image: null,
        modified_at: '',
        created_at: '',
      });
      setHasChanged(!hasChanged);
      setIsSheetOpen(false);
    } else {
      const errorMessages: Record<number, string> = {
        400: 'Erro ao criar o projeto.',
        401: 'Você não tem permissão para criar um projeto.',
        403: 'Você não tem permissão para criar um projeto.',
        404: 'Erro ao criar o projeto.',
        500: 'Erro ao criar o projeto.',
      };
      setToastMessage({ title: 'Erro', description: errorMessages[response.status] || 'Erro ao criar o projeto.', variant: 'destructive' });
    }
  };

  const handleAddProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateFormFields(NewProjectFormData)) return;

    if (value && !handleMemberAddition(value)) return;

    try {
      const response = await api.post('/api/projects/', NewProjectFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleApiResponse(response);
    } catch (error) {
      console.error('Erro ao criar o projeto:', error);
      setToastMessage({ title: 'Erro', description: 'Erro ao criar o projeto.', variant: 'destructive' });
    }
  };

  return (
    <ToastProvider>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="mb-2 mr-8">Novo Projeto</Button>
        </SheetTrigger>
        <SheetContent className="bg-white text-black dark:text-white">
          <form onSubmit={handleAddProject}>
            <SheetHeader>
              <SheetTitle>Criar novo projeto</SheetTitle>
              <SheetDescription>
                Crie seu novo projeto preenchendo um nome e descrição
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-black dark:text-white">
                  Projeto
                </Label>
                <Input
                  type="text"
                  value={NewProjectFormData.projectName}
                  onChange={(e) => setNewProjectFormData({ ...NewProjectFormData, projectName: e.target.value })}
                  placeholder="Nome do Projeto"
                  className="col-span-3 bg-gray-200 text-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right text-black dark:text-white">
                  Descrição
                </Label>
                <Input
                  type="text"
                  value={NewProjectFormData.projectDescription}
                  onChange={(e) => setNewProjectFormData({ ...NewProjectFormData, projectDescription: e.target.value })}
                  placeholder="Descrição do Projeto"
                  className="col-span-3 bg-gray-200 text-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="members" className="text-right text-black dark:text-white">
                  Membros
                </Label>
                <div className="col-span-3">
                  <Input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Adicione email dos membros"
                    className="bg-gray-200 text-black"
                  />
                  <div>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="cursor-pointer hover:bg-gray-300"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap">
                    {NewProjectFormData.members.map((member, index) => (
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
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right text-black dark:text-white">
                  Imagem
                </Label>
                <Input
                  id="image"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewProjectFormData({ ...NewProjectFormData, image: e.target.files[0] });
                    }
                  }}
                  placeholder="Descrição do Projeto"
                  className="col-span-3 bg-gray-200 text-black"
                />
              </div>
            </div>
            <SheetFooter>
              <Button type="submit">Adicionar Projeto</Button>
            </SheetFooter>
          </form>
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
    </ToastProvider>
  );
}