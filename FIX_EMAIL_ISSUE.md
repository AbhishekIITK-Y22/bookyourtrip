# Fix: OTP Emails Not Sending

## The Problem

Your `.env` file has SMTP configured, but Gmail is not accepting the connection because:
1. **Gmail requires App Passwords** for SMTP, not regular passwords
2. The password you're using (`cizfo2-Mengyj-vithyf`) is likely a regular password

## Quick Fix: Use App Password

### Step 1: Create Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Make sure **2-Step Verification** is enabled (required for App Passwords)
3. Scroll down to **App passwords**
4. Click **Select app** → Choose **Mail**
5. Click **Select device** → Choose **Other (Custom name)**
6. Enter "BookYourTrip" as the name
7. Click **Generate**
8. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Edit `services/auth-service/.env` and update the password:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=abhishekraj0093@gmail.com
SMTP_PASS=your-16-character-app-password-here  # Replace with App Password
EMAIL_FROM=BookYourTrip <abhishekraj0093@gmail.com>
```

**Important**: 
- Remove spaces from the App Password (e.g., `abcdefghijklmnop`)
- Use the 16-character App Password, NOT your regular Gmail password

### Step 3: Restart Auth Service

```bash
# Stop the service (Ctrl+C in the terminal running auth-service)
# Then restart it
cd services/auth-service
npm run dev
```

### Step 4: Check Logs

After restarting, you should see:
```
INFO: SMTP transport created
  host: "smtp.gmail.com"
  user: "abhishekraj0093@gmail.com"
  port: 587
```

When you sign up, you should see:
```
INFO: Email sent successfully
  messageId: "..."
  to: "personalusebyme@gmail.com"
```

## Alternative: Check Console Logs (Development)

If you don't want to configure SMTP right now, the OTP is logged in the console. After restarting the service, you'll see:

```
═══════════════════════════════════════════════════════════
📧 DEV MODE: OTP Code (SMTP not configured)
═══════════════════════════════════════════════════════════
Email: personalusebyme@gmail.com
OTP Code: 123456
═══════════════════════════════════════════════════════════
```

## Troubleshooting

### "Invalid login" error
- Make sure you're using an **App Password**, not your regular password
- Verify 2-Step Verification is enabled
- Check that the App Password has no spaces

### "Connection timeout" error
- Check your internet connection
- Verify firewall isn't blocking port 587
- Try using port 465 with `SMTP_SECURE=true`

### Still not receiving emails?
1. Check spam folder
2. Check the console logs for error messages
3. Verify the email address is correct
4. Try sending a test email from the terminal

## Test Email Configuration

After updating, try signing up again. You should receive the OTP email within a few seconds.

