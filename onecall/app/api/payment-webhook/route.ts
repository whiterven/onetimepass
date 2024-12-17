// app/api/payment-webhook/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
const COINBASE_COMMERCE_WEBHOOK_SECRET = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

// Initialize Prisma client
const prisma = new PrismaClient();

// Basic in memory queue for retries
interface WebhookQueueItem {
    body: string;
    signature: string;
    retries: number;
}

const webhookQueue: WebhookQueueItem[] = [];
const MAX_RETRIES = 3;

// Zod schema to validate metadata
const metadataSchema = z.object({
    amount: z.string().min(1),
    cryptoType: z.enum(['bitcoin', 'usdt']),
    userId: z.string().min(1)
});

// Type for Webhook Processing Result
interface WebhookProcessResult {
    message: string;
    status: number;
}

// Real implementation to update user credits using prisma
const updateUserCredits = async (amount: string, cryptoType: string, userId: string): Promise<void> => {
    try {
        // Convert amount to a number
        const amountNum = Number(amount);

       // Fetch user from the database
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
           console.error(`User not found: ${userId}`);
           throw new Error(`User not found: ${userId}`);
       }

        const newCredits = user.credits + amountNum;
        await prisma.user.update({
             where: {
               id: userId,
             },
             data: {
               credits: newCredits,
             },
           });

        console.log(`User ${userId} credits updated successfully with ${amount} ${cryptoType}. Current balance: ${newCredits}`);
    } catch (error) {
        console.error(`Error updating user credits for ${userId}:`, error);
        throw new Error(`Failed to update user credits: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

const processWebhook = async (body: string, signature: string): Promise<WebhookProcessResult> => {
    try {
        const hmac = crypto.createHmac('sha256', COINBASE_COMMERCE_WEBHOOK_SECRET || "");
        hmac.update(body);
        const expectedSignature = hmac.digest('hex');
        if (signature !== expectedSignature) {
            console.error('Invalid signature:', signature, expectedSignature);
            throw new Error('Invalid signature');
        }

        const data = JSON.parse(body);
        if (data.event.type === 'charge:confirmed') {
            const metadataValidation = metadataSchema.safeParse(data.event.data.metadata)
            if(!metadataValidation.success) {
                console.error('Invalid Metadata', metadataValidation.error.flatten().fieldErrors)
                throw new Error(`Invalid metadata: ${JSON.stringify(metadataValidation.error.flatten().fieldErrors)}`)
            }
            const { amount, cryptoType, userId } = metadataValidation.data

            await prisma.$transaction(async () => {
                await updateUserCredits(amount, cryptoType, userId);
            });
            console.log('Payment confirmed and credits updated successfully');
            return { message: 'Payment confirmed and credits updated', status: 200 };
        }

       console.log('Webhook received successfully with a different event');
       return { message: 'Webhook received successfully', status: 200 };

    } catch (error) {
        console.error('Error processing webhook:', error);
        throw new Error(`Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const handleWebhookRetry = async (): Promise<void> => {
   if (webhookQueue.length === 0) return;
    const webhookItem = webhookQueue.shift();
    if (!webhookItem) return;

    const { body, signature, retries } = webhookItem;
    try {
        await processWebhook(body, signature);
        console.log(`Webhook processed successfully on retry ${retries}.`)
    } catch (error) {
        console.error(`Webhook failed after retry ${retries}:`, error);
       if (retries < MAX_RETRIES) {
            console.log("Adding the webhook to the queue for retry");
           webhookQueue.push({ body, signature, retries: retries + 1 });
        } else {
            console.error("Webhook failed after max retries, discarding the message");
       }
    }
}

export async function POST(request: Request) {
    try {
        const signature = request.headers.get('x-cc-webhook-signature');
        const body = await request.text();

        if (!signature) {
           console.error('No signature found')
            return NextResponse.json({ message: "No signature found" }, { status: 400 });
        }
       //Initial webhook processing, add to queue if failed
        try {
            const result = await processWebhook(body, signature);
            return NextResponse.json({message: result.message}, {status: result.status})
        } catch (error) {
            console.error('Initial webhook failed: adding to queue for retry', error)
            webhookQueue.push({body, signature, retries: 1});
            return NextResponse.json({ message: 'Webhook received and added to queue for retry' }, { status: 202 });

       } finally {
            // Process queued messages
            await handleWebhookRetry();
        }
    } catch (error) {
         console.error('Error processing payment webhook:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "An unexpected error occurred" 
        }, { status: 500 });
    }
}