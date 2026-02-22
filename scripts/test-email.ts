import { sendTestEmail } from '../lib/email';

async function testEmail() {
  const emailAddress = process.argv[2];

  if (!emailAddress) {
    console.error('\n❌ Please provide an email address');
    console.log('Usage: npx tsx scripts/test-email.ts your-email@example.com\n');
    process.exit(1);
  }

  console.log(`\n📧 Sending test email to: ${emailAddress}\n`);

  try {
    const result = await sendTestEmail(emailAddress);

    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log(`Message ID: ${result.messageId}\n`);
      console.log('Check your inbox (and spam folder) for the test email.\n');
    } else {
      console.error('❌ Failed to send test email');
      console.error('Error:', result.error);
      console.log('\nMake sure you have:');
      console.log('1. Added RESEND_API_KEY to your .env file');
      console.log('2. Installed the resend package (npm install resend)');
      console.log('3. Set up your Resend account at https://resend.com\n');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testEmail();
