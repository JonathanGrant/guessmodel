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
            "Write a function to implement binary search on a sorted array",
            "Create a class to represent a binary tree with insert and search methods",
            "Write a decorator/wrapper that measures function execution time",
            "Implement a simple LRU cache with get and put operations",
            "Create a function that finds the longest common subsequence between two strings",
            "Write a function to debounce function calls",
            "Create a function that retries failed operations with exponential backoff",
            "Implement a simple state management system",
            "Write a function that flattens a nested array recursively",
            "Create a function to validate email addresses using regex",
            "Implement a generic stack data structure with push, pop, and peek",
            "Write a method to check if a string is a valid palindrome",
            "Create a thread-safe singleton pattern implementation",
            "Write a function to merge two sorted arrays",
            "Implement a simple observer pattern for event handling",
            "Write a function to find the maximum subarray sum (Kadane's algorithm)",
            "Create a smart pointer or reference counting system",
            "Implement a hash table with collision handling",
            "Write a function to reverse a linked list iteratively",
            "Create a function to generate Fibonacci numbers efficiently",
            "Implement a trie data structure for prefix matching",
            "Write a function to find the shortest path in a graph (Dijkstra's)",
            "Create a function that implements quicksort algorithm",
            "Write a function to detect cycles in a linked list",
            "Implement a bloom filter for membership testing",
            "Create a function to parse and evaluate mathematical expressions",
            "Write a function that implements a sliding window maximum",
            "Implement a rate limiter using token bucket algorithm",
            "Create a function to find all anagrams in a list of words",
            "Write a function that implements binary tree traversal (inorder, preorder, postorder)",
            "Implement a connection pool for database connections",
            "Create a function to solve the knapsack problem using dynamic programming",
            "Write a function that compresses strings using run-length encoding",
            "Implement a simple web crawler with URL queue management",
            "Create a function to find the kth largest element in an array",
            "Write a function that implements merge sort algorithm",
            "Implement a circular buffer with fixed size",
            "Create a function to validate and parse JSON strings",
            "Write a function that finds the longest increasing subsequence",
            "Implement a simple template engine for string interpolation"
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
                max_tokens: 1000,
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