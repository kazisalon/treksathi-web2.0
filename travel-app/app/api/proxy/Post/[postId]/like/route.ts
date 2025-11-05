export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://travelguide-rttu.onrender.com';

export async function POST(req: Request, { params }: { params: { postId: string } }) {
  const { postId } = params;

  // Accept token from multiple header names
  const authHeader = req.headers.get('authorization') || '';
  const xAccessToken = req.headers.get('x-access-token') || '';
  const rawToken = req.headers.get('token') || '';

  // Extract bearer token if present
  const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const bearerToken = tokenMatch ? tokenMatch[1] : '';

  const token = bearerToken || xAccessToken || rawToken;

  const targets = [
    `${API_BASE_URL}/api/Post/${encodeURIComponent(postId)}/like`,
    `${API_BASE_URL}/api/Post/like/${encodeURIComponent(postId)}`,
  ];

  for (let i = 0; i < targets.length; i++) {
    try {
      const res = await fetch(targets[i], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
          ...(xAccessToken ? { 'x-access-token': xAccessToken } : {}),
          ...(rawToken ? { token: rawToken } : {}),
        },
        body: JSON.stringify({ token }), // include token for parsers that expect body
        cache: 'no-store',
      });

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: res.ok, message: text };
      }

      if (res.ok || res.status !== 404) {
        return NextResponse.json(data, { status: res.status });
      }
    } catch (e: any) {
      return NextResponse.json(
        { success: false, message: e?.message || 'Proxy error' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { success: false, message: 'Post not found for like endpoint' },
    { status: 404 }
  );
}