// read-posts.js
require('dotenv').config();
const axios = require('axios');

const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

if (!PAGE_ID || !ACCESS_TOKEN) {
  console.error('❌ Error: Missing environment variables. Please check your .env file.');
  process.exit(1);
}

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
