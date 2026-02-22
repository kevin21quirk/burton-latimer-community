# Email Configuration Setup

## Resend API Setup

1. **Sign up for Resend** (Free - no credit card required)
   - Go to https://resend.com
   - Click "Sign Up" 
   - Create your account

2. **Get your API Key**
   - After signing in, go to "API Keys" in the dashboard
   - Click "Create API Key"
   - Give it a name like "Burton Latimer Newsletter"
   - Copy the API key (starts with `re_`)

3. **Add to your `.env` file**
   
   Add these variables to your `.env` file:

   ```env
   # Resend Email Service
   RESEND_API_KEY=re_your_api_key_here
   
   # Email sender (must be verified domain or use Resend's test domain)
   EMAIL_FROM=Burton Latimer Community <onboarding@resend.dev>
   
   # Your app URL (for unsubscribe links)
   NEXT_PUBLIC_APP_URL=https://your-app-url.vercel.app
   ```

4. **For Production - Verify Your Domain**
   
   To send from your own domain (e.g., newsletter@burtonlatimer.com):
   - Go to "Domains" in Resend dashboard
   - Click "Add Domain"
   - Enter your domain (e.g., burtonlatimer.com)
   - Add the DNS records they provide to your domain registrar
   - Wait for verification (usually a few minutes)
   - Update `EMAIL_FROM` to use your domain

5. **Add to Vercel Environment Variables**
   
   In your Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Add `RESEND_API_KEY` with your API key
   - Add `EMAIL_FROM` with your sender email
   - Add `NEXT_PUBLIC_APP_URL` with your production URL
   - Redeploy your app

## Testing

Run the test email script:

```bash
npx tsx scripts/test-email.ts your-email@example.com
```

## Free Tier Limits

- **3,000 emails per month**
- **100 emails per day**
- Perfect for community newsletters!

## Alternative SMTP Services

If you prefer a different service:

### SendGrid
```env
SENDGRID_API_KEY=your_key_here
EMAIL_FROM=newsletter@yourdomain.com
```

### Brevo (Sendinblue)
```env
BREVO_API_KEY=your_key_here
EMAIL_FROM=newsletter@yourdomain.com
```

You'll need to modify `lib/email.ts` to use their respective SDKs.
