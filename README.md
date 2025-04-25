# TechTrendGPT 🤖

<div align="center">
  <img src="app/assets/TechTrendGPT_Logo.png" alt="TechTrendGPT Logo" width="200"/>
  <br/>
  <p>
    <strong>An AI-powered chatbot specializing in technology discussions and real-time tech news updates</strong>
  </p>
</div>

## ✨ Features

- 💬 Real-time chat interface with AI responses
- 📱 Fully responsive design for mobile and desktop
- 🔄 Stream-based responses for smooth interaction
- 📰 Integration with NewsAPI for real-time tech news
- 💡 Smart prompt suggestions for quick interactions
- 🎨 Modern UI with dark mode support
- ⌨️ Markdown support for formatted responses
- 🔗 Clickable links with proper formatting
- 📜 Auto-scrolling with manual override capability

<video width="320" height="240" controls>
  <source src="app/assets/video1.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<video width="320" height="240" controls>
  <source src="app/assets/video2.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **AI Integration**: OpenAI API
- **News Integration**: NewsAPI
- **Styling**: CSS-in-JS with styled-jsx
- **Components**: Custom-built React components
- **State Management**: React Hooks
- **API Handling**: Axios

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 16.x or later
- npm or yarn
- OpenAI API key
- NewsAPI key

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/techtrendgpt.git
   cd techtrendgpt
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEWS_API_KEY=your_newsapi_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser


## 📁 Project Structure

```
techtrendgpt/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── assets/
│   │   └── TechTrendGPT_Logo.png
│   ├── components/
│   │   ├── FormattedMessage.tsx
│   │   ├── MessageComponent.tsx
│   │   └── PromptSuggestionButton.tsx
│   ├── utils/
│   │   ├── newsApi.ts
│   │   └── responseFormatter.ts
│   ├── global.css
│   └── page.tsx
├── public/
└── package.json
```

## 🔧 Key Components

### MessageComponent
- Handles chat message display
- Manages message streaming
- Supports markdown formatting
- Implements auto-scrolling

### FormattedMessage
- Processes AI responses
- Renders markdown content
- Handles code block formatting
- Manages link formatting

### PromptSuggestionButton
- Provides quick-access buttons
- Suggests common queries
- Enhances user interaction

## 🔌 API Integration

### OpenAI API
- Handles chat completions
- Manages streaming responses
- Processes user queries

### NewsAPI
- Fetches latest tech news
- Formats news articles
- Provides real-time updates

## ⏰ Scheduled Updates

The application includes an automated cron job for news updates:

```bash
# Run the cron job
npm run cron
# or
yarn cron
```

Default schedule: Daily at midnight (configurable in `package.json`)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

