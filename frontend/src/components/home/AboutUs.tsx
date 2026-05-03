import { Card } from "../ui/Card";
import { Container } from "../ui/Container";

// Importa aquí tus imágenes (asegúrate de que las rutas sean correctas)
import gruposMisioneros from "../../assets/images/Grupos misioneros.jpg";
import comisionFaros from "../../assets/images/comisionFaros.jpg"; // Ajusta el nombre
import grupoOracion from "../../assets/images/grupoOracion.jpg"; // Ajusta el nombre
import musicaImage from "../../assets/images/musicaImage.jpg"; // Ajusta el nombre

const valores = [
  {
    id: "origen",
    icono: "history_edu",
    titulo: "El Origen",
    texto:
      "Nacimos en la Universidad Adventista del Plata como una iniciativa de estudiantes comprometidos con la misión.",
  },
  {
    id: "valores",
    icono: "church",
    titulo: "Valores Cristianos",
    texto:
      "Desde el primer día, nuestra brújula ha sido el servicio abnegado y la vivencia práctica del evangelio.",
  },
  {
    id: "crecimiento",
    icono: "diversity_3",
    titulo: "Crecimiento",
    texto:
      "Lo que comenzó como un pequeño círculo de oración se transformó en un pilar fundamental de la vida universitaria.",
  },
];

export const AboutUs = () => {
  return (
    <section id="nosotros" className="bg-[#f9f9fb] py-24">
      <Container>
        {/* ENCABEZADO */}
        <div className="mb-20 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#bd222f]">
            Quiénes Somos
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#0d153b] md:text-5xl">
            Forjando identidad desde 2008
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#46464e]">
            Somos un grupo de estudiantes que representa con orgullo a la
            Facultad de Ciencias Económicas y de la Administración. Nuestro
            propósito central es nutrir la vida espiritual, creando un espacio
            de fe, apoyo mutuo y servicio desinteresado.
          </p>
        </div>

        {/* TARJETAS DE VALORES (Usando tu UI Kit) */}
        <div className="mb-24 grid gap-8 md:grid-cols-3">
          {valores.map((valor) => (
            <Card key={valor.id} hoverEffect={true} padding="lg">
              <span
                className="material-symbols-outlined mb-4 text-[#bd222f]"
                style={{ fontSize: 40 }}
              >
                {valor.icono}
              </span>
              <h3 className="mb-3 text-xl font-bold text-[#0d153b]">
                {valor.titulo}
              </h3>
              <p className="text-sm leading-relaxed text-[#46464e]">
                {valor.texto}
              </p>
            </Card>
          ))}
        </div>

        {/* BENTO BOX: Departamentos y Actividades */}
        <div className="mb-12">
          <h3 className="mb-8 text-3xl font-bold text-[#0d153b]">
            Nuestra Vida Universitaria
          </h3>

          <div className="grid h-auto gap-6 md:h-[700px] md:grid-cols-12 md:grid-rows-2">
            {/* Escuela Sabática */}
            <article className="group relative overflow-hidden rounded-xl bg-[#10183e] md:col-span-8 md:row-span-1 shadow-sm">
              <img
                alt="Escuela Sabática"
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                //src={gruposMisioneros}
              />
              <div className="relative z-20 flex h-full flex-col justify-end p-10">
                <h3 className="mb-2 text-3xl font-bold text-white">
                  Escuela Sabática
                </h3>
                <p className="max-w-md text-white/80">
                  Estudio profundo de las escrituras cada sábado por la mañana
                  en un ambiente participativo.
                </p>
              </div>
            </article>

            {/* Grupo Faros */}
            <article className="group relative overflow-hidden rounded-xl bg-[#e2e2e4] md:col-span-4 md:row-span-1 shadow-sm">
              <img
                alt="Grupo Faros"
                className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                //src={comisionFaros}
              />
              <div className="relative z-20 flex h-full flex-col justify-center p-10">
                <span
                  className="material-symbols-outlined mb-4 text-[#bd222f]"
                  style={{ fontSize: 32 }}
                >
                  group
                </span>
                <h3 className="mb-3 text-xl font-bold text-[#0d153b]">
                  Grupos Faros
                </h3>
                <p className="text-sm text-[#46464e]">
                  Pequeñas comunidades de fe que se reúnen en hogares para
                  compartir la vida y la Biblia.
                </p>
              </div>
            </article>

            {/* Grupos de Oración */}
            <article className="group relative overflow-hidden rounded-xl bg-[#0d153b] md:col-span-4 md:row-span-1 shadow-sm">
              <img
                alt="Grupos de Oración"
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                //src={grupoOracion}
              />
              <div className="relative z-20 flex h-full flex-col justify-end p-10">
                <h3 className="mb-2 text-xl font-bold text-white">
                  Grupos de Oración
                </h3>
                <p className="text-sm text-white/80">
                  Momentos dedicados a la intercesión y la conexión espiritual
                  profunda.
                </p>
              </div>
            </article>

            {/* Departamentos */}
            <article className="group flex flex-col items-center gap-8 rounded-xl bg-white border border-slate-200/60 p-10 transition-all duration-300 md:col-span-8 md:row-span-1 md:flex-row shadow-sm">
              <div className="flex-1">
                <h3 className="mb-3 text-2xl font-bold text-[#0d153b]">
                  Nuestros Departamentos
                </h3>
                <p className="text-[#46464e]">
                  Contamos con equipos de Comunicación y Música que enriquecen
                  nuestras actividades y extienden nuestro mensaje con
                  excelencia y creatividad.
                </p>
              </div>
              <div className="h-48 w-full overflow-hidden rounded-lg bg-[#e2e2e4] shadow-sm transition-all duration-300 group-hover:shadow-md md:h-full md:w-72 relative">
                <img
                  alt="Comunicación y Música"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  //src={musicaImage}
                />
              </div>
            </article>
          </div>
        </div>
      </Container>
    </section>
  );
};
