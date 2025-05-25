const axios = require('axios');
const FormData = require('form-data');

exports.handler = async function(event, context) {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Get posts
      const response = await axios.get(
        `https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/posts`,
        {
          params: { 
            access_token: process.env.FACEBOOK_ACCESS_TOKEN,
            fields: 'message,created_time,full_picture,attachments{media,type},likes.summary(true),comments{message,created_time,from{name,picture},comments{message,created_time,from{name,picture}}}'
          },
        }
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: response.data })
      };
    } else if (event.httpMethod === 'POST') {
      // Create post
      const formData = new FormData();
      const body = JSON.parse(event.body);
      
      formData.append('message', body.message);
      formData.append('access_token', process.env.FACEBOOK_ACCESS_TOKEN);

      if (body.image) {
        // Handle image upload
        const imageBuffer = Buffer.from(body.image.split(',')[1], 'base64');
        formData.append('source', imageBuffer, {
          filename: 'image.jpg',
          contentType: 'image/jpeg'
        });

        const response = await axios.post(
          `https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/photos`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          }
        );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: response.data })
        };
      } else {
        // Text-only post
        const response = await axios.post(
          `https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/feed`,
          {
            message: body.message,
            access_token: process.env.FACEBOOK_ACCESS_TOKEN,
          }
        );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: response.data })
        };
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.response?.data || error.message 
      })
    };
  }
}; 