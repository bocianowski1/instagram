import { Header } from "@/components/header";
import Image from "next/image";

type Image = {
  id: string;
  url: string;
};

async function load() {
  const response = await fetch(`http://localhost:8787/images`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export default async function Home() {
  const images = await load();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <div className="flex flex-col gap-2">
        {images ? (
          images.map((image: Image) => (
            <div key={image.id} className="flex flex-col gap-4 w-full p-4">
              {!image.url.endsWith(".mp4") && (
                <Image
                  src={image.url}
                  alt=""
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">Loading...</h1>
          </div>
        )}
      </div>
    </main>
  );
}
