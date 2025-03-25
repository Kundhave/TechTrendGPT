<<<<<<< HEAD
# TechTrendGPT 🤖

TechTrendGPT is an AI-powered chatbot that specializes in technology-related discussions and provides real-time updates on tech news. Built with Next.js and the OpenAI API, it offers an intuitive interface similar to ChatGPT while focusing specifically on technology topics.

## Features ✨

- 💬 Real-time chat interface with AI responses
- 📱 Fully responsive design for mobile and desktop
- 🔄 Stream-based responses for smooth interaction
- 📰 Integration with NewsAPI for real-time tech news
- 💡 Smart prompt suggestions for quick interactions
- 🎨 Modern UI with dark mode support
- ⌨️ Markdown support for formatted responses
- 🔗 Clickable links with proper formatting
- 📜 Auto-scrolling with manual override capability

## Tech Stack 🛠️

- **Frontend Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **AI Integration**: OpenAI API
- **News Integration**: NewsAPI
- **Styling**: CSS-in-JS with styled-jsx
- **Components**: Custom-built React components
- **State Management**: React Hooks
- **API Handling**: Axios

## Getting Started 🚀

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- OpenAI API key
- NewsAPI key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/techtrendgpt.git
   cd techtrendgpt
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEWS_API_KEY=your_newsapi_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Scheduled Updates ⏰

The application includes a cron job that automatically updates the tech news feed. This ensures that users always have access to the latest technology news and updates.

### Setting up the Cron Job

1. The cron job is configured to run daily and update the news database:
   ```bash
   npm run cron
   # or
   yarn cron
   ```

2. You can modify the cron schedule in `package.json`:
   ```json
   {
     "scripts": {
       "cron": "node scripts/updateNews.js"
     }
   }
   ```

3. Default cron schedule is set to run daily at midnight. You can adjust the timing in the cron configuration to match your needs.

## Project Structure 📁

```
techtrendgpt/
├── app/
│   ├── api/
│   │   └── chat/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── FormattedMessage.tsx
│   │   │   ├── MessageComponent.tsx
│   │   │   └── PromptSuggestionButton.tsx
│   │   ├── utils/
│   │   │   ├── newsApi.ts
│   │   │   └── responseFormatter.ts
│   │   ├── global.css
│   │   └── page.tsx
│   ├── public/
│   └── package.json
```

## Key Components 🔑

- **MessageComponent**: Handles the display of chat messages
- **FormattedMessage**: Processes and formats AI responses with markdown support
- **PromptSuggestionButton**: Provides quick-access buttons for common queries
- **NewsAPI Integration**: Fetches and formats real-time tech news

## Features in Detail 📝

### Chat Interface
- Real-time streaming responses
- Markdown formatting support
- Code block highlighting
- Smart message formatting
- Automatic scrolling with user override

### News Integration
- Real-time tech news updates
- Formatted news presentation
- Clickable news links
- Smart news query detection

### UI/UX
- Responsive design
- Dark mode support
- Loading indicators
- Typing animations
- Smooth scrolling
- Mobile-optimized layout

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
>>>>>>> a0b9129 (Initial commit from Create Next App)
