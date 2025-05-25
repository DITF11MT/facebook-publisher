// post-to-page.js
const axios = require('axios');

const PAGE_ID = '629500856922200';
const ACCESS_TOKEN = 'EAAJ8djlT7LwBO8SwOcFlXJeeJU5lSWQW8fSemPqAtjZCTOn4u2aYQGaoj3vaNNBZBgfpZBVvvQYtRqnKjz4sHUIZA5iE8KZBbZAPH6SrQU9Thfsx0bw2wMKbR8OrR2s89aR2qXUqywhLsxpSICf83ZB82Wf3r65NuY5pK05PEcozGfc2vh0PusOzpXQUpxklURnbZC1bq6IoZCCzXVe62Yo1QUlzxzm1iFpj9RvoRABZAQhzHT';

const message = '🚀 Hello from Mushi\'s Node.js script!';

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
