// app/api/check-payment/route.ts
import { NextResponse } from 'next/server';

const COINBASE_COMMERCE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY;

export async function POST(request: Request) {
    try {
        const { paymentAddress } = await request.json();

        if (!paymentAddress) {
            return NextResponse.json({ error: 'Payment address is required' }, { status: 400 });
        }

        const response = await fetch(
            `https://api.commerce.coinbase.com/charges/${paymentAddress}`,
            {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CC-Api-Key': COINBASE_COMMERCE_API_KEY || "",
                  'X-CC-Version': '2018-03-22',
                },
            },
        );

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || errorMessage
            } catch (parseError) {
                console.error("Error parsing error data:", parseError)
            }
            return NextResponse.json({ error: `Coinbase API error: ${errorMessage}` }, { status: 500 });
        }

        const data = await response.json();

         if (!data || !data.data) {
             return NextResponse.json({error: "Could not get payment status from the API"}, {status: 500})
         }
       return NextResponse.json({ 
           paymentStatus: data.data.timeline[data.data.timeline.length - 1].type 
       }, { status: 200 });
    } catch (error) {
         console.error('Error checking payment status:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "An unexpected error occurred" 
        }, { status: 500 });
    }
}