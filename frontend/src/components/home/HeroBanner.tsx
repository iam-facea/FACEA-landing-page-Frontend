import faceaLogo from "../../assets/FACEA-logo.png";
import { Button } from "../ui/Button.tsx";
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
            src={faceaLogo}
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
          <Button variant="primary" size="lg">
            Involúcrate
          </Button>
          <Button variant="secondary" size="lg">
            Conoce más
          </Button>
        </div>
      </div>
    </section>
  );
};
