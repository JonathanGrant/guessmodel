class LLMCodeGuesser {
    constructor() {
        this.apiKey = localStorage.getItem('openrouter_api_key') || '';
        this.score = 0;
        this.round = 1;
        this.currentModel = '';
        this.currentPrompt = '';
        this.gameActive = false;
        
        this.models = [
            'openai/gpt-4o',
            'openai/o3',
            'openai/o4-mini',
            'openai/gpt-5-chat',
            'openai/gpt-5',
            'openai/gpt-oss-120b',
            'openai/gpt-4.1',
            'google/gemini-2.5-flash-exp',
            'google/gemini-2.5-flash-lite',
            'google/gemini-2.5-pro',
            'anthropic/claude-3-opus-4-1-20250805',
            'x-ai/grok-4'
        ];

        this.modelDisplayNames = {
            'openai/gpt-4o': 'GPT-4o',
            'openai/o3': 'o3',
            'openai/o4-mini': 'o4-mini',
            'openai/gpt-5-chat': 'GPT-5 Chat',
            'openai/gpt-5': 'GPT-5',
            'openai/gpt-oss-120b': 'GPT OSS 120B',
            'openai/gpt-4.1': 'GPT-4.1',
            'google/gemini-2.5-flash-exp': 'Gemini 2.5 Flash',
            'google/gemini-2.5-flash-lite': 'Gemini 2.5 Flash Lite',
            'google/gemini-2.5-pro': 'Gemini 2.5 Pro',
            'anthropic/claude-3-opus-4-1-20250805': 'Claude 4.1 Opus',
            'x-ai/grok-4': 'Grok-4'
        };

        this.codePrompts = [
            // Data Processing & File I/O
            "Read a CSV file, calculate column statistics, and save as Parquet format",
            "Convert images from JPEG to PNG format with optional resizing",
            "Parse a large JSON file and extract specific nested fields into a flat structure",
            "Read Excel spreadsheets, merge multiple sheets, and export to CSV",
            "Process log files to extract error patterns and generate summary reports",
            "Convert XML data to JSON format while preserving nested structures",
            "Read configuration files (YAML/TOML) and validate required parameters",
            "Batch process images: resize, compress, and add watermarks",
            "Parse HTML pages to extract structured data (web scraping)",
            "Read PDF documents and extract text content with formatting",
            
            // API & Web Development
            "Create a REST API endpoint that handles user authentication with JWT",
            "Build a GraphQL resolver that fetches data from multiple sources",
            "Implement rate limiting middleware for API endpoints",
            "Create a webhook handler that validates signatures and processes payloads",
            "Build a simple HTTP client with retry logic and timeout handling",
            "Implement OAuth2 authentication flow with token refresh",
            "Create a WebSocket server for real-time chat functionality",
            "Build a proxy server that routes requests based on headers",
            "Implement API response caching with TTL expiration",
            "Create a health check endpoint that monitors service dependencies",
            
            // Database Operations
            "Connect to a database, run queries, and handle connection pooling",
            "Implement database migrations with rollback functionality",
            "Create a simple ORM that maps objects to database tables",
            "Build a query builder for dynamic SQL generation",
            "Implement database seeding with sample data",
            "Create stored procedures for complex business logic",
            "Build a database backup and restore utility",
            "Implement full-text search with ranking and filtering",
            "Create a data synchronization system between two databases",
            "Build a database performance monitoring tool",
            
            // System & DevOps
            "Monitor system resources (CPU, memory, disk) and send alerts",
            "Create a log aggregation system that collects from multiple sources",
            "Build a deployment script that handles rollbacks and health checks",
            "Implement a service discovery mechanism for microservices",
            "Create a load balancer that distributes traffic across servers",
            "Build a container orchestration tool for managing Docker containers",
            "Implement automated testing pipelines with parallel execution",
            "Create environment configuration management with secrets handling",
            "Build a monitoring dashboard that displays real-time metrics",
            "Implement automated backup systems with encryption and compression",
            
            // Machine Learning & Analytics
            "Load data, perform feature engineering, and train a simple ML model",
            "Implement A/B testing framework with statistical significance testing",
            "Create a recommendation system based on user behavior patterns",
            "Build a time series analysis tool with forecasting capabilities",
            "Implement clustering algorithms for customer segmentation",
            "Create a data pipeline for real-time stream processing",
            "Build anomaly detection system for monitoring unusual patterns",
            "Implement natural language processing for sentiment analysis",
            "Create a feature store for ML model serving",
            "Build a model evaluation framework with cross-validation"
        ];

        this.initializeEventListeners();
        this.updateDisplay();
        this.checkApiKey();
    }

    initializeEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generateNewCode());
        document.getElementById('saveApiKey').addEventListener('click', () => this.saveApiKey());
        document.getElementById('nextRoundBtn').addEventListener('click', () => this.nextRound());
        
        document.querySelectorAll('.model-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.makeGuess(e.target.dataset.model));
        });

        document.getElementById('language').addEventListener('change', () => {
            if (this.apiKey) {
                this.generateNewCode();
            }
        });
    }

    checkApiKey() {
        if (this.apiKey) {
            document.getElementById('apiKey').value = '••••••••••••••••';
            this.generateNewCode();
        } else {
            document.getElementById('codeDisplay').textContent = 'Please enter your OpenRouter API key to start playing!';
        }
    }

    saveApiKey() {
        const input = document.getElementById('apiKey');
        const key = input.value.trim();
        
        if (!key || key === '••••••••••••••••') return;
        
        this.apiKey = key;
        localStorage.setItem('openrouter_api_key', key);
        input.value = '••••••••••••••••';
        
        this.generateNewCode();
    }

    async generateNewCode() {
        if (!this.apiKey) {
            alert('Please enter your OpenRouter API key first!');
            return;
        }

        this.gameActive = false;
        this.resetUI();
        
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        
        document.getElementById('codeDisplay').textContent = 'Generating code...';

        try {
            const language = document.getElementById('language').value;
            const randomModel = this.getRandomModel();
            this.currentModel = randomModel;

            // Show the prompt while generating
            const prompt = this.getRandomPrompt();
            this.currentPrompt = prompt;
            document.getElementById('codeDisplay').textContent = `Generating code for: "${prompt}"`;

            const code = await this.generateCodeWithModel(language, randomModel, prompt);
            
            document.getElementById('codeDisplay').textContent = code;
            document.getElementById('codeDisplay').className = `language-${language}`;
            
            // Show the prompt after code is generated
            document.getElementById('promptDisplay').textContent = prompt;
            document.getElementById('promptSection').style.display = 'block';
            
            this.setupRandomModelButtons();
            this.gameActive = true;
            
        } catch (error) {
            console.error('Error generating code:', error);
            document.getElementById('codeDisplay').textContent = 'Error generating code. Please check your API key and try again.';
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate New Code';
        }
    }

    getRandomModel() {
        return this.models[Math.floor(Math.random() * this.models.length)];
    }

    getRandomPrompt() {
        return this.codePrompts[Math.floor(Math.random() * this.codePrompts.length)];
    }

    async generateCodeWithModel(language, model, prompt) {
        const fullPrompt = `${prompt}. Write clean, well-commented ${language} code. Include only the code implementation, no explanations.`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'LLM Code Guesser',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: fullPrompt
                    }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    makeGuess(guessedModel) {
        if (!this.gameActive) return;

        this.gameActive = false;
        this.disableModelButtons();

        const isCorrect = guessedModel === this.currentModel;
        
        document.querySelectorAll('.model-btn').forEach(btn => {
            if (btn.dataset.model === this.currentModel) {
                btn.classList.add('correct');
            } else if (btn.dataset.model === guessedModel && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        const resultSection = document.getElementById('resultSection');
        const resultMessage = document.getElementById('resultMessage');
        
        if (isCorrect) {
            this.score++;
            resultSection.className = 'result-section correct';
            resultMessage.textContent = `🎉 Correct! It was ${this.modelDisplayNames[this.currentModel]}`;
        } else {
            resultSection.className = 'result-section incorrect';
            resultMessage.textContent = `❌ Wrong! It was ${this.modelDisplayNames[this.currentModel]}, not ${this.modelDisplayNames[guessedModel]}`;
        }

        resultSection.style.display = 'block';
        this.updateDisplay();
    }

    nextRound() {
        this.round++;
        document.getElementById('resultSection').style.display = 'none';
        this.generateNewCode();
    }

    resetUI() {
        document.getElementById('resultSection').style.display = 'none';
        document.getElementById('promptSection').style.display = 'none';
        document.querySelectorAll('.model-btn').forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
        });
    }

    enableModelButtons() {
        document.querySelectorAll('.model-btn').forEach(btn => {
            btn.disabled = false;
        });
    }

    disableModelButtons() {
        document.querySelectorAll('.model-btn').forEach(btn => {
            btn.disabled = true;
        });
    }

    setupRandomModelButtons() {
        // Get 4 random models, ensuring the correct model is always included
        let randomModels = [this.currentModel];
        
        // Get 3 other random models
        const otherModels = this.models.filter(model => model !== this.currentModel);
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * otherModels.length);
            randomModels.push(otherModels.splice(randomIndex, 1)[0]);
        }
        
        // Shuffle the array so correct answer isn't always first
        randomModels = this.shuffleArray(randomModels);
        
        // Update the model buttons container
        const container = document.querySelector('.model-buttons');
        container.innerHTML = '';
        
        randomModels.forEach(model => {
            const button = document.createElement('button');
            button.className = 'model-btn';
            button.dataset.model = model;
            button.textContent = this.modelDisplayNames[model];
            button.addEventListener('click', (e) => this.makeGuess(e.target.dataset.model));
            container.appendChild(button);
        });
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('round').textContent = this.round;
        
        // Calculate accuracy (avoid division by zero)
        const accuracy = this.round > 1 ? Math.round((this.score / (this.round - 1)) * 100) : 0;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LLMCodeGuesser();
});