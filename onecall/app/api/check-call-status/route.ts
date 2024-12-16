// app/api/check-call-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { Redis } from '@upstash/redis';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);
const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  try {
    // Parse the request body safely
    const body = await req.json();
    const callSid = body?.callSid;

    if (!callSid) {
      return NextResponse.json({ error: 'Call SID is required' }, { status: 400 });
    }

    // Retrieve the call information from Redis
    const callInfoString = await redis.get(`call:${callSid}`);
    
    if (!callInfoString) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    // Safely parse the call info
    let callInfo: { phoneNumber?: string, status?: string } = {};
    try {
      callInfo = JSON.parse(callInfoString as string);
    } catch (parseError) {
      console.error('Error parsing call info:', parseError);
    }

    // Fetch the latest call status from Twilio
    let twilioCallStatus = '';
    try {
      const twilioCall = await client.calls(callSid).fetch();
      twilioCallStatus = twilioCall.status;
    } catch (twilioError) {
      console.error('Error fetching Twilio call status:', twilioError);
    }

    // Combine the stored info with the latest Twilio status
    const responseData = {
      phoneNumber: callInfo.phoneNumber || null,
      originalStatus: callInfo.status || null,
      currentStatus: twilioCallStatus || null
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error checking call status:', error);
    return NextResponse.json({ error: 'Failed to check call status' }, { status: 500 });
  }
}