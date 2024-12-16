'use server'

import { makeOtpCall } from './otpService'

export async function initiateOtpCall(phoneNumber: string) {
  try {
    const result = await makeOtpCall(phoneNumber)
    return { success: true, message: result }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

