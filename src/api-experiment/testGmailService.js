import { sendContactFormEmail } from './gmailService.js';

/**
 * Test script for Gmail service (send email only)
 * Run this with: node src/api/testGmailService.js
 */

async function runTests() {
  console.log('🧪 Testing Gmail Service: Send Email Only...\n');

  // Test: Send a test contact form email
  console.log('Testing contact form email sending...');
  
  const testContactData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Contact Form',
    message: 'This is a test message from the Gmail service.'
  };

  const recipientEmail = 'your-email@gmail.com'; // TODO: Replace with your actual email address

  try {
    const result = await sendContactFormEmail(testContactData, recipientEmail);
    console.log('✅ Test email sent successfully!');
    console.log('   Message ID:', result.id);
  } catch (error) {
    console.log('❌ Failed to send test email:', error.message);
  }
}

// Run tests immediately
runTests().catch(console.error);

export { runTests }; 