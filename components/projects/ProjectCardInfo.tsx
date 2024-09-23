import React from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import { BellRing, Check, FolderOpenDot, ChevronRight, SearchCheck , Info, Plus, ListTodo,CalendarDays , Filter  } from "lucide-react"

interface Props {
    // Defina as propriedades do componente aqui
    info: string
}

const ProjectCardInfo: React.FC<Props> = (props) => {
    const {
        info
    } = props;
    // Implemente o código do componente aqui

    return (
        <div className='flex-row basis-1/4'>
            <CardContent>
                <div className="flex flex-col items-center space-y-4 rounded-md border p-4 bg-zinc-100 shadow-lg h-32 dark:bg-zinc-300 dark:text-gray-300 group dark:bg-gradient-to-tl dark:from-gray-900 dark:to-gray-950 dark:border-r-2 dark:border-t-2 border-none overflow-hidden relative dark:shadow-lg dark:shadow-black">
                    <div className="flex justify-between w-full items-center">
                        <div className="flex items-center space-x-2">
                            <p className="text-lg font-medium leading-none">Itens</p>
                        </div>
                        <Filter size={24} />
                    </div>
                    <p className="text-3xl font-bold">56</p>
                </div>
            </CardContent>
        </div>
    );
};

export default ProjectCardInfo;