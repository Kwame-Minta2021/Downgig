'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function NetworkCheckPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        setStatus('loading');
        setMessage('Testing connection to Supabase...');
        setDetails(null);

        try {
            // 1. Test Raw Fetch first (Isolate SDK)
            const healthUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`;
            const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            console.log('Testing URL:', healthUrl);

            // Create a controller to timeout after 5 seconds
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            let rawRes;
            try {
                rawRes = await fetch(healthUrl, {
                    method: 'GET',
                    headers: {
                        'apikey': apiKey || '',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    signal: controller.signal
                });
            } catch (fetchErr: any) {
                clearTimeout(timeoutId);
                throw new Error(`Raw Fetch Failed: ${fetchErr.message}`);
            }
            clearTimeout(timeoutId);

            if (!rawRes.ok) {
                throw new Error(`HTTP Error: ${rawRes.status} ${rawRes.statusText}`);
            }

            // 2. Test SDK
            const start = performance.now();
            const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
            const end = performance.now();

            if (error) {
                throw error;
            }

            setStatus('success');
            setMessage('Connection successful!');
            setDetails({
                latency: Math.round(end - start) + 'ms',
                status: 200,
                statusText: 'OK',
                url: process.env.NEXT_PUBLIC_SUPABASE_URL,
                rawFetch: 'Success'
            });

        } catch (err: any) {
            setStatus('error');
            setMessage('Connection failed: ' + (err.message || 'Unknown error'));
            setDetails({
                error: err.message,
                stack: err.stack,
                hint: 'Check your internet connection, VPN, and Supabase URL.'
            });
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Network Diagnostic</h1>

            <div className={`p-4 rounded-lg mb-6 ${status === 'loading' ? 'bg-blue-50 text-blue-700' :
                status === 'success' ? 'bg-green-50 text-green-700' :
                    'bg-red-50 text-red-700'
                }`}>
                <p className="font-medium">{message}</p>
            </div>

            {details && (
                <div className="bg-slate-100 p-4 rounded-lg overflow-auto">
                    <pre className="text-sm font-mono text-slate-700">
                        {JSON.stringify(details, null, 2)}
                    </pre>
                </div>
            )}

            <button
                onClick={checkConnection}
                className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
                Retry Connection
            </button>
            <div className="mt-8 pt-8 border-t border-slate-200">
                <a href="/login" className="text-blue-600 hover:underline">← Back to Login</a>
            </div>
        </div>
    );
}
