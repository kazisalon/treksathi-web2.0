'use client';

import { useState } from 'react';
import { useApi } from '../../hooks/useApi';

export default function TestApiPage() {
  const { request } = useApi();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request('POST', '/api/Authentication/register', {
        username: 'testuser123',
        email: 'test@example.com',
        password: 'Test123!@#',
        phoneNumber: '+1234567890',
        gender: 'male',
        alias: 'TestAlias'
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request('POST', '/api/Authentication/login', {
        email: 'test@example.com',
        password: 'Test123!@#'
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testExternalApiDirect = async () => {
    setLoading(true);
    setError(null);
    try {
      // Test direct call to external API
      const response = await fetch('https://travelguide-rttu.onrender.com/api/Authentication/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser123',
          email: 'test@example.com',
          password: 'Test123!@#',
          phoneNumber: '+1234567890',
          gender: 'male',
          alias: 'TestAlias'
        }),
      });
      
      const responseText = await response.text();
      console.log('Direct API response status:', response.status);
      console.log('Direct API response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { rawResponse: responseText };
      }
      
      setResult({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData
      });
    } catch (err: any) {
      setError(err.message || 'Direct API test failed');
      console.error('Direct API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testMinimalFields = async () => {
    setLoading(true);
    setError(null);
    try {
      // Test with minimal fields
      const response = await fetch('https://travelguide-rttu.onrender.com/api/Authentication/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Test123!@#',
          username: 'testuser123'
        }),
      });
      
      const responseText = await response.text();
      console.log('Minimal fields response status:', response.status);
      console.log('Minimal fields response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { rawResponse: responseText };
      }
      
      setResult({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        testType: 'minimal'
      });
    } catch (err: any) {
      setError(err.message || 'Minimal fields test failed');
      console.error('Minimal fields error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testApiHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Health check failed');
      console.error('Health check error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Integration Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test External API</h2>
          
          <div className="space-y-4">
            <button
              onClick={testApiHealth}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test API Health'}
            </button>
            
            <button
              onClick={testRegister}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-4"
            >
              {loading ? 'Testing...' : 'Test Register'}
            </button>
            
            <button
              onClick={testExternalApiDirect}
              disabled={loading}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50 ml-4"
            >
              {loading ? 'Testing...' : 'Test External API Direct'}
            </button>
            
            <button
              onClick={testMinimalFields}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
            >
              {loading ? 'Testing...' : 'Test Minimal Fields'}
            </button>
            
            <button
              onClick={testApiHealth}
              disabled={loading}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50 ml-4"
            >
              {loading ? 'Testing...' : 'Test API Health'}
            </button>
            
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 ml-4"
            >
              {loading ? 'Testing...' : 'Test Login'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">API Response:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}