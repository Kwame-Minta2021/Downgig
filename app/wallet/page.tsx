'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DollarSign, ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, Download, X, Loader2 } from 'lucide-react';
import { initializeDeposit } from '@/actions/payment';

export default function WalletPage() {
    const { currentUser, transactions } = useApp();
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!currentUser) return null;

    const handleDeposit = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        setIsLoading(true);
        setError('');

        const result = await initializeDeposit(Number(amount), currentUser.email);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result.authorizationUrl) {
            // Redirect to Paystack
            window.location.href = result.authorizationUrl;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">Financial Overview</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {/* Balance Card */}
                    <div className="md:col-span-2">
                        <Card className="bg-gradient-to-r from-blue-900 to-slate-900 text-white border-0 h-full flex flex-col justify-between p-8">
                            <div>
                                <p className="text-blue-200 font-medium mb-1">Available Balance</p>
                                <div className="text-5xl font-bold mb-4">
                                    GH₵{currentUser.balance?.toLocaleString() ?? '0.00'}
                                </div>
                                <div className="flex gap-4">
                                    <Button className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
                                        <ArrowDownLeft className="w-4 h-4 mr-2" /> Withdraw Funds
                                    </Button>
                                    <Button
                                        onClick={() => setIsDepositModalOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-900/50"
                                    >
                                        <ArrowUpRight className="w-4 h-4 mr-2" /> Add Funds
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/10 flex gap-8">
                                <div>
                                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Earnings</p>
                                    <p className="text-xl font-bold">GH₵{currentUser.totalEarnings?.toLocaleString() ?? '0.00'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Pending Clearance</p>
                                    <p className="text-xl font-bold text-amber-400">GH₵{currentUser.pendingBalance?.toLocaleString() ?? '0.00'}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Payment Methods */}
                    <Card className="flex flex-col justify-center items-center text-center p-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                            <CreditCard className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Methods</h3>
                        <p className="text-slate-500 text-sm mb-6">Manage your bank accounts and mobile money wallets.</p>
                        <Button variant="outline" className="w-full">Manage Methods</Button>
                    </Card>
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
                        <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-2" /> Export CSV
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.length > 0 ? (
                                    transactions.map(transaction => (
                                        <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                {transaction.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        transaction.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${transaction.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                                                {transaction.type === 'credit' ? '+' : '-'} GH₵{Number(transaction.amount).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Deposit Modal */}
            {isDepositModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
                        <button
                            onClick={() => setIsDepositModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-7 h-7" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Add Funds</h2>
                            <p className="text-slate-500 text-sm">Top up your wallet securely via Paystack.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Amount (GH₵)</label>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount (e.g. 50.00)"
                                    className="text-lg"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                                    {error}
                                </p>
                            )}

                            <Button
                                onClick={handleDeposit}
                                disabled={isLoading}
                                size="lg"
                                className="w-full bg-blue-600 text-white hover:bg-blue-500 font-bold rounded-xl"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    'Proceed to Payment'
                                )}
                            </Button>

                            <div className="text-center">
                                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                    <ShieldCheckIcon className="w-3 h-3" /> Secured by Paystack
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ShieldCheckIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
    )
}
