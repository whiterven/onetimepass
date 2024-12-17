// app/api/create-payment/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const COINBASE_COMMERCE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY;
const prisma = new PrismaClient();

// Basic in-memory rate limiting
const requestCounts = new Map<string, number>();
const MAX_REQUESTS_PER_MINUTE = 5;

// Type for API Key Test Result
interface ApiKeyTestResult {
    status: boolean;
    errorMessage?: string;
}

// Zod schema for input validation
const createPaymentSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((value) => !isNaN(Number(value)), "Amount must be a number"),
  cryptoType: z.enum(['bitcoin', 'usdt'], {
      errorMap: () => {
          return { message: "Invalid crypto type must be bitcoin or usdt" }
      }
  }),
    userId: z.string().min(1, "User id is required"),
});

export async function POST(request: Request) {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    try {
         // Check for rate limiting
        if (requestCounts.has(ip)) {
            const count = requestCounts.get(ip) || 0;
            if (count >= MAX_REQUESTS_PER_MINUTE) {
                console.log(`Rate limit exceeded for IP: ${ip}`)
                return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
            }
            requestCounts.set(ip, count + 1);
        } else {
             requestCounts.set(ip, 1);
        }
        // Clear rate limits after a minute
         setTimeout(() => {
             requestCounts.delete(ip)
         }, 60000);

        // Input validation
        const body = await request.json();
        const validationResult = createPaymentSchema.safeParse(body);
        if (!validationResult.success) {
          console.log("Validation failed: ", validationResult.error.flatten().fieldErrors)
            return NextResponse.json(
                { error: validationResult.error.flatten().fieldErrors },
                { status: 400 }
            );
        }
         const { amount, cryptoType, userId } = validationResult.data;

        //Check if the user exists
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            console.error(`User not found: ${userId}`);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        //Check if the Api key is correct
         const testApiKey = async (): Promise<ApiKeyTestResult> => {
            try {
                 const response = await fetch('https://api.commerce.coinbase.com/v1/accounts', {
                headers: {
                    'X-CC-Api-Key': COINBASE_COMMERCE_API_KEY || "",
                }
            })
                if (!response.ok) {
                    let errorMessage = `Invalid API key`;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.error?.message || errorMessage
                    } catch (parseError) {
                        console.error("Error parsing error data:", parseError)
                    }
                    console.error("Invalid API key")
                    return { status: false, errorMessage };
               }
               return { status: true };
            } catch (error) {
                console.error("error when checking the api key: ", error instanceof Error ? error.message : 'Unknown error')
                return { 
                    status: false, 
                    errorMessage: error instanceof Error ? error.message : 'Unknown error' 
                }
           }
        }
          const apiKeyStatus = await testApiKey()
           if (!apiKeyStatus.status) {
                return NextResponse.json({ error: `Invalid api key: ${apiKeyStatus.errorMessage}` }, { status: 401 });
           }
        //Create unique idempotency key
         const idempotencyKey = crypto.createHash('sha256').update(JSON.stringify(body) + now).digest('hex');
         //If the key exists reject the request
         if (requestCounts.has(idempotencyKey)) {
             console.error("Duplicated payment request")
             return NextResponse.json({ error: `Duplicated request` }, { status: 409 });
         }
         requestCounts.set(idempotencyKey, 1);
         //Clear idempotency key after a minute
         setTimeout(() => {
              requestCounts.delete(idempotencyKey)
         }, 60000);


         const response = await fetch(
           'https://api.commerce.coinbase.com/charges',
           {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'X-CC-Api-Key': COINBASE_COMMERCE_API_KEY || "",
               'X-CC-Version': '2018-03-22',
             },
               body: JSON.stringify({
                   name: 'Buy Credits',
                   description: `Purchase of ${amount} USD in ${cryptoType} credits`,
                   pricing_type: 'fixed_price',
                   local_price: {
                       amount: amount,
                       currency: 'USD',
                   },
                   metadata: {
                       amount,
                       cryptoType,
                       userId,
                   }
               }),
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
         if (!data || !data.data || !data.data.addresses) {
             return NextResponse.json({error: "Could not generate a payment address from the API"}, {status: 500})
         }

         console.log(`Payment address generated successfully for user: ${userId}`);
         return NextResponse.json({ paymentAddress: data.data.addresses[cryptoType] });
     } catch (error) {
        console.error('Error creating payment:', error);
        return NextResponse.json({ 
            error: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }, { status: 500 });
    }
}