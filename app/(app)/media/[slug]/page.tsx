import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Media } from "@/payload-types";
import { cache } from "react";

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
      select: {
        slug: true,
      },
    });

    console.log(
      `[Build] Found ${mediaResults.docs.length} media items to generate`
    );

    const params = mediaResults.docs.map(({ slug }) => {
      return { slug };
    });

    console.log(`[Build] Generated ${params.length} static paths`);
    return params;
  } catch (error) {
    console.error("[Build] Error generating static paths:", error);
    return [];
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ImageDetail({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise

  // const timestamp = new Date().toISOString();
  console.log(`[Detail Page] Rendering page for slug: ${slug} at`);

  if (!slug) {
    console.log("[Detail Page] No slug provided");
    notFound();
  }


  const image = await queryMediaBySlug({slug});
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

const queryMediaBySlug = cache(async ({ slug }: { slug: string }) => {

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'media',
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})