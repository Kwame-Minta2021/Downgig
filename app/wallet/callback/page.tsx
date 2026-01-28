'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyTransaction } from '@/actions/payment'; // We'll create this action
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PaymentCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference');

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your transaction...');

    useEffect(() => {
        if (!reference) {
            setStatus('error');
            setMessage('No transaction reference found.');
            return;
        }

        const verify = async () => {
            try {
                const result = await verifyTransaction(reference);

                if (result.success) {
                    setStatus('success');
                    setMessage(`Successfully added GH₵${result.amount.toFixed(2)} to your wallet.`);
                } else {
                    setStatus('error');
                    setMessage(result.error || 'Transaction verification failed.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An unexpected error occurred.');
            }
        };

        verify();
    }, [reference]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center">

                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Processing Payment</h2>
                        <p className="text-slate-500">Please wait while we confirm your deposit...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
                        <p className="text-slate-500 mb-8">{message}</p>
                        <Button
                            onClick={() => router.push('/wallet')}
                            className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl"
                        >
                            Return to Wallet
                        </Button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
                            <XCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Failed</h2>
                        <p className="text-slate-500 mb-8">{message}</p>
                        <Button
                            onClick={() => router.push('/wallet')}
                            variant="outline"
                            className="w-full rounded-xl"
                        >
                            Return to Wallet
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
