import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface ContactEmailParams {
  name: string;
  email: string;
  subject?: string;
  message: string;
  inquiryType?: string;
  phone?: string;
  meta: {
    ip?: string;
    userAgent?: string;
    timestamp: string;
  };
}

export async function sendContactEmail(params: ContactEmailParams): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not configured - email not sent');
    return;
  }

  const to = 'dbrack37@gmail.com';
  const from = 'noreply@headrust.band'; // You'll need to verify this domain in SendGrid
  
  const { name, email, subject, message, inquiryType, phone, meta } = params;

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
        New Headrust Contact Form Submission
      </h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
        ${inquiryType ? `<p><strong>Inquiry Type:</strong> ${escapeHtml(inquiryType)}</p>` : ''}
        ${subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ''}
      </div>
      
      <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #333;">Message:</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
        <small style="color: #666;">
          <strong>Submission Details:</strong><br/>
          Time: ${meta.timestamp}<br/>
          ${meta.ip ? `IP: ${meta.ip}<br/>` : ''}
          ${meta.userAgent ? `User Agent: ${meta.userAgent}` : ''}
        </small>
      </div>
    </div>
  `;

  const textMessage = `
New Headrust Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ''}
${inquiryType ? `Inquiry Type: ${inquiryType}\n` : ''}
${subject ? `Subject: ${subject}\n` : ''}

Message:
${message}

---
Submitted: ${meta.timestamp}
${meta.ip ? `IP: ${meta.ip}\n` : ''}
  `;

  const emailSubject = inquiryType === 'booking' 
    ? `Headrust Booking Inquiry from ${name}`
    : `Headrust Contact: ${subject || 'New Message'}`;

  const msg = {
    to,
    from,
    subject: emailSubject,
    text: textMessage,
    html: htmlMessage,
  };

  try {
    await sgMail.send(msg);
    console.log(`Contact email sent successfully to ${to}`);
  } catch (error: any) {
    console.error('SendGrid email error:', error?.response?.body || error.message);
    throw new Error('Failed to send email notification');
  }
}

function escapeHtml(str: string = ''): string {
  return str.replace(/[&<>"']/g, (char) => {
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return htmlEntities[char];
  });
}