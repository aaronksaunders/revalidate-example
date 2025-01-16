import type { CollectionConfig } from "payload";
import { revalidateMedia, revalidateDelete } from "./hooks/revalidateMedia";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "caption",
      type: "text",
      required: false,
    },
  ],
  upload: true,
  hooks: {
    afterChange: [revalidateMedia],
    afterDelete: [revalidateDelete],
  },
};
