import { Twilio } from 'twilio'
import Redis from 'ioredis'

// Use non-null assertion or provide default values
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!
const TWILIO_FUNCTION_URL = process.env.TWILIO_FUNCTION_URL!
const REDIS_URL = process.env.REDIS_URL!

const client = new Twilio(ACCOUNT_SID, AUTH_TOKEN)
const redis = new Redis(REDIS_URL)

export async function makeOtpCall(phoneNumber: string): Promise<string> {
  // Ensure TWILIO_PHONE_NUMBER is not undefined
  if (!TWILIO_PHONE_NUMBER) {
    throw new Error('Twilio phone number is not configured')
  }

  const call = await client.calls.create({
    to: phoneNumber,
    from: TWILIO_PHONE_NUMBER, // Now guaranteed to be a string
    url: TWILIO_FUNCTION_URL,
  })

  // Wait for the call to complete and the OTP to be entered
  let otp: string | null = null
  while (!otp) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    otp = await redis.get(`otp:${call.sid}`)
  }

  // Clean up the Redis key
  await redis.del(`otp:${call.sid}`)

  return otp
}