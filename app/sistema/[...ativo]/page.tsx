"use client";

import { useState, useEffect } from "react";
import api from "@/Modules/Auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { Sender } from "@/components/formbuilder/SendResponse";

interface Props {
  params: { ativo: string };
}

interface Asset {
  id: number;
  assetName: string;
  form: number;
  form_name: string;
  project: number;
}

export default function Asset({ params }: Props) {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const ativoId = Array.isArray(params.ativo) ? params.ativo[params.ativo.length - 1] : params.ativo;

        // Buscar ativo
        const assetResponse = await api.get(`assets/${ativoId}`);
        setAsset(assetResponse.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar os dados do ativo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.ativo]);

  return (
    <ToastProvider>
      <div className="flex min-h-screen w-full flex-col bg-background sm:gap-4 sm:py-4 sm:pl-6 sm:pr-6">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/sistema">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/sistema/projetos">Projetos</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/sistema/projetos/${asset?.project}`}>Voltar ao projeto</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">{asset?.assetName}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main>
          <section>
            <Card>
              <CardHeader>
                <CardTitle>{asset?.assetName || "Carregando ativo..."}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Carregando...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : asset ? (
                  <Sender params={{ id: String(asset.form), asset: String(asset.id), instance: "Asset" }} />
                ) : (
                  <p className="text-red-500">O ativo não foi encontrado.</p>
                )}
              </CardContent>
            </Card>
          </section>
        </main>

        <ToastViewport />
      </div>
    </ToastProvider>
  );
}
