import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-white px-4">
      {/* Imagem de fundo com sobreposição escura elegante */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-950/95 z-10" />
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
          alt="Paisagem de Moçambique"
          className="w-full h-full object-cover object-center transform scale-105 animate-pulse duration-10000"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto space-y-8">
        
        {/* Logótipo e Título */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            {/* Ícone com o alfinete e o avião */}
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              MoviTur
            </h1>
          </div>
          <p className="text-sm md:text-base text-slate-300 font-medium tracking-wide">
            Ecossistema Digital de Turismo de Moçambique
          </p>
        </div>

        {/* Cartão do Portal do Cliente */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:border-white/40">
          <div className="flex flex-col items-center space-y-6">
            
            <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="space-y-1 text-center">
              <h2 className="text-xl font-bold text-white tracking-wide">
                Portal do Cliente
              </h2>
            </div>

            <Link
              href="/login"
              className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-center shadow-lg shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Entrar
            </Link>

          </div>
        </div>

      </div>

      {/* Rodapé subtil */}
      <div className="absolute bottom-6 z-20 text-xs text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} MoviTur. Todos os direitos reservados.
      </div>
    </main>
  );
}
