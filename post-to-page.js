// post-to-page.js
require('dotenv').config();
const axios = require('axios');

const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

if (!PAGE_ID || !ACCESS_TOKEN) {
  console.error('❌ Error: Missing environment variablesFACEBOOK_PAGE_ID. Please check your .env file.');
  process.exit(1);
}

const message = '🚀 Hello from Mushi\'s Node.js SECOND POST FOR FUNscript!';

async function postToPage() {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/${PAGE_ID}/feed`,
      {
        message,
        access_token: ACCESS_TOKEN,
      }
    );
    console.log('✅ Post successful:', response.data);
  } catch (error) {
    console.error('❌ Error posting:', error.response?.data || error.message);
  }
}

postToPage();
