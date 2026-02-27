
'use server';

import nodemailer from 'nodemailer';
import { z } from 'zod';

const SendEmailInputSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  message: z.string().min(1, { message: 'Message is required.' }),
});

export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

export interface SendEmailResult {
  success: boolean;
  message: string;
}

export async function sendEmailAction(input: SendEmailInput): Promise<SendEmailResult> {
  const validation = SendEmailInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors.map((e) => e.message).join(', '),
    };
  }

  const { name, email, message } = validation.data;

  const emailServerUser = process.env.EMAIL_SERVER_USER;
  const emailServerPassword = process.env.EMAIL_SERVER_PASSWORD;
  const emailServerHost = process.env.EMAIL_SERVER_HOST;
  const emailServerPortEnv = process.env.EMAIL_SERVER_PORT;
  // Use a fallback for EMAIL_TO_ADDRESS if the environment variable is not set
  const emailTo = process.env.EMAIL_TO_ADDRESS || 'aashv143@gmail.com'; 

  // Updated the check to only fail if other critical variables are missing,
  // as emailTo now has a fallback.
  const criticalEnvVars = {
    EMAIL_SERVER_USER: emailServerUser,
    EMAIL_SERVER_PASSWORD: emailServerPassword,
    EMAIL_SERVER_HOST: emailServerHost,
    EMAIL_SERVER_PORT: emailServerPortEnv,
    // EMAIL_TO_ADDRESS is no longer checked here as it has a fallback
  };

  // Check if EMAIL_TO_ADDRESS was explicitly set to empty string or not provided, and no fallback would be desired.
  // However, since we provide a fallback, we only check if the explicitly set process.env.EMAIL_TO_ADDRESS is missing for logging,
  // but the function will proceed with the fallback.
  if (!process.env.EMAIL_TO_ADDRESS) {
    console.warn("EMAIL_TO_ADDRESS environment variable is not set. Using fallback 'aashv143@gmail.com'. It's recommended to set this in your hosting provider's settings for production.");
  }
  
  if (!emailTo) { // This should ideally not happen now with the fallback, but as a safeguard.
    const errorMessage = "Email service is not configured: EMAIL_TO_ADDRESS is ultimately not defined even with fallback. This is an unexpected state.";
    console.error(errorMessage);
    return { success: false, message: errorMessage };
  }


  const missingCriticalVars = Object.entries(criticalEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingCriticalVars.length > 0) {
    const errorMessage = `Email service is not configured. Missing required environment variables: ${missingCriticalVars.join(', ')}. Please ensure these are set in your Netlify (or other hosting provider) deployment settings.`;
    console.error(errorMessage);
    return { success: false, message: errorMessage };
  }

  const emailServerPort = parseInt(emailServerPortEnv!, 10);
  if (isNaN(emailServerPort)) {
    const errorMessage = "Invalid EMAIL_SERVER_PORT environment variable. It must be a number. Please check your Netlify (or other hosting provider) deployment settings.";
    console.error(errorMessage);
    return { success: false, message: errorMessage };
  }
  
  let emailServerSecure = process.env.EMAIL_SERVER_SECURE === 'true';
  if (process.env.EMAIL_SERVER_SECURE === undefined && emailServerPort === 465) {
    emailServerSecure = true;
  }

  console.log(`Attempting to send email via Nodemailer. To: ${emailTo}, From (config): ${emailServerUser}, Host: ${emailServerHost}, Port: ${emailServerPort}, Secure: ${emailServerSecure}`);

  const transporter = nodemailer.createTransport({
    host: emailServerHost,
    port: emailServerPort,
    secure: emailServerSecure, 
    auth: {
      user: emailServerUser,
      pass: emailServerPassword,
    },
    connectionTimeout: 10000, 
    socketTimeout: 10000,
    debug: process.env.NODE_ENV === 'development', 
    logger: process.env.NODE_ENV === 'development', 
  });

  const mailOptions = {
    from: `"Portfolio Contact Form" <${emailServerUser}>`, 
    to: emailTo, 
    replyTo: email,
    subject: `New Portfolio Contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Nodemailer: Email sent successfully: %s', info.messageId);
    return { success: true, message: "Thank you for your message. I'll get back to you soon!" };
  } catch (error) {
    console.error('Nodemailer: Error sending email:', error);
    let errorMessage = 'There was a problem sending your message. Please check server logs for Nodemailer error details.';
    
    if (error instanceof Error) {
        const nodemailerError = error as any; 
        if (nodemailerError.code === 'ECONNREFUSED' || nodemailerError.code === 'ENOTFOUND' || nodemailerError.code === 'EHOSTUNREACH') {
            errorMessage = `Could not connect to email server at ${emailServerHost}:${emailServerPort}. Please check server address, port, and network settings in your hosting environment.`;
        } else if (nodemailerError.responseCode === 535 || nodemailerError.code === 'EAUTH' || (nodemailerError.message && nodemailerError.message.toLowerCase().includes('authentication'))) { 
            errorMessage = 'Email server authentication failed. Please check your email credentials (EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD) in your hosting environment variables. If you are using a service like Gmail, you MUST generate an "App Password".';
        } else if (nodemailerError.code === 'ETIMEDOUT' || (error.message && error.message.toLowerCase().includes('timeout'))) {
            errorMessage = `The email server at ${emailServerHost} timed out. Please try again later or check server status.`;
        } else if (nodemailerError.code === 'EENVELOPE') {
            errorMessage = 'There was an issue with the email recipient or sender addresses. Please check them.';
        } else if (nodemailerError.code === 'ESOCKET') {
             errorMessage = `A socket error occurred while connecting to ${emailServerHost}:${emailServerPort}. This could be a TLS/SSL issue or network problem. Ensure 'EMAIL_SERVER_SECURE' is set correctly in your hosting environment.`;
        } else {
             errorMessage = `Failed to send email: ${error.message || 'Unknown Nodemailer error'}. Check server logs.`;
        }
    }
    console.error(`Nodemailer: Detailed error message for client: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}
