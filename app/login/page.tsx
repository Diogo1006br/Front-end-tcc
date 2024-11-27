'use client'

import React, { useState } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


import { RefreshCw  } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevenir o comportamento padrão de envio do formulário

    setLoading(true);
    try {
      const response = await fetch('https://gdif.site/api/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.status === 200) {
        setTimeout(() => setLoading(false), 1000);
        console.log(data);
        window.location.href = '/sistema';
      } else {
        setTimeout(() => setLoading(false), 1000);
        setMessage(data.message);
        setShowModal(true);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      setMessage('Ocorreu um erro ao fazer login.');
      setShowModal(true);
    }
  };
  
 

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-zinc-700">
      <div className="p-4">
      </div>
      <div className="bg-zinc-100 rounded flex flex-col items-center justify-center p-8 w-96">
        <div className="flex flex-col items-center w-full">
          <h1 className="text-zinc-800 font-bold text-xl">
            Acessar
          </h1>
          <p className="text-zinc-400 text-sm p-4">
            Entre com seu email e senha
          </p>
        </div>
        <form onSubmit={handleLogin} className='flex flex-col mt-8 p-4 w-full items-center '>
            <div className="w-full">
              <Label htmlFor="email">Email</Label>
              <Input type="email" value={email} id="email" placeholder="Email" onChange={handleEmailChange} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mt-8">
              <Label htmlFor="email">Senha</Label>
              <Input type="password" value={password} id="password" placeholder="Senha" onChange={handlePasswordChange} />
            </div>
            <div className="mt-8">
              <Button className="w-40"
                      type="submit" 
                      disabled={loading}>
                      {loading ? <RefreshCw className='animate-spin' size={16} /> : 'Entrar'}
              </Button>
          </div>
        </form>
        <div className="flex text-center mt-4 text-xs text-zinc-400">
          Não possui acesso? Contate um administrador
        </div>
        <div>
          <Button variant="link" className="text-blue-500 ">Contato</Button>
        </div>

      </div>
      

    </div>
  );
}
