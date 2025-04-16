import Image from "next/image";
import Link from "next/link";

export default function Card({
  title,
  description,
  image,
  link,
}: {
  title: string;
  description: string;
  image: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="card bg-base-100 image-full shadow-sm hover:cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl md:w-[400px] h-[220px] "
    >
      <figure>
        <Image
          src={image}
          alt={title}
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">{title}</h2>
        <p>{description}</p>
      </div>
    </Link>
  );
}
