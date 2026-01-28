'use server';

import { createClient } from '@supabase/supabase-js';

// Initialize admin client to bypass RLS for balance updates
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Ideally should be SERVICE_ROLE_KEY for real security, using ANON for now as per env setup
    {
        auth: {
            persistSession: false,
        }
    }
);

export async function initializeDeposit(amount: number, email: string) {
    const params = {
        email,
        amount: amount * 100, // Paystack expects amount in pesewas (or smallest currency unit)
        currency: 'GHS',
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/wallet/callback`
        // Ensure NEXT_PUBLIC_APP_URL is set in prod, fallback to localhost for dev
    };

    try {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        const data = await response.json();

        if (!data.status) {
            return { error: data.message };
        }

        return { authorizationUrl: data.data.authorization_url, reference: data.data.reference };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function verifyTransaction(reference: string) {
    try {
        // 1. Verify with Paystack
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        const data = await response.json();

        if (!data.status || data.data.status !== 'success') {
            return { error: 'Transaction verification failed or rejected.' };
        }

        const paystackData = data.data;
        const amountGHS = paystackData.amount / 100;
        const email = paystackData.customer.email;

        // 2. Check if transaction already recorded to prevent double crediting
        // Note: In a real app we'd query DB by reference. For now we assume typical flow.
        // We will insert 'ON CONFLICT DO NOTHING' based on reference constraint if table supports it.
        // Our schema defined 'reference' as UNIQUE.

        // 3. Find User ID by Email (Since Paystack only gives us Email)
        // Ideally we pass metadata with userID in initialize, but lookup works too.
        const { data: users, error: userError } = await supabaseAdmin
            .from('profiles')
            .select('id, balance')
            .eq('email', email)
            .single();

        if (userError || !users) {
            return { error: 'User not found for this transaction.' };
        }

        const userId = users.id;
        const newBalance = (users.balance || 0) + amountGHS;

        // 4. Record Transaction & Update Balance
        // We do this in a "transactional" way if possible, or just sequential.

        // Insert transaction
        const { error: txError } = await supabaseAdmin.from('transactions').insert([{
            user_id: userId,
            amount: amountGHS,
            type: 'credit',
            status: 'completed',
            reference: reference,
            description: 'Deposit via Paystack'
        }]);

        if (txError) {
            // If duplicate reference, likely already processed
            if (txError.message.includes('unique constraint')) {
                return { error: 'Transaction already processed.' };
            }
            return { error: 'Failed to record transaction.' };
        }

        // Update User Balance
        const { error: balanceError } = await supabaseAdmin
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', userId);

        if (balanceError) {
            return { error: 'Failed to update balance.' };
        }

        return { success: true, amount: amountGHS };

    } catch (error: any) {
        return { error: error.message };
    }
}
