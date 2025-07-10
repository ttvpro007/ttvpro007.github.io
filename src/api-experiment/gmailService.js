import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

// If modifying these scopes, delete token.json.
// Updated scopes to include sending emails
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose'
];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
// Updated to look for credentials.json in src/data directory
const CREDENTIALS_PATH = path.join(process.cwd(), 'src', 'data', 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Creates a base64 encoded email message.
 *
 * @param {string} to - Recipient email address
 * @param {string} from - Sender email address
 * @param {string} subject - Email subject
 * @param {string} messageText - Email body text
 * @return {string} Base64 encoded email
 */
function createMessage(to, from, subject, messageText) {
  const message = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    '',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    '',
    messageText
  ].join('\r\n');

  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Sends an email using Gmail API.
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} messageText - Email body text
 * @param {string} from - Sender email address (optional, defaults to authenticated user)
 * @return {Promise<Object>} Response from Gmail API
 */
async function sendEmail(auth, to, subject, messageText, from = null) {
  const gmail = google.gmail({version: 'v1', auth});
  
  // If no from address is provided, use the authenticated user's email
  if (!from) {
    const profile = await gmail.users.getProfile({userId: 'me'});
    from = profile.data.emailAddress;
  }

  const message = createMessage(to, from, subject, messageText);
  
  try {
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: message
      }
    });
    
    console.log('Email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Sends a contact form email.
 *
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Sender's name
 * @param {string} contactData.email - Sender's email
 * @param {string} contactData.subject - Email subject
 * @param {string} contactData.message - Email message
 * @param {string} recipientEmail - Your email address to receive the contact form
 * @return {Promise<Object>} Response from Gmail API
 */
async function sendContactFormEmail(contactData, recipientEmail) {
  const auth = await authorize();
  
  const subject = `Portfolio Contact: ${contactData.subject}`;
  const messageText = `
Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.subject}

Message:
${contactData.message}

---
This email was sent from your portfolio contact form.
  `.trim();

  return await sendEmail(auth, recipientEmail, subject, messageText);
}

/**
 * Lists the labels in the user's account (for testing purposes).
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log('No labels found.');
    return;
  }
  console.log('Labels:');
  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
}

/**
 * Test function to verify Gmail API connection.
 */
async function testGmailConnection() {
  try {
    const auth = await authorize();
    await listLabels(auth);
    console.log('Gmail API connection successful!');
    return true;
  } catch (error) {
    console.error('Gmail API connection failed:', error);
    return false;
  }
}

export {
  authorize,
  sendEmail,
  sendContactFormEmail,
  listLabels,
  testGmailConnection
}; 