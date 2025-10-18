import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = 'https://travelguide-rttu.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, gender, phoneNumber, alias } = await request.json();

    // Validate required fields
    if (!username || !email || !password || !gender || !phoneNumber || !alias) {
      return NextResponse.json(
        { error: 'सबै फिल्डहरू आवश्यक छन् / All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस् / Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: '१० अंकको फोन नम्बर प्रविष्ट गर्नुहोस् / Please enter a 10-digit phone number' },
        { status: 400 }
      );
    }

    // Validate gender
    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(gender)) {
      return NextResponse.json(
        { error: 'मान्य लिङ्ग चयन गर्नुहोस् / Please select a valid gender' },
        { status: 400 }
      );
    }

    // Prepare data for external API
    const registrationData = {
      username,
      email,
      password,
      gender,
      phoneNumber,
      alias,
    };

    // Prepare data for external API
    const apiData = {
      username,
      email,
      password,
      phoneNumber,
      gender,
      alias
    };

    console.log('Calling external API with data:', { ...apiData, password: '[HIDDEN]' });
    console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL || 'https://travelguide-rttu.onrender.com'}/api/Authentication/register`);

    // Call external TravelGuide API
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://travelguide-rttu.onrender.com'}/api/Authentication/register`,
        apiData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000, // Increased timeout
        }
      );

      console.log('External API response status:', response.status);
      console.log('External API response headers:', response.headers);
      console.log('External API response data:', response.data);
      console.log('Full response object keys:', Object.keys(response));

      // Return success response
      return NextResponse.json({
        message: 'खाता सफलतापूर्वक सिर्जना भयो / Account created successfully',
        success: true,
        data: response.data.data || response.data,
        token: response.data.token,
      });

    } catch (apiError: any) {
      console.error('External API Error:', apiError.response?.data || apiError.message);
      
      // Handle specific API errors
      if (apiError.response?.status === 400) {
        const errorMessage = apiError.response.data?.message || apiError.response.data?.error;
        return NextResponse.json(
          { error: errorMessage || 'दर्ता गर्न सकिएन / Registration failed' },
          { status: 400 }
        );
      }
      
      if (apiError.response?.status === 409) {
        return NextResponse.json(
          { error: 'यो इमेल वा प्रयोगकर्ता नाम पहिले नै प्रयोग भएको छ / Email or username already exists' },
          { status: 409 }
        );
      }

      // Generic error for other cases
      throw apiError;
    }

  } catch (error: any) {
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      } : null
    });
    
    // Handle specific error types
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('Connection error to external API');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unable to connect to authentication service. Please try again later.',
          error: 'Service unavailable',
          debug: { code: error.code, message: error.message }
        },
        { status: 503 }
      );
    }

    // Handle timeout errors
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      console.error('Timeout error');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Request timeout. Please try again.',
          error: 'Timeout',
          debug: { name: error.name, message: error.message }
        },
        { status: 408 }
      );
    }

    // Handle fetch errors (network issues, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Fetch error:', error.message);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Network error. Please check your connection and try again.',
          error: 'Network error',
          debug: { type: 'fetch', message: error.message }
        },
        { status: 503 }
      );
    }
    
    if (error.response) {
      // External API returned an error response
      let errorMessage = 'Registration failed';
      let errorDetails = null;
      
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.errors) {
          if (Array.isArray(error.response.data.errors)) {
            errorMessage = error.response.data.errors.join(', ');
          } else if (typeof error.response.data.errors === 'object') {
            errorMessage = Object.values(error.response.data.errors).flat().join(', ');
          } else {
            errorMessage = error.response.data.errors;
          }
        }
        errorDetails = error.response.data;
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: errorMessage,
          details: errorDetails,
          status: error.response.status,
          debug: {
            responseStatus: error.response.status,
            responseStatusText: error.response.statusText,
            responseHeaders: error.response.headers
          }
        },
        { status: error.response.status || 500 }
      );
    }
    
    console.error('Unhandled error type:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'खाता सिर्जना गर्न सकिएन', 
        message: error.message,
        debug: {
          errorType: error.constructor.name,
          errorMessage: error.message,
          errorCode: error.code
        }
      },
      { status: 500 }
    );
  }
}