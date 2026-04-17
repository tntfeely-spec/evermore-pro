// Email utility for sending notifications
// Currently logs to console. Replace with SendGrid/Resend/SES in production.

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to, subject, body }: EmailPayload): Promise<void> {
  // Production: integrate with SendGrid, Resend, or AWS SES
  // For now, log the email and POST to GHL webhook if configured
  console.log(`[EMAIL] To: ${to}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Body: ${body}`);

  const webhookUrl = process.env.GHL_NOTIFICATION_WEBHOOK;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, body }),
      });
    } catch {
      console.error('[EMAIL] Webhook delivery failed');
    }
  }
}

export function buildLeadClaimEmail(opts: {
  businessName: string;
  familyName: string;
  familyEmail: string;
  familyPhone: string | null;
  serviceType: string | null;
  message: string | null;
}): { subject: string; body: string } {
  return {
    subject: `Lead Claimed — ${opts.familyName} contact details`,
    body: [
      `Your lead claim payment was successful. Here are the full contact details:`,
      ``,
      `Family Name: ${opts.familyName}`,
      `Email: ${opts.familyEmail}`,
      `Phone: ${opts.familyPhone || 'Not provided'}`,
      `Service Type: ${opts.serviceType || 'Not specified'}`,
      `Message: ${opts.message || 'No message'}`,
      ``,
      `This family inquired through your Evermore Directory listing.`,
      `Respond promptly — families typically contact 2-3 funeral homes.`,
      ``,
      `— Evermore Pro`,
    ].join('\n'),
  };
}

export function buildNewInquiryNotificationEmail(opts: {
  businessName: string;
  familyName: string;
  serviceType: string | null;
  inquiryId: string;
  accountId: string;
  isSubscriber: boolean;
}): { subject: string; body: string } {
  const claimUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/claim?inquiry_id=${opts.inquiryId}&account_id=${opts.accountId}`;

  if (opts.isSubscriber) {
    return {
      subject: `New Family Inquiry — ${opts.familyName}`,
      body: [
        `${opts.businessName},`,
        ``,
        `A family has contacted you through Evermore Directory.`,
        ``,
        `Family: ${opts.familyName}`,
        `Service: ${opts.serviceType || 'Not specified'}`,
        ``,
        `View full details in your dashboard:`,
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/inquiries`,
        ``,
        `— Evermore Pro`,
      ].join('\n'),
    };
  }

  return {
    subject: `New Family Inquiry — ${opts.familyName} (Claim for $75)`,
    body: [
      `${opts.businessName},`,
      ``,
      `A family is looking for funeral services and contacted you through Evermore Directory.`,
      ``,
      `Family: ${opts.familyName}`,
      `Service: ${opts.serviceType || 'Not specified'}`,
      ``,
      `To receive their full contact details, claim this lead for $75:`,
      `${claimUrl}`,
      ``,
      `Subscribers get all inquiry details automatically at no per-lead cost.`,
      `Subscribe at ${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      ``,
      `— Evermore Pro`,
    ].join('\n'),
  };
}
