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
    const csvHeaders = 'Name,Business Name,Phone,Email,Service,Description\n';
    const csvRow = `${escapeCsv(name)},${escapeCsv(businessName)},${escapeCsv(phone)},${escapeCsv(email)},${escapeCsv(service)},${escapeCsv(description)}`;
    const csvContent = csvHeaders + csvRow;

    // Generate a clean filename using the submission date and name
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Consultation_${name.replace(/\s+/g, '_')}_${dateStr}.csv`;

    // Configure the Email Transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'buddytezzai@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Email Options
    const mailOptions = {
      from: `"Buddy Tezz AI Website" <buddytezzai@gmail.com>`,
      to: 'buddytezzai@gmail.com',
      subject: `New Lead: ${name} from ${businessName || 'N/A'}`,
      text: `You have a new consultation request from ${name}!\n\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nAttached is their data correctly formatted as a CSV Excel sheet.`,
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
