// Quiz Questions
const quizQuestions = {
    general: [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            answer: 2
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: 1
        },
        {
            question: "What is the largest mammal in the world?",
            options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
            answer: 1
        },
        {
            question: "Which element has the chemical symbol 'O'?",
            options: ["Gold", "Oxygen", "Silver", "Osmium"],
            answer: 1
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            answer: 2
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
            answer: 3
        },
        {
            question: "Which country is home to the kangaroo?",
            options: ["New Zealand", "South Africa", "Australia", "Brazil"],
            answer: 2
        },
        {
            question: "What is the main component of the Sun?",
            options: ["Liquid Lava", "Hydrogen", "Oxygen", "Carbon"],
            answer: 1
        },
        {
            question: "Which year did World War II end?",
            options: ["1943", "1945", "1947", "1950"],
            answer: 1
        },
        {
            question: "What is the currency of Japan?",
            options: ["Won", "Yen", "Dollar", "Euro"],
            answer: 1
        }
    ],
    science: [
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            answer: 2
        },
        {
            question: "What is the hardest natural substance on Earth?",
            options: ["Gold", "Iron", "Diamond", "Quartz"],
            answer: 2
        },
        {
            question: "Which gas is most abundant in the Earth's atmosphere?",
            options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
            answer: 2
        },
        {
            question: "What is the speed of light?",
            options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"],
            answer: 0
        },
        {
            question: "What is the pH value of pure water?",
            options: ["5", "7", "9", "12"],
            answer: 1
        }
    ],
    history: [
        {
            question: "Who was the first president of the United States?",
            options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
            answer: 2
        },
        {
            question: "In which year did the Titanic sink?",
            options: ["1905", "1912", "1918", "1923"],
            answer: 1
        },
        {
            question: "Which ancient civilization built the pyramids?",
            options: ["Greeks", "Romans", "Egyptians", "Mayans"],
            answer: 2
        },
        {
            question: "Who invented the telephone?",
            options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Albert Einstein"],
            answer: 1
        },
        {
            question: "Which war was fought between the North and South regions of the United States?",
            options: ["World War I", "Civil War", "Revolutionary War", "War of 1812"],
            answer: 1
        }
    ]
};

// Quiz Categories
const quizCategories = [
    { id: 'general', name: 'General Knowledge' },
    { id: 'science', name: 'Science' },
    { id: 'history', name: 'History' }
];

// DOM Elements
const quizStart = document.getElementById('quiz-start');
const quizContainer = document.getElementById('quiz-container');
const quizEnd = document.getElementById('quiz-end');
const categoriesContainer = document.getElementById('categories');
const startBtn = document.getElementById('start-btn');
const currentCategory = document.getElementById('current-category');
const scoreElement = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');
const questionCount = document.getElementById('question-count');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const resultContainer = document.getElementById('result');
const restartBtn = document.getElementById('restart-btn');

// Quiz State
let currentQuizCategory = 'general';
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

// Initialize Quiz
function initQuiz() {
    // Display categories
    categoriesContainer.innerHTML = quizCategories.map(category => `
        <button class="category-btn ${category.id === currentQuizCategory ? 'selected' : ''}" 
                data-category="${category.id}">
            ${category.name}
        </button>
    `).join('');
    
    // Add event listeners to category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentQuizCategory = btn.dataset.category;
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
    
    // Set initial questions
    questions = [...quizQuestions[currentQuizCategory]];
    
    // Event listeners
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
}

// Start Quiz
function startQuiz() {
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    
    // Get questions for selected category
    questions = [...quizQuestions[currentQuizCategory]];
    
    // Shuffle questions
    questions = shuffleArray(questions);
    
    // Update UI
    quizStart.style.display = 'none';
    quizContainer.style.display = 'block';
    quizEnd.style.display = 'none';
    
    currentCategory.textContent = `Category: ${quizCategories.find(c => c.id === currentQuizCategory).name}`;
    scoreElement.textContent = `Score: ${score}`;
    
    showQuestion();
}

// Show Question
function showQuestion() {
    // Reset state
    resetState();
    
    const currentQuestion = questions[currentQuestionIndex];
    const questionNumber = currentQuestionIndex + 1;
    
    // Update progress
    progressBar.style.width = `${(questionNumber / questions.length) * 100}%`;
    questionCount.textContent = `Question ${questionNumber} of ${questions.length}`;
    
    // Display question
    questionElement.textContent = currentQuestion.question;
    
    // Display options
    currentQuestion.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option;
        optionBtn.dataset.index = index;
        optionBtn.addEventListener('click', selectOption);
        optionsContainer.appendChild(optionBtn);
    });
    
    // Disable next button initially
    nextBtn.disabled = true;
}

// Reset State
function resetState() {
    nextBtn.disabled = true;
    optionsContainer.innerHTML = '';
}

// Select Option
function selectOption(e) {
    const selectedBtn = e.target;
    const correctIndex = questions[currentQuestionIndex].answer;
    const selectedIndex = parseInt(selectedBtn.dataset.index);
    
    // Mark selected option
    selectedOption = selectedIndex;
    
    // Disable all options
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    // Check if correct
    if (selectedIndex === correctIndex) {
        selectedBtn.classList.add('correct');
        score++;
        scoreElement.textContent = `Score: ${score}`;
    } else {
        selectedBtn.classList.add('wrong');
        // Show correct answer
        document.querySelector(`.option-btn[data-index="${correctIndex}"]`).classList.add('correct');
    }
    
    // Enable next button
    nextBtn.disabled = false;
}

// Next Question
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

// End Quiz
function endQuiz() {
    quizContainer.style.display = 'none';
    quizEnd.style.display = 'block';
    
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    
    if (percentage >= 80) {
        message = 'Excellent! You really know your stuff!';
    } else if (percentage >= 60) {
        message = 'Good job! You have a solid understanding.';
    } else if (percentage >= 40) {
        message = 'Not bad! Keep learning and improving.';
    } else {
        message = 'Keep practicing! You can do better next time.';
    }
    
    resultContainer.innerHTML = `
        <h2>${message}</h2>
        <p>You answered ${score} out of ${questions.length} questions correctly.</p>
        <span class="score">${percentage}%</span>
    `;
}

// Restart Quiz
function restartQuiz() {
    quizEnd.style.display = 'none';
    quizStart.style.display = 'block';
}

// Shuffle Array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Initialize the quiz
initQuiz();