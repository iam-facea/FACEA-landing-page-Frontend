export const HeroBanner = () => {
  return (
    <section className="relative bg-amber-50 text-black overflow-hidden">
      {/* Contenedor principal con padding y centrado */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
        {/* Etiqueta superior */}
        <span className="inline-block py-1 px-3 text-black text-5xl font-bold tracking-wider mb-6">
          ESCUELA SABÁTICA FACEA
        </span>

        {/* Título principal */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
          Fe que se estudia. <br className="hidden md:block" />
          <span className="text-blue-400">Amor que se vive.</span>
        </h1>

        {/* Botones de acción (CTAs) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-600/30">
            Únete este sábado
          </button>
          <button className="px-8 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold transition-colors">
            Ver salidas misioneras
          </button>
        </div>
      </div>
    </section>
  );
};
