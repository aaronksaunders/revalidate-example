import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

import { revalidatePath, revalidateTag } from "next/cache";

import type { Media } from "../../../payload-types";

export const revalidateMedia: CollectionAfterChangeHook<Media> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc.id && isFinite(doc.id)) {
    console.log(`[Revalidate Hook] Media ${doc.id} changed`);
    console.log(`[Revalidate Hook] Old caption: ${previousDoc?.caption}`);
    console.log(`[Revalidate Hook] New caption: ${doc.caption}`);

    // Revalidate the specific page
    console.log(`[Revalidate Hook] Revalidating page: /media/${doc.id}`);
    revalidatePath(`/media/${doc.id}`, "page");

    // Revalidate the home page
    console.log("[Revalidate Hook] Revalidating home page");
    revalidatePath("/", "page");

    // Revalidate tags for cache invalidation
    console.log(`[Revalidate Hook] Revalidating tags`);
    revalidateTag(`media-${doc.id}`);
    revalidateTag("media-gallery-list");
  }
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Media> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate && doc?.id && isFinite(doc.id)) {
    console.log(`[Revalidate Hook] Media ${doc.id} deleted`);

    // Revalidate the specific page
    console.log(`[Revalidate Hook] Revalidating page: /media/${doc.id}`);
    revalidatePath(`/media/${doc.id}`, "page");

    // Revalidate the home page
    console.log("[Revalidate Hook] Revalidating home page");
    revalidatePath("/", "page");

    // Revalidate tags for cache invalidation
    console.log(`[Revalidate Hook] Revalidating tags`);
    revalidateTag(`media-${doc.id}`);
    revalidateTag("media-gallery-list");
  }
  return doc;
};
