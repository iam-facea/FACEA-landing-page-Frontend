import { Card } from "../ui/Card";
//import gruposMisioneros from "../../assets/images/Grupos misioneros.jpg";
//import vigiliaImage from "../../assets/images/vigilia.jpg";

// 1. EXTRAEMOS LA DATA: Si mañana cambian los textos, solo tocás este array
const valores = [
  {
    id: "origen",
    icono: "history_edu", // Cambié el 2008 estático por un ícono para mantener simetría visual
    titulo: "El Origen",
    texto:
      "Nacimos en el seno de la Universidad Adventista del Plata como una iniciativa de estudiantes comprometidos con la misión.",
  },
  {
    id: "valores",
    icono: "church",
    titulo: "Valores Cristianos",
    texto:
      "Desde el primer día, nuestra brújula ha sido el servicio abnegado y la vivencia práctica de los valores del evangelio.",
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
    // Agrupé todo en un solo contenedor grande para que tenga coherencia
    <section id="nosotros" className="bg-[#f9f9fb] py-24">
      {/* SECCIÓN A: Quiénes Somos (Header) */}
      <div className="mx-auto max-w-7xl px-8 mb-20 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#bd222f]">
          Quiénes Somos
        </span>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#0d153b] md:text-5xl">
          Forjando identidad desde 2008
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#46464e]">
          Somos un grupo de estudiantes que representa con orgullo a la Facultad
          de Ciencias Económicas y de la Administración, integrando también a
          jóvenes de diversas facultades. Nuestro propósito central es nutrir y
          fortalecer la vida espiritual, creando un espacio de fe, apoyo mutuo y
          servicio desinteresado.
        </p>
      </div>

      {/* SECCIÓN B: Grilla de Tarjetas (Acá brilla tu UI Kit) */}
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {valores.map((valor) => (
            // Usamos nuestra Card global. Le pasamos hoverEffect para que tenga interacción.
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
      </div>
    </section>
  );
};
