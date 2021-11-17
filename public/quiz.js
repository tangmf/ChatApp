// code was taken from https://youtu.be/f4fB9Xg2JEY

const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');
const healthBarFull = document.querySelector('#healthBarFull');
const healthText = document.querySelector('#health');

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
        // question 1
        question: 'What is Covid-19?',
        choice1: 'Bacteria',
        choice2: 'Virus',
        choice3: 'Cell',
        choice4: 'Device',
        answer: '2',
    },
    {
        // question 2
        question: 'In what year did we find out about Covid-19?',
        choice1: '2009',
        choice2: '2016',
        choice3: '2021',
        choice4: '2019',
        answer: '4',
    },
    {
        // question 3
        question: 'How does Covid-19 spread?',
        choice1: 'Through direct contant with a bear',
        choice2: 'Through droplets of saliva from an infected person',
        choice3: 'By washing your hands regularly',
        choice4: 'By staying at home',
        answer: '2',
    },
    {
        // question 4
        question: 'What should you do if you feel unwell?',
        choice1: 'See a doctor immediately',
        choice2: 'Go out with your friends',
        choice3: 'Not wear a mask when going out',
        choice4: 'Do some exercise',
        answer: '1',
    },
    {
        // question 5
        question: 'Where did COVID-19 start?',
        choice1: 'Singapore',
        choice2: 'Wuhan',
        choice3: 'Russia',
        choice4: 'USA',
        answer: '2',
    },
    {
        // question 6
        question: 'What is an example of good hygiene?',
        choice1: 'Touching the lift button and then touching your face',
        choice2: 'Not washing your hands after using the restroom',
        choice3: 'Washing hands frequently with soap and water for at least 20 seconds',
        choice4: 'Using sanitizer with less than 60% alcohol',
        answer: '3',
    },
    {
        // question 7
        question: 'What is one servere symptom of COVID-19?',
        choice1: 'High temperature of more than 38°C',
        choice2: 'Dry cough',
        choice3: 'Headache',
        choice4: 'Sore throat',
        answer: '1',
    },
    {
        // question 8
        question: 'Can COVID-19 be spread by touching an infected person?',
        choice1: 'Yes',
        choice2: 'No, but it is recommended to avoid infected patients.',
        choice3: 'Maybe',
        choice4: 'Unsure',
        answer: '2',
    },
    {
        // question 9
        question: 'What does the word "corona" in Coronavirus refers to?',
        choice1: 'A shirt',
        choice2: 'A cap',
        choice3: 'Sunglasses',
        choice4: 'A crown',
        answer: '4',
    },
    {
        // question 10
        question: 'Are you immune to COVID-19 if you have had it before?',
        choice1: 'Yes',
        choice2: 'No',
        choice3: 'Maybe',
        choice4: 'Unsure',
        answer: '2',
    },
    
];

const SCORE_POINTS = 100; //points for question correct
// const HEALTH_POINTS = 2; //Damage done to covid enemy for question correct
const MAX_QUESTIONS = 10;
// var health = 20; //covid enemy total health
var startGame;
var getNewQuestion;
// var decrementHealth;
var incrementScore;

startGame = () => {
    questionCounter = 0;
    score = 0;
    // set all questions to be available
    availableQuestions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {
    // no more questions (end game)
    if(availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);

        return window.location.assign('end.html');
    }

    questionCounter++;
    // update progress bar
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`;
    
    // Get random question from available questions
    const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionsIndex];
    question.innerText = currentQuestion.question;
    // set choices
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionsIndex, 1); // replaces 1 element at questionsIndex with nothing (remove question)
    // accept answers
    acceptingAnswers = true;
};

// eventListener for each choice
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        // not accepting answers
        if(!acceptingAnswers) return;

        acceptingAnswers = false; // after click, do not allow user to change answer
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if(classToApply === 'correct') {
            // // correct answer to question (enemy take damage, score increases)
            // decrementHealth(HEALTH_POINTS);
            // healthBarFull.style.width = `${(health/20) * 100}%`; // update hp bar for enemy
            incrementScore(SCORE_POINTS);
        }
        
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();

        }, 1000);


    });
});
// decrementHealth = num => {
    
//     health -= num;
//     healthText.innerText = `COVID HP: ${health}/20`;

// };
incrementScore = num => {
    score +=num;
    scoreText.innerText = score;
};


startGame();

