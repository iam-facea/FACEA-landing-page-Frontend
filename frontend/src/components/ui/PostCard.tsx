export interface PostCardProps {
  category: string;
  title: string;
  date: string;
  image: string;
  description: string;
}

export const PostCard = ({
  category,
  title,
  date,
  image,
  description,
}: PostCardProps) => {
  return (
    <>
      {/* Componente reutilizable para mostrar una publicación con imagen, etiqueta, fecha y texto. */}
      <article className="group relative flex h-[450px] w-[85vw] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-3xl bg-slate-800 md:h-[500px] md:w-[600px]">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative z-10 p-8 md:p-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-[#bd222f] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              {category}
            </span>
            <span className="text-sm font-medium text-white/80">{date}</span>
          </div>
          <h3 className="mb-3 text-2xl font-bold leading-tight md:text-3xl">
            {title}
          </h3>
          <p className="line-clamp-2 text-white/70">{description}</p>
        </div>
      </article>
    </>
  );
};