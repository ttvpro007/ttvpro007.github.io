# Gmail API Service - Experiment

This service provides Gmail API integration for sending emails from your portfolio contact form.

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click on it and press "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Desktop application" as the application type
4. Give it a name (e.g., "Portfolio Gmail Service")
5. Download the credentials file and rename it to `credentials.json`
6. Place `credentials.json` in your `src/data` directory

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: Your portfolio name
   - User support email: Your email
   - Developer contact information: Your email
4. Add the following scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.compose`
5. Add test users (your Gmail address)

### 4. Test the Service

1. Update the recipient email in `testGmailService.js`:
   ```javascript
   const recipientEmail = 'your-actual-email@gmail.com';
   ```

2. Run the test script:
   ```bash
   node src/api/testGmailService.js
   ```

3. On first run, a browser window will open for OAuth authentication
4. Sign in with your Gmail account and authorize the application
5. A `token.json` file will be created automatically

## Usage

### Basic Email Sending

```javascript
const { sendEmail } = require('./gmailService');

const auth = await authorize();
await sendEmail(auth, 'recipient@example.com', 'Subject', 'Message body');
```

### Contact Form Integration

```javascript
const { sendContactFormEmail } = require('./gmailService');

const contactData = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Portfolio Inquiry',
  message: 'I would like to discuss a project...'
};

await sendContactFormEmail(contactData, 'your-email@gmail.com');
```

## API Reference

### `authorize()`
Loads or requests OAuth2 authorization. Returns an authorized OAuth2 client.

### `sendEmail(auth, to, subject, messageText, from)`
Sends an email using Gmail API.
- `auth`: Authorized OAuth2 client
- `to`: Recipient email address
- `subject`: Email subject
- `messageText`: Email body
- `from`: Sender email (optional, defaults to authenticated user)

### `sendContactFormEmail(contactData, recipientEmail)`
Sends a formatted contact form email.
- `contactData`: Object with `name`, `email`, `subject`, `message`
- `recipientEmail`: Your email address to receive the contact form

### `testGmailConnection()`
Tests the Gmail API connection and lists labels.

## Security Notes

- Keep `credentials.json` and `token.json` secure and never commit them to version control
- Add both files to your `.gitignore`
- The service uses OAuth2 for secure authentication
- Tokens are automatically refreshed when needed

## Troubleshooting

### "credentials.json not found"
- Make sure you downloaded the credentials file from Google Cloud Console
- Ensure it's named `credentials.json` and placed in the `src/data` directory

### "Gmail API not enabled"
- Go to Google Cloud Console and enable the Gmail API for your project

### "OAuth consent screen not configured"
- Configure the OAuth consent screen in Google Cloud Console
- Add your email as a test user

### "Invalid credentials"
- Delete `token.json` and re-authenticate
- Make sure your `credentials.json` is valid and not corrupted 