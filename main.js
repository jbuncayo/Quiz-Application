document.addEventListener("DOMContentLoaded", function () {
    const quizForm = document.getElementById("quiz-form");
    const questionContainer = document.getElementById("question-container");
    const resultContainer = document.getElementById("result-container");
    const logsContainer = document.getElementById("logs-container");
    const submitButton = document.querySelector("button[type='submit']");
    const progressBar = document.getElementById("progress-bar");
    const reviewButton = document.getElementById("review-button");

    let currentQuestionIndex = 0;
    let logs = [];
    let timer;

    const timerDuration = 10; // Set the timer duration in seconds

    function startTimer() {
        let timeLeft = timerDuration;

        timer = setInterval(function () {
            logsContainer.innerHTML = `<h2>Feedback</h2><p class="correct">Time left: ${timeLeft} seconds</p>`;
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(timer);
                handleTimeOut();
            }
        }, 1000);
    }

    function updateProgressBar() {
        const progress = (currentQuestionIndex + 1) / questions.length * 100;
        progressBar.style.width = `${progress}%`;
    }

    function displayReview() {
        // Show the correct answers for incorrectly answered questions
        logsContainer.innerHTML += `<h2>Review Answers</h2>${logs
            .filter(log => !log.isCorrect)
            .map(log => {
                const questionIndex = parseInt(log.text.match(/Question (\d+)/)[1]) - 1; // Extract question index from log
                const correctAnswer = questions[questionIndex].correctAnswer;
                return `<p class="correct">${log.text} - Correct Answer: ${correctAnswer}</p>`;
            })
            .join('')}`;

        // Scroll to the review section
        logsContainer.scrollIntoView({ behavior: 'smooth' });

        // Hide the review button after displaying the review
        reviewButton.style.display = "none";

        // Show the submit/restart button again
        submitButton.style.display = "block";
    }

    function handleTimeOut() {
        logs.push({
            text: `<span class="question-number">Question ${currentQuestionIndex + 1}</span>: Time Out`,
            isCorrect: false
        });

        if (currentQuestionIndex === questions.length - 1) {
            // If it's the last question, display the final results
            displayResults();
        } else {
            // If it's not the last question, move to the next question and reset the timer
            currentQuestionIndex++;
            resetAndStartTimer(); // Reset and start the timer for the next question
            displayCurrentQuestion();
        }
    }

    function resetAndStartTimer() {
        clearInterval(timer); // Clear the previous timer
        startTimer(); // Start a new timer
    }

    quizForm.addEventListener("submit", function (event) {
        event.preventDefault();
        resetAndStartTimer(); // Reset and start the timer on each question
        const selectedAnswer = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);

        if (selectedAnswer) {
            questions[currentQuestionIndex].userAnswer = selectedAnswer.value;
            const isCorrect = questions[currentQuestionIndex].userAnswer === questions[currentQuestionIndex].correctAnswer;

            logs.push({
                text: `<span class="question-number">Question ${currentQuestionIndex + 1}</span>: ${questions[currentQuestionIndex].userAnswer}`,
                isCorrect: isCorrect
            });

            if (currentQuestionIndex === questions.length - 1) {
                displayResults();
            } else {
                currentQuestionIndex++;
                displayCurrentQuestion();
            }
        }
    });

    function displayResults() {
        clearInterval(timer); // Stop the timer

        let correctCount = 0;
        questions.forEach((question, index) => {
            if (question.userAnswer === question.correctAnswer) {
                correctCount++;
            }
        });

        const resultText = `You got ${correctCount} out of ${questions.length} questions correct!`;
        resultContainer.textContent = resultText;

        logsContainer.innerHTML = `<h2>Feedback</h2>${logs.map(log => `<p class="${log.isCorrect ? 'correct' : 'incorrect'}">${log.text}</p>`).join('')}`;

        // Show the review button after displaying results
        reviewButton.style.display = "block";
        reviewButton.addEventListener("click", displayReview);

        // Hide the submit/restart button
        submitButton.style.display = "none";

        // Change the button to "Restart Quiz"
        submitButton.textContent = "Restart Quiz";
        submitButton.addEventListener("click", restartQuiz);
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        logs = [];
        resultContainer.textContent = '';
        logsContainer.innerHTML = '';
        submitButton.removeEventListener("click", restartQuiz);
        displayCurrentQuestion();
        startTimer();
        updateProgressBar(); // Reset the progress bar

        // Hide the review button on restart
        reviewButton.style.display = "none";
    }

    function displayCurrentQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.innerHTML = `
            <p>${currentQuestionIndex + 1}. ${currentQuestion.question}</p>
            ${currentQuestion.choices.map(choice => `
                <label>
                    <input type="radio" name="q${currentQuestionIndex}" value="${choice}">
                    ${choice}
                </label>
            `).join('')}
        `;
        questionContainer.innerHTML = '';
        questionContainer.appendChild(questionDiv);

        if (currentQuestionIndex === questions.length - 1) {
            submitButton.textContent = "Submit";
        } else {
            submitButton.textContent = "Next";
        }

        // Update the progress bar
        updateProgressBar();
    }

    const questions = [
        {
            question: "What does HTML stand for?",
            choices: ["Hyper Text Markup Language", "Hyper Transfer Markup Language", "High Text Markup Language"],
            correctAnswer: "Hyper Text Markup Language"
        },
        {
            question: "Which programming language is known as the 'language of the web'?",
            choices: ["Java", "Python", "JavaScript"],
            correctAnswer: "JavaScript"
        },
        {
            question: "What does CSS stand for?",
            choices: ["Counter Style Sheet", "Computer Style Sheet", "Cascading Style Sheet"],
            correctAnswer: "Cascading Style Sheet"
        },
        {
            question: "What is the purpose of the 'let' keyword in JavaScript?",
            choices: ["To declare a constant variable", "To declare a block-scoped variable", "To declare a global variable"],
            correctAnswer: "To declare a block-scoped variable"
        },
        {
            question: "Which of the following is not a JavaScript framework?",
            choices: ["React", "Angular", "Django"],
            correctAnswer: "Django"
        }
    ];

    displayCurrentQuestion();
    startTimer();
});
