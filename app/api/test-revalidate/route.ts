import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      console.log(
        `[Test Route] Attempting to revalidate detail page: /media/${id}`
      );
      revalidatePath(`/media/${id}`, "page");
      console.log(
        `[Test Route] Successfully revalidated detail page: /media/${id}`
      );
    }

    console.log(`[Test Route] Attempting to revalidate home page`);
    revalidatePath("/", "page");
    console.log(`[Test Route] Successfully revalidated home page`);

    return NextResponse.json({
      success: true,
      message: "Revalidation triggered",
    });
  } catch (error) {
    console.error(`[Test Route] Error during revalidation:`, error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
