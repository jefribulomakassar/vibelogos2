import { NextRequest, NextResponse } from "next/server";
import { getAllLogos, searchLogos, getLogosByCategory } from "@/lib/logos";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");

    let logos;
    if (q) {
      logos = await searchLogos(q);
    } else if (category) {
      logos = await getLogosByCategory(category);
    } else {
      logos = await getAllLogos();
    }

    return NextResponse.json({ logos, count: logos.length });
  } catch (err) {
    console.error("[API/logos]", err);
    return NextResponse.json({ error: "Failed to fetch logos" }, { status: 500 });
  }
}
