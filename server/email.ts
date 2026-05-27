import sgMail from '@sendgrid/mail';

// Initialize SendGrid with detailed logging
if (process.env.SENDGRID_API_KEY) {
  const apiKey = process.env.SENDGRID_API_KEY;
  sgMail.setApiKey(apiKey);
  console.log('✅ SendGrid API key configured (key length:', apiKey.length, 'chars)');
  console.log('📧 SendGrid will send emails from: noreply@headrust.com to: dbrack37@gmail.com');
} else {
  console.error('❌ SENDGRID_API_KEY environment variable not set');
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

interface MerchandiseOrderEmailParams {
  name: string;
  email: string;
  shirtQuantity: number;
  shirtSizes: string[];
  hatQuantity: number;
  albumQuantity: number;
  albumColors: string[];
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  shippingCost?: string;
  subtotal?: string;
  totalAmount: string;
  meta: {
    ip?: string;
    userAgent?: string;
    timestamp: string;
  };
}

export async function sendContactEmail(params: ContactEmailParams): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SendGrid API key not configured - contact email not sent');
    throw new Error('SendGrid API key not configured');
  }

  const to = 'dbrack37@gmail.com';
  const from = 'noreply@headrust.com'; // Using verified SendGrid sender
  
  const { name, email, subject, message, inquiryType, phone, meta } = params;

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #000; padding: 20px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: #d4af37; margin: 0; font-size: 24px;">HEADRUST</h1>
        <p style="color: #fff; margin: 5px 0 0 0; font-size: 14px;">Official Band Website</p>
      </div>
      
      <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
        New Contact Form Submission
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

  const mailOptions = {
    to,
    from: {
      email: from,
      name: 'Headrust Official Website'
    },
    subject: emailSubject,
    text: textMessage,
    html: htmlMessage,
    categories: ['contact-form'],
    customArgs: {
      source: 'headrust-website',
      type: 'contact'
    }
  };

  try {
    console.log(`📨 Attempting to send contact email from ${from} to ${to}...`);
    console.log(`📝 Email details: Subject="${emailSubject}", Inquiry Type=${inquiryType}`);
    const result = await sgMail.send(mailOptions);
    console.log(`✅ Contact email sent successfully to ${to}`, result[0]?.headers?.['x-message-id']);
    return;
  } catch (error: any) {
    console.error('❌ SendGrid contact email error - DETAILED INFO:');
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    console.error('Error status:', error?.response?.status);
    console.error('Error response body:', JSON.stringify(error?.response?.body, null, 2));
    console.error('Full error:', error);
    throw new Error(`Failed to send email: ${error?.message || 'Unknown error'}`);
  }
}

export async function sendMerchandiseOrderEmail(params: MerchandiseOrderEmailParams): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SendGrid API key not configured - merchandise order email not sent');
    throw new Error('SendGrid API key not configured');
  }

  const to = 'dbrack37@gmail.com';
  const from = 'noreply@headrust.com'; // Using verified SendGrid sender
  
  const { 
    name, 
    email, 
    shirtQuantity, 
    shirtSizes, 
    hatQuantity, 
    albumQuantity,
    albumColors,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingZip,
    shippingCost,
    subtotal,
    totalAmount, 
    meta 
  } = params;

  // Build order details
  const orderItems = [];
  if (shirtQuantity > 0) {
    const sizeText = shirtSizes && shirtSizes.length > 0 
      ? ` (Sizes: ${shirtSizes.join(', ')})` 
      : '';
    orderItems.push(`${shirtQuantity}x Eyes on Empire T-Shirt${sizeText} - $${(shirtQuantity * 25).toFixed(2)}`);
  }
  if (hatQuantity > 0) {
    orderItems.push(`${hatQuantity}x Headrust Hat - $${(hatQuantity * 30).toFixed(2)}`);
  }
  if (albumQuantity > 0) {
    const colorText = albumColors && albumColors.length > 0 
      ? ` (Colors: ${albumColors.map(color => color === 'black' ? 'Black Vinyl' : 'Clear Vinyl').join(', ')})` 
      : '';
    orderItems.push(`${albumQuantity}x Limited Edition 12" Record${colorText} - $${(albumQuantity * 35).toFixed(2)}`);
  }

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #000; padding: 20px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: #d4af37; margin: 0; font-size: 24px;">HEADRUST</h1>
        <p style="color: #fff; margin: 5px 0 0 0; font-size: 14px;">Official Band Website</p>
      </div>
      
      <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
        New Merchandise Order
      </h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Customer Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Customer Email:</strong> ${escapeHtml(email)}</p>
        ${shippingAddress || (shippingCity && shippingState) ? `<p><strong>Ship To:</strong><br/>${shippingAddress ? `${escapeHtml(shippingAddress)}<br/>` : ''}${shippingCity && shippingState ? `${escapeHtml(shippingCity)}, ${escapeHtml(shippingState)} ${escapeHtml(shippingZip || '')}` : ''}</p>` : ''}
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
          ${subtotal ? `<p><strong>Subtotal:</strong> ${escapeHtml(subtotal)}</p>` : ''}
          ${shippingCost && shippingCost !== '$0.00' ? `<p><strong>Shipping:</strong> ${escapeHtml(shippingCost)}</p>` : ''}
          ${shippingCost === '$0.00' ? `<p><strong>Shipping:</strong> <span style="color: #d4af37; font-weight: bold;">FREE</span></p>` : ''}
          <p><strong>Order Total:</strong> <span style="color: #d4af37; font-weight: bold; font-size: 1.2em;">${escapeHtml(totalAmount)}</span></p>
        </div>
      </div>
      
      <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #333;">Order Details:</h3>
        <ul style="list-style-type: none; padding: 0;">
          ${orderItems.map(item => `<li style="padding: 8px 0; border-bottom: 1px solid #eee;">• ${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
      
      <div style="background: #fffaf0; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #d4af37;">
        <p style="margin: 0; font-weight: bold; color: #333;">Next Steps:</p>
        <p style="margin: 5px 0 0 0; color: #666;">Contact the customer to arrange payment and shipping details.</p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
        <small style="color: #666;">
          <strong>Order Details:</strong><br/>
          Time: ${meta.timestamp}<br/>
          ${meta.ip ? `IP: ${meta.ip}<br/>` : ''}
          ${meta.userAgent ? `User Agent: ${meta.userAgent}` : ''}
        </small>
      </div>
    </div>
  `;

  const textMessage = `
New Headrust Merchandise Order

Customer: ${name}
Email: ${email}
${shippingAddress || (shippingCity && shippingState) ? `Ship To:\n${shippingAddress ? `${shippingAddress}\n` : ''}${shippingCity && shippingState ? `${shippingCity}, ${shippingState} ${shippingZip || ''}\n` : ''}` : ''}
${subtotal ? `Subtotal: ${subtotal}\n` : ''}${shippingCost && shippingCost !== '$0.00' ? `Shipping: ${shippingCost}\n` : ''}${shippingCost === '$0.00' ? `Shipping: FREE\n` : ''}Order Total: ${totalAmount}

Order Items:
${orderItems.map(item => `• ${item}`).join('\n')}

Next Steps: Contact customer to arrange payment and shipping.

---
Order Submitted: ${meta.timestamp}
${meta.ip ? `IP: ${meta.ip}\n` : ''}
  `;

  const mailOptions = {
    to,
    from: {
      email: from,
      name: 'Headrust Merchandise Orders'
    },
    subject: `New Headrust Merch Order - ${totalAmount} from ${name}`,
    text: textMessage,
    html: htmlMessage,
    categories: ['merchandise-order'],
    customArgs: {
      source: 'headrust-website',
      type: 'merchandise-order',
      orderAmount: totalAmount
    }
  };

  try {
    console.log(`📨 Attempting to send merchandise order email from ${from} to ${to}...`);
    console.log(`📦 Order details: Total=${totalAmount}, Customer=${name} (${email})`);
    const result = await sgMail.send(mailOptions);
    console.log(`✅ Merchandise order email sent successfully to ${to}`, result[0]?.headers?.['x-message-id']);
    return;
  } catch (error: any) {
    console.error('❌ SendGrid merchandise order error - DETAILED INFO:');
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    console.error('Error status:', error?.response?.status);
    console.error('Error response body:', JSON.stringify(error?.response?.body, null, 2));
    console.error('Order details:', { name, email, totalAmount });
    console.error('Full error:', error);
    throw new Error(`Failed to send order email: ${error?.message || 'Unknown error'}`);
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
