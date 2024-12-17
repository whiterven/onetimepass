// /app/api/auth/session/route.ts
import { authOptions } from '@/lib/auth';
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions)
    if(session) {
        return NextResponse.json({ authenticated: !!session, session})
    }
    return NextResponse.json({ authenticated: !!session})
}