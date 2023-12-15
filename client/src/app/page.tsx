"use server";
import { Post } from "@/components/post";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CloudImage } from "@/lib/types";
import { getImages } from "@/api/images";
import { redirect } from "next/navigation";
import { getAuth } from "@/api/auth";

export default async function Home() {
  const { token, user } = await getAuth();
  if (!token || !user) {
    redirect("/auth/login");
  }

  // const images = await getImages();

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center">
        {/* {images ? (
          images.map((image: CloudImage) => (
            <Post key={image.id} imageURL={image.url} />
          ))
        ) : ( */}
        <p className="pt-20 text-gray-500">No posts...</p>
        {/* // )} */}
      </main>
      <Footer />
    </>
  );
}
