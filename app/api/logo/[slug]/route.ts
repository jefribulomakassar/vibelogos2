import { NextRequest, NextResponse } from "next/server";
import { getLogoBySlug } from "@/lib/logos";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const logo = await getLogoBySlug(params.slug);
    if (!logo) {
      return NextResponse.json({ error: "Logo not found" }, { status: 404 });
    }
    return NextResponse.json({ logo });
  } catch (err) {
    console.error("[API/logo/slug]", err);
    return NextResponse.json({ error: "Failed to fetch logo" }, { status: 500 });
  }
}
