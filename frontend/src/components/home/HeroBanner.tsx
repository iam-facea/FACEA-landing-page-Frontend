export const HeroBanner = () => {
  return (
    // Tailwind CSS: section spacing, responsive typography and button states.
    <section
      id="inicio"
      className="reveal active relative overflow-hidden px-8 pb-20 pt-32 md:pb-32 md:pt-48"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        {/* Vite asset import + React JSX interpolation in src={...}. */}
        <div className="mb-12 flex h-24 w-24 items-center justify-center md:h-32 md:w-32">
          <img
            alt="IAM FACEA Official Brandmark"
            className="h-full w-full scale-150 object-contain"
            /*src={faceaLogo}*/
          />
        </div>

        <h1 className="mb-6 text-5xl font-extrabold tracking-tighter text-[#0d153b] md:text-7xl">
          IAM FACEA
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-xl font-light leading-relaxed text-[#46464e] md:text-2xl">
          Instituto de alumnos misioneros de la facultad de ciencias económicas
          y la administración
        </p>

        <div className="flex flex-col gap-4 md:flex-row">
          <button
            className="rounded-xl bg-[#10183e] px-8 py-4 font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-[1.03]"
            type="button"
          >
            Involúcrate
          </button>
          <button
            className="rounded-xl bg-[#e8e8ea] px-8 py-4 font-semibold text-[#0d153b] transition-all duration-300 hover:scale-[1.03] hover:bg-[#e2e2e4]"
            type="button"
          >
            Conoce más
          </button>
        </div>
      </div>
    </section>
  );
};
