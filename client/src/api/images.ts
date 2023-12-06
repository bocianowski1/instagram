export async function loadImages() {
  const response = await fetch(`http://localhost:8787/images`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
