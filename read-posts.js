// read-posts.js
const axios = require('axios');

const PAGE_ID = '629500856922200';
const ACCESS_TOKEN = 'EAAJ8djlT7LwBO8SwOcFlXJeeJU5lSWQW8fSemPqAtjZCTOn4u2aYQGaoj3vaNNBZBgfpZBVvvQYtRqnKjz4sHUIZA5iE8KZBbZAPH6SrQU9Thfsx0bw2wMKbR8OrR2s89aR2qXUqywhLsxpSICf83ZB82Wf3r65NuY5pK05PEcozGfc2vh0PusOzpXQUpxklURnbZC1bq6IoZCCzXVe62Yo1QUlzxzm1iFpj9RvoRABZAQhzHT';

async function getPosts() {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/${PAGE_ID}/posts`,
      {
        params: { access_token: ACCESS_TOKEN },
      }
    );
    console.log('📄 Page Posts:\n', response.data);
  } catch (error) {
    console.error('❌ Error fetching posts:', error.response?.data || error.message);
  }
}

getPosts();
