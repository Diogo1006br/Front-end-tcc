'use client';

// Imports systems
import React from 'react';
import api from '@/Modules/Auth'; // Ajuste o caminho de importação conforme necessário
import { useMemo, useState, useEffect } from 'react';
import { useAppState } from "@/state/state"
import dynamic from 'next/dynamic';

// Imports Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { columns } from './columns';
import { DataTable } from '@/components/newtable/data-table';
import Link from "next/link";
import ProjectCard from '@/components/projects/projectCard';
import AddProject from '@/components/addproject/addproject';


import {Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


// Imports icons
import { 
  BookText, 
  BellRing, 
  Check, 
  FolderOpenDot, 
  ChevronRight, 
  SearchCheck, 
  Info, 
  Plus, 
  ListTodo, 
  CalendarDays, 
  Search, 
  FolderCheck 
} from "lucide-react"
import { 
  FiBell, 
  FiTrash, 
  FiCheck 
} from 'react-icons/fi';


// Imports types
interface Project {
  id: number;
  projectName: string;
  projectDescription: string;
  image: string;
  created_at: string;
}

interface NewData{
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  company: string;
}
interface projectnumber {
  project_numbers: number;
}

interface formnumber {
  form_numbers: number;
}

// Main component
export default function SystemHome() {
  // vars
  const [projects, setProjects] = useState<Project[]>([]);
  const id = undefined;
  const {resetForms} = useAppState(id);
  const [NewProjectFormData, setNewProjectFormData] = useState({
    project_name: '',
    project_description: '',
    members: [] as string[],
    image: null as File | null,
    updated_at: '',
    created_at: '',
  });
  

  const [newData, setNewData] = useState<NewData[]>([]);
  const [formNumber, setFormNumber] = useState({ form_numbers: 0 });
  const [projectNumber, setProjectNumber] = useState({ project_numbers: 0 });
  const [searchTermAll, setSearchTermAll] = useState("");
  const [hasChanged, setHasChanged] = useState(false);

  const filteredDataAll = newData.filter(item => {
    const createdDate = new Date(item.created_at);
    const dayCreated = ("0" + createdDate.getDate()).slice(-2);
    const monthCreated = ("0" + (createdDate.getMonth() + 1)).slice(-2);
    const yearCreated = createdDate.getFullYear();
    const formattedCreatedDate = `${dayCreated}/${monthCreated}/${yearCreated}`;

    const updatedDate = new Date(item.updated_at);
    const dayUpdated = ("0" + updatedDate.getDate()).slice(-2);
    const monthUpdated = ("0" + (updatedDate.getMonth() + 1)).slice(-2);
    const yearUpdated = updatedDate.getFullYear();
    const formattedUpdatedDate = `${dayUpdated}/${monthUpdated}/${yearUpdated}`;

    return (
        Object.values(item).some(s =>
            String(s).toLowerCase().includes(searchTermAll.toLowerCase())
        ) ||
        formattedCreatedDate.includes(searchTermAll) ||
        formattedUpdatedDate.includes(searchTermAll)
    );
  });



  // Hooks

  
  useEffect(() => {
    api.get('/api/recent_projects/')
      .then(response => setProjects(response.data))
      .catch(error => console.error(error));
  }, [hasChanged]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/api/forms/');
      setNewData(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    api.get('/api/form_numbers/')
      .then(response => setFormNumber(response.data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    api.get('/api/project_numbers/')
      .then(response => setProjectNumber(response.data))
      .catch(error => console.error(error));
  }, [hasChanged]);

  // Functions
  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/projects/', NewProjectFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  //Page return
  return (
    <main className='ml-4 mr-4 sm:mt-14'>
      {/* Cards de Projetos, Formulários e Ações */}
      <section className='grid grid-cols-1 sm:grid sm:grid-cols-3 sm:gap-4'>
        <Card className='shadow-md'>
          <CardHeader>
            <div className='flex items-center'>
              <CardTitle>{projectNumber.project_numbers}</CardTitle>
              <Link href="/sistema/projetos" className="flex ml-auto items-center justify-center w-6 h-6 rounded-full hover:text-muted-foreground">
                <FolderOpenDot/>
              </Link>
            </div>
            <CardDescription>Projetos</CardDescription>
          </CardHeader>
        </Card>

        <Card className='shadow-md'>
          <CardHeader>
            <div className='flex items-center'>
              <CardTitle>{formNumber.form_numbers}</CardTitle>
              <Link href="/sistema/formularios" className="flex ml-auto items-center justify-center w-6 h-6 rounded-full hover:text-muted-foreground">
                <FolderCheck/>
              </Link>
            </div>
            <CardDescription>Formulários</CardDescription>
          </CardHeader>
        </Card>

        <Card className='shadow-md'>
          <CardHeader>
            <div className='flex items-center'>
              <CardTitle>{projectNumber.project_numbers}</CardTitle>
              <Link href="#" className="flex ml-auto items-center justify-center w-6 h-6 rounded-full hover:text-muted-foreground">
                <Check/>
              </Link>
            </div>
            <CardDescription>Ações</CardDescription>
          </CardHeader>
        </Card>
      </section>
      
      {/* Projetos Recentes */}
      <section className='mt-5'>
        <div className='flex w-full justify-between'>
          <div>
            <CardTitle>Projetos Recentes</CardTitle>
          </div>
          <div className='flex items-end justify-end'>
            <AddProject setHasChanged={setHasChanged} hasChanged={hasChanged} />
          </div>
        </div>
        
        <div className=" md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 xl:grid xl:grid-cols-4">
        {Array.isArray(projects) && projects.map((project: Project) => (
        <ul key={project.id}>
        <ProjectCard
          project_name={project.projectName}
          project_description={project.projectDescription}
          project_image={`${process.env.NEXT_PUBLIC_MEDIAURL}${project.image}`}
          project_created_at={project.created_at}
          project_link={`/sistema/projetos/${project.id}`}
          project_delete={() => handleDeleteProject(project.id)}
        />
      </ul>
      ))}
        </div>


      </section>

      {/* Formularios e Alertas */}
      <section className='mt-5 mb-10 gap-4 lg:flex lg:flex-row'>
        <div className='lg:basis-2/3'>
          <Card>
            <CardHeader>
              <div className='flex items-center'>
                <CardTitle>Formulários</CardTitle>
                <Search className='w-6 items-end just ml-auto'/>
                <Input className='w-44 sm:w-64' placeholder='Buscar Formulários' onChange={(e) => setSearchTermAll(e.target.value)}/>
              </div>
              <div>
                <Link href="/sistema/formularios/NovoFormulario">
                  <Button 
                   onClick={resetForms}
                   >Novo Formulário</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className='lg:basis-2/3'>
              <DataTable columns={columns} data={filteredDataAll} />
            </CardContent>
          </Card>
        </div>
        <div className='lg:ml-auto'>
          <Card>
            <CardHeader>
              <CardTitle>Alertas e Notificações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex p-4 w-full bg-background rounded-md dark:bg-background border-none">
                <FiBell className="h-6 w-6 mr-4 items-center" />
                <div className="flex-1 h-18 w-full overflow-hidden">
                  <strong className="font-bold">Tipo do Alerta</strong>
                  <p className='text-xs line-clamp-2'>
                    Esta é a mensagem do alerta que pode continuar um monte se continuar escrevendo até onde ela vai.</p>
                  <div className="flex pt-2 ml-4 mr-2 items-center justify-end">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                    <span className="text-xs text-muted-foreground">
                      Criado em XX xX XX
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>

  );
}


