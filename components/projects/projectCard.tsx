import React from 'react';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronRight, Trash, Car } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ProjectCardProps {
  // Defina as propriedades do componente aqui
  project_id: number;
  project_name: string;
  project_description: string;
  project_image: string;
  project_created_at: string;
  project_link: string;
  project_delete: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  const {
      project_name,
      project_description,
      project_image,
      project_created_at,
      project_link,
      project_delete,
  } = props;

    return (
    <Link href={project_link}>
      <Card className='shadow-lg mr-6 mt-4 max-h-32 min-h-24 min-w-64 hover:bg-zinc-100'>
          <div className='flex'>
                <div className='w-28 h-24 flex-shrink-0 items-center justify-center'>
                    <img className="w-full h-full object-cover" src={project_image} alt="Descrição da imagem" />
                </div>
                <div className='flex-grow flex flex-col justify-between'>
                    <div className='flex flex-col justify-between items-start h-full'>
                        <div className='ml-2 mt-1 mr-2 flex-grow'>
                            <h4 className="text-sm font-semibold">
                                {project_name}
                            </h4>
                            <p className='text-xs line-clamp-2'>
                                {project_description}
                            </p>
                        </div>
                        <div className="flex ml-auto mr-2 mb-2">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                            <span className="text-xs text-muted-foreground">
                                Criado em {project_created_at}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    </Link>
    );
};
          
export default ProjectCard;
