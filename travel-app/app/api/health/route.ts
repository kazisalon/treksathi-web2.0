import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://travelguide-rttu.onrender.com';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing API health at:', API_BASE_URL);
    
    // Test basic connectivity
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    console.log('Health check response status:', response.status);
    console.log('Health check response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Health check response text:', responseText.substring(0, 500));

    return NextResponse.json({
      success: true,
      message: 'API health check completed',
      data: {
        baseUrl: API_BASE_URL,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        responsePreview: responseText.substring(0, 200)
      }
    });

  } catch (error: any) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'API health check failed',
      error: {
        message: error.message,
        code: error.code,
        name: error.name
      }
    }, { status: 500 });
  }
}