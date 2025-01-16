import { Media } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import configPromise from "@payload-config";

// Add build output config
export const dynamic = "force-static";
export const dynamicParams = false;

async function getAllMedia(): Promise<Media[]> {
  console.log("[Build] Fetching all media for home page");
  const payload = await getPayload({ config: configPromise });

  try {
    const mediaResults = await payload.find({
      collection: "media",
      depth: 1,
      sort: "-updatedAt",
    });

    console.log(`[Home Page] Fetched ${mediaResults.docs.length} items`);
    return mediaResults.docs;
  } catch (error) {
    console.error("[Home Page] Error fetching media:", error);
    return [];
  }
}

export default async function Home() {
  const timestamp = new Date().toISOString();
  console.log(`[Home Page] Rendering page at ${timestamp}`);
  const images = await getAllMedia();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold">Image Gallery</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {images.map((image) => (
          <Link href={`/media/${image.id}`} key={image.id}>
            <div key={image.id} className="flex flex-col items-center gap-2">
              <div className="relative w-full aspect-square">
                <Image
                  src={image?.url!}
                  alt={image.caption!}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-600">{image.caption}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
