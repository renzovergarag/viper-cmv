import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { z } from "zod";

const unsubSchema = z.object({
    endpoint: z.string().url(),
});

export async function POST(request: NextRequest) {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response;

    const body = await request.json().catch(() => null);
    const parsed = unsubSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    await prisma.suscripcionPush.deleteMany({
        where: { endpoint: parsed.data.endpoint },
    });

    return NextResponse.json({ success: true });
}
