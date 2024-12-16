import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { Redis } from '@upstash/redis';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);
const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  const { callSid } = await req.json();

  try {
    const call = await client.calls(callSid).fetch();
    
    // Retrieve call data from Redis
    const callData = await redis.get(`call:${callSid}`);
    let otpCode = null;

    if (callData) {
      const parsedCallData = JSON.parse(callData as string);
      otpCode = parsedCallData.otpCode;

      // Update the status in Redis
      await redis.set(`call:${callSid}`, JSON.stringify({ ...parsedCallData, status: call.status }), { ex: 3600 });
    }

    return NextResponse.json({ status: call.status, otpCode });
  } catch (error) {
    console.error('Error checking call status:', error);
    return NextResponse.json({ error: 'Failed to check call status' }, { status: 500 });
  }
}

