require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

// Add HTML to text conversion function
function convertHtmlToText(html) {
    if (!html) return '';
    
    // Replace common HTML tags with appropriate formatting
    let text = html
        .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newlines
        .replace(/<\/p>/gi, '\n\n') // Convert paragraph ends to double newlines
        .replace(/<p>/gi, '') // Remove paragraph starts
        .replace(/<strong>(.*?)<\/strong>/gi, '*$1*') // Convert bold to markdown
        .replace(/<b>(.*?)<\/b>/gi, '*$1*')
        .replace(/<em>(.*?)<\/em>/gi, '_$1_') // Convert italic to markdown
        .replace(/<i>(.*?)<\/i>/gi, '_$1_')
        .replace(/<u>(.*?)<\/u>/gi, '_$1_') // Convert underline to markdown
        .replace(/<h1>(.*?)<\/h1>/gi, '*$1*\n') // Convert headers
        .replace(/<h2>(.*?)<\/h2>/gi, '*$1*\n')
        .replace(/<h3>(.*?)<\/h3>/gi, '*$1*\n')
        .replace(/<ul>(.*?)<\/ul>/gi, '$1\n') // Convert lists
        .replace(/<ol>(.*?)<\/ol>/gi, '$1\n')
        .replace(/<li>(.*?)<\/li>/gi, '• $1\n')
        .replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n') // Convert blockquotes
        .replace(/<a href="(.*?)">(.*?)<\/a>/gi, '$2 ($1)') // Convert links
        .replace(/<[^>]+>/g, '') // Remove any remaining HTML tags
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
        .trim();

    return text;
}

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for image upload
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// API Endpoints
app.post('/api/posts', async (req, res) => {
  try {
    const { message, image } = req.body;

    // Convert HTML content to formatted text
    const formattedMessage = convertHtmlToText(message);

    if (image) {
      // Create form data for image upload
      const formData = new FormData();
      formData.append('message', formattedMessage);
      formData.append('access_token', process.env.FACEBOOK_ACCESS_TOKEN);
      
      // Convert base64 to buffer
      const base64Data = image.split(',')[1];
      const imageBuffer = Buffer.from(base64Data, 'base64');
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
      
      res.json({ success: true, data: response.data });
    } else {
      // Regular text post without image
      const response = await axios.post(
        `https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/feed`,
        {
          message: formattedMessage,
          access_token: process.env.FACEBOOK_ACCESS_TOKEN,
        }
      );
      res.json({ success: true, data: response.data });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.response?.data || error.message 
    });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/posts`,
      {
        params: { 
          access_token: process.env.FACEBOOK_ACCESS_TOKEN,
          fields: 'message,created_time,full_picture,attachments{media,type},likes.summary(true),comments{message,created_time,from{name,picture},comments{message,created_time,from{name,picture}}}'
        },
      }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.response?.data || error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
}); 