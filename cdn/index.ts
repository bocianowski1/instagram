import express, { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "redis";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const client = createClient({
  url: process.env.REDIS_URL,
});
const app = express();
const PORT = 8787;

app.use(express.json());

type Image = {
  public_id: string;
  url: string;
};

const cache = async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id) {
    const image = await client.get(req.params.id);
    if (image) {
      return res.json(JSON.parse(image));
    }
  }
  if (req.body.ids && req.body.ids.length > 0) {
    req.body.forEach(async (image: Image) => {
      const cachedImage = await client.get(image.public_id);
      if (cachedImage) {
        return res.json(JSON.parse(cachedImage));
      }
    });
  }
  if (req.params.id === undefined) {
    const images = await client.get("images");
    if (images) {
      return res.json(JSON.parse(images));
    }
  }
  console.log("NO CACHE");
  next();
};

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.get("/images", cache, async (req, res) => {
  try {
    const result = await cloudinary.search
      .sort_by("public_id", "desc")
      .max_results(30)
      .execute();

    const images = result.resources.map((image: Image) => ({
      id: image.public_id,
      url: image.url,
    }));

    await client.set("images", JSON.stringify(images));

    images.forEach(async (image: Image) => {
      await client.set(image.public_id, image.url);
    });

    res.json(result);
  } catch (error) {
    console.error("Error retrieving images:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/images/:id", cache, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const result = await cloudinary.search
      .expression(`public_id:${id}`)
      .execute();

    res.json(result);
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, async () => {
  client.on("error", (error) => {
    console.log("ERROR");
    console.error(error);
    process.exit(1);
  });

  await client.connect();

  console.log(`App listening on port ${PORT}`);
});
