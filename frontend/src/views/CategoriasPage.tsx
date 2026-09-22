'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Card, Badge } from '@/components';

import { categoriaService } from '@/services';

import type { Categoria } from '@/types';



export function CategoriasPage() {

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');



  useEffect(() => {

    categoriaService.listar()

      .then((data) => setCategorias(data.filter((c) => c.ativo)))

      .catch((e) => setError(e.message))

      .finally(() => setLoading(false));

  }, []);



  return (

    <div>

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-primary-dark">Categorias</h2>

        <p className="text-gray-500">Explore os tipos de experiencia turistica em Mocambique</p>

      </div>



      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}



      {loading ? (

        <p className="text-gray-500 text-center py-8">A carregar...</p>

      ) : categorias.length === 0 ? (

        <p className="text-gray-500 text-center py-8">Nenhuma categoria disponivel.</p>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {categorias.map((cat) => (

            <Link key={cat.id} href={`/cliente/destinos?categoriaId=${cat.id}`}>

              <Card className="h-full hover:shadow-lg transition-shadow">

                <div className="flex items-start justify-between gap-2 mb-2">

                  <h3 className="text-lg font-semibold text-primary-dark">{cat.nome}</h3>

                  <Badge>{cat.tipoExperiencia}</Badge>

                </div>

                <p className="text-sm text-gray-600">{cat.descricao || 'Ver destinos desta categoria'}</p>

              </Card>

            </Link>

          ))}

        </div>

      )}

    </div>

  );

}

