"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Link, Search } from "lucide-react";
import api from "@/Modules/Auth";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { ImageDown, CheckCheck, MessageCirclePlus } from "lucide-react";

interface Actions {
  title: string;
  content_type:string;
  object_id: string;
  Instance: string;
  priority: string;
  deadline: string;
  responsible: string;
  place: string;
  description: string;  // Update the type to string[]
  user_hasCreated: string; 
  questionKey: string; 
  status: string;
  responsible_email: string;
  instance_name: string; 
}

interface Comments {
  content_type:string;
  object_id: string;
  Instance: string;
  user: string; 
  user_email: string;
  questionKey: string;
  comment:string;
}

export default function ImageUploader({ fileKey, file, params, setFile }: { fileKey: string, file: any, params: any, setFile: any }) {
  const [actionsPostData, setActionsPostData] = useState<Actions>({
    title: "",
    content_type:"",
    object_id:"",
    Instance: "",
    priority: "",
    deadline: "",
    responsible: "",
    place: "",
    description: "",  // Update the type to string[]
    user_hasCreated: "", 
    questionKey: "", 
    status: "",
    responsible_email:"",
    instance_name:"",
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showActionInputs, setShowActionInputs] = useState(false);
  const [commentsPostData , setCommentsPostData] = useState<Comments>({
    content_type:'',
    object_id:'',
    Instance:'',
    user:'', 
    user_email:'',
    questionKey:'',
    comment:'',
  });
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [actions , setActions] = useState<Actions[]>([]);
  const [assets , setAssets] = useState([]);
  const [element , setElement] = useState([]);
  const [searchTermArchived, setSearchTermArchived] = useState('');
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant: 'default' | 'destructive' } | null>(null);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [isReadyToPost, setIsReadyToPost] = useState(false);
  const [shouldPostComment, setShouldPostComment] = useState(false);
  const [comments , setComments] = useState<Comments[]>([]);

  const addImageToList = (url: string) => {
    setImageUrls((currentUrls: { [key: string]: string }) => {
      if (!currentUrls) return currentUrls;
      return {
        ...currentUrls,
        [fileKey]: url,
      };
    });
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addImageToList(URL.createObjectURL(e.target.files[0]));
    const newFile = e.target.files ? e.target.files[0] : null;
    if (newFile) {
      setFile((currentfile: { [key: string]: File }) => {
        if (!currentfile) return currentfile;
        return {
          ...currentfile,
          [fileKey]: newFile,
        };
      });
    }
  };

  useEffect(() => {
    api
      .get(`actions/`)
      .then((response) => {
        setActions(response.data)
        console.log(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  },[]);

  useEffect(() => {
    api
      .get(`assets/`)
      .then((response) => {
        setAssets(response.data)
        console.log(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  },[]);

  useEffect(() => {
    api
      .get(`elements/`)
      .then((response) => {
        setElement(response.data)
        console.log(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  },[]);

  useEffect(() => {
    api
      .get(`comments/`,{
        params: {
          object_id: params.asset,
          content_type: params.instance,
        }
      })
      .then((response) => {
        setComments(response.data)
        console.log(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  },[]);

  useEffect(() => {
    try {
      api.get('users/').then(response => setEmailSuggestions(response.data));
    }
  
    catch (error) {
      console.error('Erro ao buscar sugestões de email:', error);
    }
  }, []);

  const handleSaveAction = () => {
    console.log("Actions before update", actionsPostData);
    console.log("FileKey", fileKey);
    setActionsPostData((currentAction) => {
      if (!currentAction) return currentAction;
      return {
        ...currentAction,
        questionKey: fileKey,
      };
    });
    setIsReadyToPost(true);
  };

  
  const handleSaveComment = () => {
    console.log("Actions before update", commentsPostData);
    console.log("FileKey", fileKey);
    setCommentsPostData((currentComment) => {
      if (!currentComment) return currentComment;
      return {
        ...currentComment,
        questionKey: fileKey,
        object_id: params.asset,
        content_type: params.instance,
      };
    });
    setShouldPostComment(true);
  };

  useEffect(() => {
    if (shouldPostComment) {
      console.log("Actions to be posted", commentsPostData);
      api.post(`comments/`, commentsPostData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.status === 201) {
          setToastMessage({ title: 'Sucesso', description: 'Comentário criado com sucesso.', variant: 'default' });
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
        setToastMessage({ title: "Erro", description: "Falha ao criar o comentário. Tente novamente.", variant: "destructive" });
      })
      .finally(() => {
        setShouldPostComment(false);
      });
    }
  }, [shouldPostComment]);

  useEffect(() => {
    if (isReadyToPost && actionsPostData) {
      console.log("Actions to be posted", actionsPostData);
      api.post(`actions/`, actionsPostData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.status === 201) {
          setToastMessage({ title: 'Sucesso', description: 'Acao criada com sucesso.', variant: 'default' });
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
        setToastMessage({ title: "Erro", description: "Falha ao criar a ação. Tente novamente.", variant: "destructive", });
      })
      .finally(() => {
        setIsReadyToPost(false);
      });
    }
  }, [isReadyToPost, actionsPostData]);
  

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
    if (actionsPostData?.responsible_email?.includes(email)) {
      setToastMessage({ title: 'Erro', description: 'Membro já está atribuido a acao.', variant: 'error' });0
    } else {
      setActionsPostData(prev => {
        const updatedActions = {
          ...prev,
          responsible_email: email // Atribui o email como o único valor
        };
        console.log(updatedActions.responsible_email); // Log após a atualização do estado
        return updatedActions;
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
    setActionsPostData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        responsible_email: prev.responsible_email === email ? null : prev.responsible_email
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

  const handleValueChange = (newValue, type) => {
    setActionsPostData((currentAction) => {
      if (!currentAction) return currentAction; // Evitar retorno 'undefined'

      return {
        ...currentAction,
        object_id: newValue, // Atualiza o campo necessário com o novo valor
        content_type: type, // Atualiza o content_type com o tipo correto
      };
    });
  };

  const handleCommentClick = () => setShowCommentInput(!showCommentInput);
  const handleActionClick = () => setShowActionInputs(!showActionInputs);


  return (
  <div className="flex flex-col gap-4 ml-4 mr-4">
    <div className="flex flex-row justify-between text-center">
    </div>

   
    {imageUrls[fileKey] && (
        <div>
          {(() => {
            try {
              return <img src={imageUrls[fileKey]} alt="Imagem" className="mt-4 h-32 w-32" />;
            } catch (error) {
              return <img src={imageUrls[fileKey]} alt="Imagem" className="mt-4 h-32 w-32" />;
            }
          })()}
        </div>
      )}
   

{actions.map((action, index) => (
  action.questionKey === fileKey && (
    <div key={`${action.questionKey}-${index}`} className="mt-2 flex flex-row gap-4">
  <div className="flex flex-col w-1/3">
    <label className="block text-sm font-medium mb-0.5">Ação</label>
    <Label className="block w-full rounded-md shadow-sm">{action.title}</Label>
  </div>
  
  <div className="flex flex-col w-1/3">
    <label className="block text-sm font-medium mb-0.5">Responsável</label>
    <Label className="block w-full rounded-md shadow-sm">{action.responsible_email}</Label>
  </div>
  
  <div className="flex flex-col w-1/3">
    <label className="block text-sm font-medium mb-0.5">Prazo</label>
    <Label className="block w-full rounded-md shadow-sm">{action.deadline}</Label>
  </div>
</div>

  )
))}

    </div>
  );
}
