import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = 'https://travelguide-rttu.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'इमेल र पासवर्ड आवश्यक छ / Email and password are required' },
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

    // Prepare data for external API
    const loginData = {
      email,
      password,
    };

    console.log('Calling external login API for email:', email);

    // Call external TravelGuide API
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://travelguide-rttu.onrender.com'}/api/Authentication/login`,
        {
          email,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000, // Increased timeout
        }
      );

      console.log('External login API response status:', response.status);
      console.log('External login API response data:', response.data);

      // Return success response
      return NextResponse.json({
        message: 'सफलतापूर्वक लग इन भयो / Login successful',
        success: true,
        data: response.data.data || response.data,
        token: response.data.token,
      });

    } catch (apiError: any) {
      console.error('External API Login Error:', apiError.response?.data || apiError.message);
      
      // Handle specific API errors
      if (apiError.response?.status === 401) {
        return NextResponse.json(
          { error: 'गलत इमेल वा पासवर्ड / Invalid email or password' },
          { status: 401 }
        );
      }
      
      if (apiError.response?.status === 400) {
        const errorMessage = apiError.response.data?.message || apiError.response.data?.error;
        return NextResponse.json(
          { error: errorMessage || 'लग इन गर्न सकिएन / Login failed' },
          { status: 400 }
        );
      }

      // Generic error for other cases
      throw apiError;
    }

  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    if (error.response) {
      // External API returned an error response
      let errorMessage = 'Login failed';
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
          error: errorMessage,
          details: errorDetails,
          status: error.response.status
        },
        { status: error.response.status || 500 }
      );
    }
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: 'Unable to connect to authentication service. Please try again later.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'सर्भर त्रुटि / Server error', message: error.message },
      { status: 500 }
    );
  }
}