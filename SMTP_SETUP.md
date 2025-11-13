# SMTP Email Setup Guide

## Why You're Not Receiving Emails

The OTP emails are not being sent because SMTP (email server) is not configured. In development mode, the OTP is logged to the console instead.

## Option 1: Use Console Logs (Development)

When you sign up, check the terminal where `auth-service` is running. You'll see:

```
═══════════════════════════════════════════════════════════
📧 DEV MODE: OTP Code (SMTP not configured)
═══════════════════════════════════════════════════════════
Email: your-email@example.com
OTP Code: 123456
═══════════════════════════════════════════════════════════
```

## Option 2: Configure Gmail SMTP (Recommended for Production)

### Step 1: Create Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Under **Signing in to Google**, click **2-Step Verification** (enable it if not already enabled)
4. Scroll down and click **App passwords**
5. Select **Mail** as the app and **Other (Custom name)** as the device
6. Enter "BookYourTrip" as the name
7. Click **Generate**
8. Copy the 16-character password (you'll need this)

### Step 2: Update .env File

Edit `services/auth-service/.env` and add:

```env
# SMTP Settings for Gmail
SMTP_SERVICE=gmail
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
EMAIL_FROM=BookYourTrip <your-email@gmail.com>
```

**Important**: Use the **App Password** (16 characters), NOT your regular Gmail password.

### Step 3: Restart Auth Service

After updating the .env file, restart the auth-service:

```bash
# Stop the service (Ctrl+C)
# Then restart it
cd services/auth-service
npm run dev
```

## Option 3: Use Other Email Services

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=BookYourTrip <noreply@yourdomain.com>
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
EMAIL_FROM=BookYourTrip <noreply@yourdomain.com>
```

### AWS SES

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-access-key-id
SMTP_PASS=your-aws-secret-access-key
EMAIL_FROM=BookYourTrip <noreply@yourdomain.com>
```

## Troubleshooting

### Gmail "Less secure app" error
- Use **App Password** instead of regular password
- Make sure 2-Step Verification is enabled

### Email not sending
1. Check that all SMTP variables are set in `.env`
2. Restart the auth-service after updating `.env`
3. Check the console logs for error messages
4. Verify the App Password is correct (16 characters, no spaces)

### Testing Email Configuration

Once configured, test by signing up again. You should receive an email with the OTP code.

## Security Notes

- **Never commit** `.env` files to git (they're already in `.gitignore`)
- Use **App Passwords** for Gmail, not your regular password
- For production, use a dedicated email service (SendGrid, Mailgun, AWS SES)
- Rotate passwords regularly

