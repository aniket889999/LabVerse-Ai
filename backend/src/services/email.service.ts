/**
 * Email Service Placeholder
 * 
 * Note: A real email provider (like SendGrid, Resend, or AWS SES) should be integrated here
 * once the application is ready for production.
 */

export const sendBookingConfirmationEmail = async (email: string, name: string, type: string) => {
  console.log(`[EMAIL SERVICE MOCK] Preparing to send confirmation to ${email}...`);
  console.log(`[EMAIL SERVICE MOCK] Subject: Your LabVerse AI Request Received (${type})`);
  console.log(`[EMAIL SERVICE MOCK] Body: Hi ${name}, we have received your request. Our team will review it shortly.`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`[EMAIL SERVICE MOCK] Email "sent" successfully.`);
  return true;
};

export const sendAdminNotificationEmail = async (type: string, name: string, organization: string | null) => {
  console.log(`[EMAIL SERVICE MOCK] Notifying admins of new ${type} from ${name} (${organization || 'Individual'})...`);
  return true;
};
