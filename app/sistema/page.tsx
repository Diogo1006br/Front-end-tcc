"use client";

// Imports systems
import React, { useMemo, useState, useEffect } from 'react';
import api from '@/Modules/Auth'; // Ajuste o caminho de importação conforme necessário
import { useAppState } from "@/state/state"
import Link from "next/link";

// Imports Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { columns } from './columns';
import { DataTable } from '@/components/newtable/data-table';
import AddProject from '@/components/addproject/addproject';

// Imports UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Imports icons
import {
  FolderOpenDot,
  FolderCheck,
  Search,
} from "lucide-react";

// Imports types
interface Project {
  id: number;
  projectName: string;
  projectDescription: string;
  image: string;
  created_at: string;
}

interface NewData {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  company: string;
}

export default function SystemHome() {
  const [projects, setProjects] = useState<Project[]>([]);
  const id = undefined;
  const { resetForms } = useAppState(id);
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
    const formattedCreatedDate = `${("0" + createdDate.getDate()).slice(-2)}/${("0" + (createdDate.getMonth() + 1)).slice(-2)}/${createdDate.getFullYear()}`;

    const updatedDate = new Date(item.updated_at);
    const formattedUpdatedDate = `${("0" + updatedDate.getDate()).slice(-2)}/${("0" + (updatedDate.getMonth() + 1)).slice(-2)}/${updatedDate.getFullYear()}`;

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

  const handleDeleteProject = async (id: number) => {
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className='ml-4 mr-4 sm:mt-14'>
      {/* Cards de Projetos e Formulários */}
      <section className='grid grid-cols-1 sm:grid sm:grid-cols-2 sm:gap-4'>
        {/* Card de Projetos */}
        <Card className='shadow-md'>
          <CardHeader>
            <div className='flex items-center'>
              <CardTitle>{projectNumber.project_numbers}</CardTitle>
              <Link href="/sistema/projetos" className="flex ml-auto items-center justify-center w-6 h-6 rounded-full hover:text-muted-foreground">
                <FolderOpenDot />
              </Link>
            </div>
            <CardDescription>Projetos</CardDescription>
          </CardHeader>
        </Card>

        {/* Card de Formulários */}
        <Card className='shadow-md'>
          <CardHeader>
            <div className='flex items-center'>
              <CardTitle>{formNumber.form_numbers}</CardTitle>
              <Link href="/sistema/formularios" className="flex ml-auto items-center justify-center w-6 h-6 rounded-full hover:text-muted-foreground">
                <FolderCheck />
              </Link>
            </div>
            <CardDescription>Formulários</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Projetos Recentes */}
      <section className='mt-5'>
        <div className='flex w-full justify-between'>
          <div className='flex items-end justify-end'>
            <AddProject setHasChanged={setHasChanged} hasChanged={hasChanged} />
          </div>
        </div>

        <div className="md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 xl:grid xl:grid-cols-4 gap-4 mt-4">
          {Array.isArray(projects) && projects.map((project: Project) => (
            <Card key={project.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <CardTitle className='truncate'>{project.projectName}</CardTitle>
                <CardDescription className='truncate'>{project.projectDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                {project.image && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_MEDIAURL}${project.image}`}
                    alt={project.projectName}
                    className='w-full h-40 object-cover mb-2 rounded'
                  />
                )}
                <p className='text-sm text-muted-foreground'>Criado em: {new Date(project.created_at).toLocaleDateString()}</p>
                <div className='flex mt-2'>
                  <Link href={`/sistema/projetos/${project.id}`}>
                    <Button variant="outline" className='mr-2'>Ver Projeto</Button>
                  </Link>
                  <Button variant="destructive" onClick={() => handleDeleteProject(project.id)}>Excluir</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Formularios - Ajuste para tabela ocupar toda a página */}
      <section className='mt-5 mb-10'>
        <Card className='w-full h-full'>
          <CardHeader>
            <div className='flex items-center'>
              <CardTitle>Formulários</CardTitle>
              <Search className='w-6 ml-auto mr-2' />
              <Input
                className='w-44 sm:w-64'
                placeholder='Buscar Formulários'
                onChange={(e) => setSearchTermAll(e.target.value)}
              />
            </div>
            <div className='mt-2'>
              <Link href="/sistema/formularios/NovoFormulario">
                <Button onClick={resetForms}>Novo Formulário</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            {/* Remova restrições e deixe a tabela ocupar todo o espaço */}
            <div className='w-full'>
              <DataTable columns={columns} data={filteredDataAll} />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
