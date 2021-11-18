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
        question: 'Which of these is NOT classed as a symptom of having a mental health problem?',
        choice1: 'Self-harm',
        choice2: 'Broken bones',
        choice3: 'Low self esteem',
        choice4: 'Social withdrawal',
        answer: '2',
    },
    {
        // question 2
        question: 'Mental illnesses are',
        choice1: 'Not very common',
        choice2: 'a myth, and do not exist',
        choice3: 'Very common',
        choice4: 'Fairly common',
        answer: '3',
    },
    {
        // question 3
        question: 'If you know someone with poor mental health, you can help by:',
        choice1: 'Helping them access mental health services',
        choice2: 'Reaching out and letting them know help is available',
        choice3: 'Learning and sharing the facts about mental health, especially if you hear something that is not true',
        choice4: 'All of the above',
        answer: '4',
    },
    {
        // question 4
        question: 'Mental illness is caused by',
        choice1: 'A number of factors including biological factors, stressful or traumatic life events, and long-lasting health conditions such as heart disease or cancer',
        choice2: 'Lack of willpower',
        choice3: 'Personal weakness',
        choice4: 'None of the above',
        answer: '1',
    },
    {
        // question 5
        question: 'Mental health is:',
        choice1: 'Only important to some people',
        choice2: 'An important part of overall health and well-being',
        choice3: 'More than the absence of mental disorders',
        choice4: 'None of the above',
        answer: '2',
    },
    {
        // question 6
        question: "If you are having a conversation about someone's mental health, what should you NOT do?",
        choice1: 'Tell them you will talk to other people about it',
        choice2: 'Ask simple questions and encourage them to share',
        choice3: 'Choose an appropriate place that makes them feel relaxed',
        choice4: 'Reassure the person',
        answer: '1',
    },
    {
        // question 7
        question: 'What should someone do if they think they have a mental health condition?',
        choice1: 'Search their symptoms online',
        choice2: 'Take an online quiz to verify their symptoms',
        choice3: "Don't tell anyone",
        choice4: 'Seek help by talking to a doctor, parent, or an adult they trust',
        answer: '4',
    },
    {
        // question 8
        question: 'Why is mental health important?',
        choice1: "Good mental health can help you cope with life's stresses",
        choice2: 'Good mental health can help you have good relationships with others',
        choice3: 'Good mental health can help you realize your full potential',
        choice4: 'All of the above',
        answer: '4',
    },
    {
        // question 9
        question: 'What can you do to have good mental health?',
        choice1: 'Sleep as late as possible so that you can always enjoy life to the fullest',
        choice2: 'Connect with others and be sociable because friends are people you can rely on for support',
        choice3: 'Stay indoors becuase it is not healthy to go out when it is sunny',
        choice4: 'Let all your stress build up so that you will have motivation to do everything at once',
        answer: '2',
    },
    {
        // question 10
        question: 'At what age can you get mental illness?',
        choice1: 'When your 18 years old and above',
        choice2: 'When your 14 years old',
        choice3: 'Any age',
        choice4: 'Mental illness only occurs in adults aged 30 and above',
        answer: '3',
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

