"use server";
import { Post } from "@/components/post";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CloudImage } from "@/lib/types";
// import { loadImages } from "@/api/images";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  console.log(cookies().get("token"));
  if (!cookies().get("token")) {
    return redirect("/auth/login");
  }

  // const images = await loadImages();

  return (
    <>
      <Header />
      <main className="flex min-h-full flex-col items-center pt-[12rem] pb-[4rem]">
        {/* {images.map((image: CloudImage) => (
          <Post key={image.id} imageURL={image.url} />
        ))} */}
        hei
      </main>
      <Footer />
    </>
  );
}
