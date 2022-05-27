import './App.css';
import { useState } from 'react';

import data from './data.json';

function App() {
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    // revealed and correct could be merged in to one state, null if not revealed and true/false for correctness. I've left them separate for clarity.
    const [revealed, setRevealed] = useState(false);
    const [correct, setCorrect] = useState(null);

    const checkAnswer = () => {
        const correctAnswers = data.data.getStep.stepQuiz.answerOptions.filter(answer => answer.isCorrect === 'true');
        setRevealed(true);

        // in order to compare selectedAnswers to correctAnswers (both arrays of objects), we sort them both alphabetically and compare the result stringified!
        if (JSON.stringify(selectedAnswers.sort((a, b) => a.answerText.localeCompare(b.answerText))) === JSON.stringify(correctAnswers.sort((a, b) => a.answerText.localeCompare(b.answerText)))) {
            setCorrect(true);
        } else {
            setCorrect(false);
        }
    }

    // I prefer to keep main components as semantic as possible, made up mostly of descriptive components so the app structure is clear.
    return (
        <div className="app">
            <Quiz>

                <QuizHeader>
                    <QuestionNumber number={parseInt(data.data.getStep.id.split('-')[2])} />
                    <Question>{data.data.getStep.stepQuiz.questionText}</Question>
                </QuizHeader>

                <QuizMain>
                    <Options>
                        
                        {data.data.getStep.stepQuiz.answerOptions.map((option, i) => {

                            return <div className={`option ${selectedAnswers.includes(option) ? 'selected' : ''} ${revealed ? (option.isCorrect === 'true' ? 'correct' : 'incorrect') : ''}`} key={i}>
                                <CheckBox revealed={revealed} option={option} selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} />
                                {option.answerText}
                            </div>

                        })}

                    </Options>
                    <CheckerButton selectedAnswers={selectedAnswers} onClick={checkAnswer} />
                </QuizMain>

            </Quiz>

            <Toast correct={correct} />
        </div>
    );
}

function Quiz(props) {
    return (
        <div className="quizTile">
            {props.children}
        </div>
    )
}
function QuizHeader(props) {
    return (
        <div className="quizHeader">
            {props.children}
        </div>
    )
}

function QuestionNumber(props) {
    return (
        <div className="questionNumber">Q{props.number}</div>
    )
}

function Question(props) {
    return (
        <h2 className="question">{props.children}</h2>
    )
}

function QuizMain(props) {
    return (
        <div className="quizMain">
            {props.children}
        </div>
    )
}

function Options(props) {
    return (
        <div className="options">
            {props.children}
        </div>
    )
}

function CheckerButton(props) {
    return (
        <button onClick={props.onClick}>Check</button>
    )
}

function CheckBox(props) {
    // controlled component.
    const [checked, setChecked] = useState(false);

    const handleCheckboxChange = (e) => {
        if (props.revealed) return;
        if (!checked) {
            setChecked(true);
            props.setSelectedAnswers([...props.selectedAnswers, props.option]);
        } else {
            setChecked(false);
            // if (props.selectedAnswers.includes(props.option)) {
            props.setSelectedAnswers(props.selectedAnswers.filter(x => x !== props.option));
            // }
        }
    }

    return (
        <input type="checkbox" onChange={handleCheckboxChange} checked={checked} />
    )
}

function Toast(props) {
    return (
        <div className={`toast ${props.correct !== null ? 'active' : ''} ${props.correct ? 'correct' : 'incorrect'}`}>
            {props.correct !== null ?
                (props.correct ? 'Correct! ✅' : 'Not quite 😔')
            : ''}
        </div>
    )
}

export default App;
