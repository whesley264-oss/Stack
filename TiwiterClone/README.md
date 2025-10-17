# 🐦 TiwiterClone - Twitter/X Clone

<div align="center">

![TiwiterClone](https://img.shields.io/badge/TiwiterClone-1.0.0-blue?style=for-the-badge&logo=twitter&logoColor=white)

**A modern Twitter/X clone with all features built with Node.js, Express, MongoDB, and Socket.IO**

[![Node.js](https://img.shields.io/badge/Node.js-16+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.18+-black?style=for-the-badge&logo=express)](https://expressjs.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7+-black?style=for-the-badge&logo=socket.io)](https://socket.io)

</div>

---

## 🚀 **Features**

### **Core Features**
- ✅ **User Authentication** - Register, login, profile management
- ✅ **Tweet System** - Create, edit, delete, like, retweet, comment
- ✅ **Real-time Updates** - Live notifications and updates
- ✅ **User Profiles** - Customizable profiles with bio, avatar, cover
- ✅ **Follow System** - Follow/unfollow users, followers/following lists
- ✅ **Search & Discovery** - Search users, tweets, hashtags, trends
- ✅ **Notifications** - Real-time notifications for interactions
- ✅ **Direct Messages** - Private messaging between users
- ✅ **Responsive Design** - Mobile-first responsive interface

### **Advanced Features**
- ✅ **Hashtags & Mentions** - Automatic detection and linking
- ✅ **Media Support** - Image, video, GIF support
- ✅ **Bookmarks** - Save tweets for later
- ✅ **Thread Support** - Create tweet threads
- ✅ **Quote Tweets** - Quote and comment on tweets
- ✅ **Poll Support** - Create polls in tweets
- ✅ **Reactions** - React to messages with emojis
- ✅ **Block System** - Block and unblock users
- ✅ **Privacy Settings** - Public/private accounts
- ✅ **Edit History** - Track tweet and message edits

---

## 🛠️ **Tech Stack**

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time communication
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image/video storage

### **Frontend**
- **Vanilla JavaScript** - No framework dependencies
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid/Flexbox
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### **Dev Tools**
- **Nodemon** - Development server
- **Webpack** - Module bundler
- **Jest** - Testing framework
- **ESLint** - Code linting

---

## 📦 **Installation**

### **Prerequisites**
- Node.js 16+ 
- MongoDB 7.0+
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/tiwiter-clone.git
cd tiwiter-clone
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tiwiterclone
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

### **4. Start Development Server**
```bash
npm run dev
```

### **5. Access Application**
Open your browser and go to `http://localhost:5000`

---

## 🎯 **Usage**

### **Authentication**
1. **Register** - Create a new account
2. **Login** - Access your account
3. **Profile** - Customize your profile

### **Tweeting**
1. **Create Tweet** - Write and post tweets
2. **Like/Retweet** - Interact with tweets
3. **Comment** - Reply to tweets
4. **Bookmark** - Save tweets for later

### **Social Features**
1. **Follow Users** - Follow interesting accounts
2. **Search** - Find users, tweets, hashtags
3. **Explore** - Discover trending topics
4. **Messages** - Send direct messages

### **Customization**
1. **Profile Settings** - Update bio, avatar, cover
2. **Privacy** - Set account to public/private
3. **Notifications** - Configure notification preferences
4. **Theme** - Light/dark mode support

---

## 📁 **Project Structure**

```
tiwiter-clone/
├── models/                 # Database models
│   ├── User.js            # User model
│   ├── Tweet.js           # Tweet model
│   ├── Message.js         # Message model
│   └── Notification.js    # Notification model
├── controllers/           # Business logic
│   ├── authController.js  # Authentication
│   ├── tweetController.js # Tweet management
│   ├── userController.js  # User management
│   └── ...
├── routes/               # API routes
│   ├── auth.js          # Auth routes
│   ├── tweets.js        # Tweet routes
│   ├── users.js         # User routes
│   └── ...
├── middleware/           # Custom middleware
│   └── auth.js          # Authentication middleware
├── public/              # Static files
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── images/         # Images
├── server.js           # Main server file
├── package.json        # Dependencies
└── README.md          # Documentation
```

---

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### **Tweets**
- `POST /api/tweets` - Create tweet
- `GET /api/tweets/feed` - Get user feed
- `GET /api/tweets/:id` - Get specific tweet
- `PUT /api/tweets/:id` - Edit tweet
- `DELETE /api/tweets/:id` - Delete tweet

### **Users**
- `GET /api/users/:username` - Get user profile
- `GET /api/users/:username/tweets` - Get user tweets
- `GET /api/users/search` - Search users
- `GET /api/users/suggestions` - Get user suggestions

### **Social**
- `POST /api/follows/:userId` - Follow user
- `DELETE /api/follows/:userId` - Unfollow user
- `GET /api/follows/followers` - Get followers
- `GET /api/follows/following` - Get following

### **Interactions**
- `POST /api/likes/:tweetId` - Like tweet
- `DELETE /api/likes/:tweetId` - Unlike tweet
- `POST /api/retweets/:tweetId` - Retweet
- `DELETE /api/retweets/:tweetId` - Unretweet
- `POST /api/comments/:tweetId` - Comment on tweet

### **Messages**
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get conversation
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message

### **Search**
- `GET /api/search` - General search
- `GET /api/search/trends` - Get trends
- `GET /api/search/hashtag/:hashtag` - Search by hashtag

---

## 🎨 **UI Components**

### **Main Layout**
- **Sidebar** - Navigation menu
- **Main Content** - Tweet feed, profiles, etc.
- **Right Sidebar** - Trends, suggestions

### **Tweet Components**
- **Tweet Composer** - Create new tweets
- **Tweet Card** - Display individual tweets
- **Tweet Actions** - Like, retweet, comment, bookmark

### **User Components**
- **Profile Header** - User info and stats
- **User Card** - Compact user display
- **Follow Button** - Follow/unfollow action

### **Interactive Elements**
- **Modal Dialogs** - Tweet composer, user profiles
- **Dropdown Menus** - User menu, settings
- **Loading States** - Spinners and progress indicators

---

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs for password security
- **Rate Limiting** - Prevent API abuse
- **Input Validation** - Sanitize user inputs
- **CORS Protection** - Cross-origin request security
- **Helmet.js** - Security headers
- **File Upload Security** - Validate file types and sizes

---

## 📱 **Responsive Design**

### **Mobile First**
- Touch-friendly interface
- Optimized for small screens
- Swipe gestures support
- Mobile navigation

### **Breakpoints**
- **Mobile** - < 768px
- **Tablet** - 768px - 1024px
- **Desktop** - > 1024px

### **Features**
- Collapsible sidebar
- Mobile-optimized forms
- Touch-friendly buttons
- Responsive images

---

## 🚀 **Deployment**

### **Environment Variables**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tiwiterclone
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://yourdomain.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Production Build**
```bash
npm run build
npm start
```

### **Docker Support**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🧪 **Testing**

### **Run Tests**
```bash
npm test
```

### **Test Coverage**
```bash
npm run test:coverage
```

### **Test Types**
- Unit tests for controllers
- Integration tests for API endpoints
- E2E tests for user flows

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

### **Code Style**
- Use ESLint configuration
- Follow JavaScript best practices
- Write meaningful commit messages
- Add JSDoc comments for functions

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- Twitter/X for inspiration
- MongoDB for database
- Socket.IO for real-time features
- Express.js for the web framework
- All open-source contributors

---

## 📞 **Support**

- **Issues** - [GitHub Issues](https://github.com/yourusername/tiwiter-clone/issues)
- **Discussions** - [GitHub Discussions](https://github.com/yourusername/tiwiter-clone/discussions)
- **Email** - support@tiwiterclone.com

---

<div align="center">

**Made with ❤️ by the TiwiterClone Team**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername/tiwiter-clone)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/tiwiterclone)

</div>