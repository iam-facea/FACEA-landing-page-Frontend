import { Card } from "../ui/Card";
import { Container } from "../ui/Container";

// Importa aquí tus imágenes (asegúrate de que las rutas sean correctas)
import gruposMisioneros from "../../assets/images/ESCUEL SABATICA.jpg.jpeg";
import comisionFaros from "../../assets/images/Comision Faros.jpg"; // Ajusta el nombre
import grupoOracion from "../../assets/images/Grupo-oracion.jpeg"; // Ajusta el nombre
import musicaImage from "../../assets/images/Musica.jpg"; // Ajusta el nombre

const valores = [
  {
    id: "origen",
    titulo: "Misión",
    texto:
      "Acercar a los jóvenes a Dios mediante el estudio de la Biblia, las actividades y el compañerismo, fortaleciendo su fe y sentido de pertenencia.",
  },
  {
    id: "valores",
    titulo: "Visión",
    texto:
      "Ser una comunidad unida donde cada estudiante pueda crecer espiritualmente, desarrollar sus capacidades y encontrar oportunidades para servir y compartir su fe.",
  },
  {
    id: "crecimiento",
    titulo: "Valores",
    texto:
      "Promovemos el trabajo en equipo, el apoyo mutuo, el compromiso y el servicio, construyendo una comunidad basada en el respeto, el compañerismo y el amor a Dios.",
  },
];

export const AboutUs = () => {
  return (
    <section id="nosotros" className="bg-[#f9f9fb] py-16 sm:py-20 md:py-24">
      <Container>
        {/* ENCABEZADO */}
        <div className="mb-12 text-center sm:mb-16 md:mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#bd222f]">
            Quiénes Somos
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0d153b] sm:text-4xl md:text-5xl">
            Una comunidad para crecer en la fe y servir juntos
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-[#46464e] sm:mt-6 sm:text-lg">
            En IAM FACEA compartimos la fe, fortalecemos el compañerismo y
            creamos oportunidades para que cada estudiante participe, crezca y
            sirva a los demás.
          </p>
        </div>

        {/* TARJETAS DE VALORES (Usando tu UI Kit) */}
        <div className="mb-16 grid gap-6 sm:gap-8 md:mb-24 md:grid-cols-3">
          {valores.map((valor) => (
            <Card key={valor.id} hoverEffect={true} padding="lg">
              <h3 className="mb-2 text-lg font-bold text-[#0d153b] sm:text-xl sm:mb-3">
                {valor.titulo}
              </h3>
              <p className="text-sm leading-relaxed text-[#46464e]">
                {valor.texto}
              </p>
            </Card>
          ))}
        </div>

        {/* BENTO BOX: Departamentos y Actividades */}
        <div className="mb-8 md:mb-12">
          <h3 className="mb-6 text-2xl font-bold text-[#0d153b] sm:text-3xl sm:mb-8">
            Nuestra Vida Universitaria
          </h3>

          <div className="grid grid-cols-1 gap-6 md:h-[700px] md:grid-cols-12 md:grid-rows-2">
            {/* Escuela Sabática */}
            <article className="group relative min-h-[260px] overflow-hidden rounded-2xl bg-[#10183e] md:col-span-8 md:row-span-1 shadow-sm">
              <img
                alt="Escuela Sabática"
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                src={gruposMisioneros}
                loading="lazy"
              />
              <div className="relative z-20 flex h-full flex-col justify-end p-6 sm:p-8 md:p-10">
                <h3 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                  Escuela Sabática
                </h3>
                <p className="max-w-md text-sm text-white/90 sm:text-base sm:text-white/80">
                  Estudio profundo de las escrituras cada sábado por la mañana
                  en un ambiente participativo.
                </p>
              </div>
            </article>

            {/* Grupo Faros */}
            <article className="group relative min-h-[240px] overflow-hidden rounded-2xl bg-[#e2e2e4] md:col-span-4 md:row-span-1 shadow-sm">
              <img
                alt="Grupo Faros"
                className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                src={comisionFaros}
                loading="lazy"
              />
              <div className="relative z-20 flex h-full flex-col justify-end p-6 sm:p-8 md:p-10">
                <h3 className="mb-2 text-2xl font-bold text-[#0d153b] sm:text-3xl sm:mb-3">
                  Grupos Faros
                </h3>
                <p className="text-sm text-[#46464e]">
                  Pequeñas comunidades de fe que se reúnen en hogares para
                  compartir la vida y la Biblia.
                </p>
              </div>
            </article>

            {/* Grupos de Oración */}
            <article className="group relative min-h-[240px] overflow-hidden rounded-2xl bg-[#0d153b] md:col-span-4 md:row-span-1 shadow-sm">
              <img
                alt="Grupos de Oración"
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                src={grupoOracion}
                loading="lazy"
              />
              <div className="relative z-20 flex h-full flex-col justify-end p-6 sm:p-8 md:p-10">
                <h3 className="mb-2 text-2xl font-bold text-white">
                  Grupos de Oración
                </h3>
                <p className="text-sm text-white/90 sm:text-white/80">
                  Momentos dedicados a la intercesión y la conexión espiritual
                  profunda.
                </p>
              </div>
            </article>

            {/* Departamentos */}
            <article className="group relative min-h-[240px] overflow-hidden rounded-2xl bg-white md:col-span-8 md:row-span-1 shadow-sm">
              <img
                alt="Comunicación y Música"
                className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                src={musicaImage}
                loading="lazy"
              />
              <div className="relative z-20 flex h-full flex-col justify-end p-6 sm:p-8 md:p-10">
                <h3 className="mb-2 text-xl font-bold text-[#0d153b] sm:text-2xl sm:mb-3">
                  Nuestros Departamentos
                </h3>
                <p className="text-sm leading-relaxed text-[#46464e] sm:text-base">
                  Contamos con equipos de Comunicación y Música que enriquecen
                  nuestras actividades y extienden nuestro mensaje con
                  excelencia y creatividad.
                </p>
              </div>
            </article>
          </div>
        </div>
      </Container>
    </section>
  );
};
