// server.js (CommonJS - ready to use)
const express = require('express');
const sgMail = require('@sendgrid/mail');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 1) Use your SendGrid API key from Replit Secrets
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 2) Parse JSON from the form
app.use(express.json());

// 3) Serve your website files
// If your index.html is in the project ROOT, leave "." as is.
// If your site files are in a folder like "public", change "." to "public".
app.use(express.static('.'));

// 4) Form endpoint: receives order & sends you an email
app.post('/api/send-order', async (req, res) => {
  const { name, email, details } = req.body || {};
  if (!name || !email || !details) {
    return res.status(400).send('Missing name, email, or details.');
  }

  const msg = {
    to: 'dbrack37@gmail.com',         // ✅ your personal email
    from: 'orders@headrust.com',      // ✅ your domain sender
    replyTo: 'dbrack37@gmail.com',

    subject: `New Headrust order from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nDetails:\n${details}`,
    html: `
      <h2>New Order Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Details:</strong><br>${String(details).replace(/\n/g,'<br>')}</p>
    `
  };

  try {
    await sgMail.send(msg);
    res.status(200).send('OK');
  } catch (err) {
    console.error('SendGrid error:', err?.response?.body || err.message || err);
    res.status(500).send('Failed to send.');
  }
});

// 5) Health check (optional)
app.get('/health', (_req, res) => res.send('ok'));

app.listen(PORT, () => console.log(`Server running on :${PORT}`));
