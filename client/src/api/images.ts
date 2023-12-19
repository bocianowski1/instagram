export async function getImages() {
  const response = await fetch(`${process.env.IMAGES_URL}/images`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}
