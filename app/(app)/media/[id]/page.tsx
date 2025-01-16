import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Media } from "@/payload-types";

export async function generateStaticParams() {
  console.log("[Build] Starting generateStaticParams for media detail pages");
  const payload = await getPayload({ config: configPromise });

  try {
    console.log("[Build] Fetching all media for static paths");
    const mediaResults = await payload.find({
      collection: "media",
      draft: false,
      limit: 1000,
      overrideAccess: true,
      pagination: false,
    });

    console.log(
      `[Build] Found ${mediaResults.docs.length} media items to generate`
    );

    const paths = mediaResults.docs
      .filter((m) => typeof m.id === "number" && isFinite(m.id))
      .map((m: Media) => ({
        id: String(m.id),
      }));

    console.log(`[Build] Generated ${paths.length} static paths`);
    return paths;
  } catch (error) {
    console.error("[Build] Error generating static paths:", error);
    return [];
  }
}

type PageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ImageDetail({ params }: PageParams) {
  const id = (await params)?.id;

  const timestamp = new Date().toISOString();
  console.log(`[Detail Page] Rendering page for ID: ${id} at ${timestamp}`);

  if (!id) {
    notFound();
  }

  async function getMediaById(id: string): Promise<Media | null> {
    const mediaId = parseInt(id, 10);
    if (isNaN(mediaId)) {
      return null;
    }

    console.log(`[Detail Page] Fetching media with ID: ${mediaId}`);
    const payload = await getPayload({ config: configPromise });

    try {
      const media = await payload.findByID({
        collection: "media",
        id: mediaId,
        depth: 1,
      });

      console.log(
        `[Detail Page] Fetched media caption: ${media?.caption} at ${new Date().toISOString()}`
      );
      return media;
    } catch (error) {
      console.error(`[Detail Page] Error fetching media:`, error);
      return null;
    }
  }

  const image = await getMediaById(id);
  if (!image) {
    notFound();
  }

  return (
    <div className="container mx-auto p-8">
      <Link
        href="/"
        className="mb-8 inline-block text-blue-600 hover:underline"
      >
        ← Back to Gallery
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={image.url!}
            alt={image.caption!}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain rounded-lg"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold mt-6 mb-2">{image.caption}</h1>
      </div>
    </div>
  );
}
