# 🤖 LLM Code Guesser

A fun web game where you try to guess which AI model wrote a given piece of code! Test your ability to distinguish between different LLMs' coding styles.

## 🎮 How to Play

1. Enter your OpenRouter API key
2. Select a programming language (Python is default)
3. Click "Generate New Code" to get code from a random AI model
4. Guess which model wrote it from 8 options
5. Track your score across multiple rounds!

## 🚀 Models Included

- Claude 3.5 Sonnet
- Claude 3.5 Haiku  
- Claude 3 Opus
- GPT-4o
- GPT-4o Mini
- o1-mini
- Gemini 2.0 Flash
- Gemini Exp

## 💻 Programming Languages Supported

- Python
- JavaScript
- TypeScript
- Java
- C++
- Rust
- Go

## 🌐 Deployment

### GitHub Pages with Environment Variable (Recommended)

**Option 1: Automatic deployment with API key**
1. Fork this repository
2. Go to Settings → Secrets and variables → Actions
3. Add a new secret: `OPENROUTER_API_KEY` with your OpenRouter API key
4. Go to Settings → Pages → Source: "GitHub Actions"
5. Push to main branch - the workflow will automatically build and deploy
6. Your site will be available at `https://yourusername.github.io/repo-name`
7. Users won't need to enter an API key!

**Option 2: Manual deployment (users enter their own API key)**
1. Fork this repository  
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose `main` branch and `/ (root)`
5. Your site will be available at `https://yourusername.github.io/repo-name`

### Netlify

1. Fork this repository
2. Connect your GitHub account to Netlify
3. Select this repository
4. Deploy with default settings
5. Your site will be live with a custom Netlify URL

### Vercel

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import this repository
4. Deploy with default settings

### Local Development

**Without API key injection:**
Simply open `index.html` in your web browser - no build process required!

**With API key injection:**
1. Set environment variable: `export OPENROUTER_API_KEY=your_key_here`
2. Run build script: `./build.sh`
3. Open `build/index.html` in your browser

## 🔧 Setup

### Get an OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Generate an API key
4. Enter it in the game interface

**Note:** Your API key is stored locally in your browser and never sent anywhere except OpenRouter.

## 🛠️ Technical Details

- **Frontend Only:** Pure HTML, CSS, and JavaScript - no build process needed
- **API Integration:** Uses OpenRouter API for accessing multiple LLMs
- **Responsive Design:** Works on desktop and mobile
- **Local Storage:** API key and preferences saved locally

## 📁 Project Structure

```
llm-code-guesser/
├── index.html          # Main game interface
├── style.css           # Styling and responsive design  
├── script.js           # Game logic and API integration
└── README.md           # This file
```

## 🎯 Features

- **Random Code Generation:** Each round uses a different model and prompt
- **Visual Feedback:** Clear indication of correct/incorrect guesses
- **Score Tracking:** Keep track of your accuracy across rounds
- **Mobile Friendly:** Responsive design works on all devices
- **No Dependencies:** Pure vanilla JavaScript, no frameworks needed

## 🔒 Privacy & Security

- API keys are stored locally in your browser only
- No data is collected or transmitted except to OpenRouter
- All processing happens client-side

## 🤝 Contributing

Feel free to submit issues and pull requests! Some ideas for improvements:

- Add more programming languages
- Include more LLM models as they become available
- Add difficulty levels
- Implement leaderboards
- Add code syntax highlighting

## 📄 License

MIT License - feel free to use and modify as you like!