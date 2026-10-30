import faceaLogo from "../../assets/images/FACEA-logo.png";
import { Button } from "../ui/Button.tsx";

export const HeroBanner = () => {
  return (
    // Tailwind CSS: section spacing, responsive typography and button states.
    <section
      id="inicio"
      className="reveal active relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-32 md:pb-32 md:pt-48"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        {/* Logo con contenedor responsive que no desborda en móviles */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center sm:mb-10 sm:h-24 sm:w-24 md:h-32 md:w-32">
          <img
            alt="IAM FACEA Official Brandmark"
            className="h-full w-full object-contain drop-shadow-md"
            src={faceaLogo}
          />
        </div>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[#0d153b] sm:text-6xl md:text-7xl">
          IAM FACEA
        </h1>
        <p className="mx-auto mb-8 max-w-2xl px-2 text-base font-light leading-relaxed text-[#46464e] sm:mb-10 sm:text-xl md:text-2xl">
          Instituto de alumnos misioneros de la facultad de ciencias económicas
          y la administración
        </p>

        {/* Botones de acción: ancho completo en móvil para fácil pulsación táctil */}
        <div className="flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:gap-4">
          <a href="#actividades" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" fullWidth>
              Involúcrate
            </Button>
          </a>
          <a href="#nosotros" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" fullWidth>
              Conoce más
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
