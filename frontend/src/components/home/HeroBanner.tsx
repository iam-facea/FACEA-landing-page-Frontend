import heroBackground from "../../assets/images/Foto Todos Juntos.jpg.jpeg";

export const HeroBanner = () => {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-cover bg-center px-4 py-20 sm:min-h-[80vh] sm:px-6"
      style={{ backgroundImage: `url("${heroBackground}")` }}
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-4xl text-center text-white">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
          IAM FACEA
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base font-light leading-relaxed sm:text-xl md:text-2xl">
          Instituto de Alumnos Misioneros de la Facultad de Ciencias Económicas y de la Administración.
        </p>
      </div>
    </section>
  );
};
