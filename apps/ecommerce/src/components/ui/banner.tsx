import Image from "next/image";

export default function Banner({
  urlImage,
  altImage,
}: {
  urlImage: string;
  altImage: string;
}) {
  return (
    <Image
      src={urlImage}
      width={1440}
      height={400}
      alt={altImage}
      className="w-full"
      loading="lazy"
    />
  );
}
