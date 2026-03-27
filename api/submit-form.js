export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, businessName, phone, email, service, description } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !service) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Since we need Nodemailer to send the email, we'll import it securely on the server
    const nodemailer = require('nodemailer');

    // Create a CSV string from the data (this acts exactly like an Excel sheet when opened)
    const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
    const csvHeaders = 'Name,Business Name,Phone,Email,Service,Message / Requirement\n';
    const csvRow = `${escapeCsv(name)},${escapeCsv(businessName)},${escapeCsv(phone)},${escapeCsv(email)},${escapeCsv(service)},${escapeCsv(description)}`;
    const csvContent = csvHeaders + csvRow;

    // Generate a clean filename using the submission date and name
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Lead_${name.replace(/\s+/g, '_')}_${dateStr}.csv`;

    // Configure the Email Transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'buddytezzai@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // HTML email body with all lead details
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-bottom: 20px;">🎉 New Lead from Buddy Tezz AI Website</h2>
        <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 6px; overflow: hidden;">
          <tr style="background: #f3f4f6;">
            <td style="padding: 12px 16px; font-weight: bold; color: #374151; width: 40%;">Name</td>
            <td style="padding: 12px 16px; color: #111827;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; color: #374151;">Business Name</td>
            <td style="padding: 12px 16px; color: #111827;">${businessName || 'N/A'}</td>
          </tr>
          <tr style="background: #f3f4f6;">
            <td style="padding: 12px 16px; font-weight: bold; color: #374151;">Email</td>
            <td style="padding: 12px 16px; color: #111827;"><a href="mailto:${email}" style="color: #4f46e5;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; color: #374151;">Phone Number</td>
            <td style="padding: 12px 16px; color: #111827;">${phone}</td>
          </tr>
          <tr style="background: #f3f4f6;">
            <td style="padding: 12px 16px; font-weight: bold; color: #374151;">Selected Service</td>
            <td style="padding: 12px 16px; color: #111827;">${service}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; color: #374151; vertical-align: top;">Message / Requirement</td>
            <td style="padding: 12px 16px; color: #111827;">${description || 'Not provided'}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; color: #6b7280; font-size: 13px;">A CSV file with this lead's details is attached for your records. Submitted on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST.</p>
      </div>
    `;

    // Email Options
    const mailOptions = {
      from: `"Buddy Tezz AI Website" <buddytezzai@gmail.com>`,
      to: 'buddytezzai@gmail.com',
      subject: `🔔 New Lead: ${name} — ${service}`,
      html: htmlBody,
      text: `New lead from ${name}!\n\nName: ${name}\nBusiness: ${businessName || 'N/A'}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${description || 'Not provided'}`,
      attachments: [
        {
          filename: filename,
          content: csvContent,
          contentType: 'text/csv'
        }
      ]
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success to the frontend
    return res.status(200).json({ message: 'Email sent successfully!' });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email backend error.', details: error.message });
  }
}
