import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import data from './data.json';

function App() {
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [revealed, setRevealed] = useState(false);

    const [correct, setCorrect] = useState(null)

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
                    <Checker selectedAnswers={selectedAnswers} onClick={() => {
                        const correctAnswers = data.data.getStep.stepQuiz.answerOptions.filter(answer => answer.isCorrect === 'true');
                        setRevealed(true);

                        console.log(selectedAnswers, correctAnswers);
                        if (JSON.stringify(selectedAnswers.sort((a, b) => a.answerText.localeCompare(b.answerText))) === JSON.stringify(correctAnswers.sort((a, b) => a.answerText.localeCompare(b.answerText)))) {
                            console.log('well done');
                            setCorrect(true);
                            // TODO: add toasts here?
                        } else {
                            console.log('try again');
                            setCorrect(false);
                        }

                    }} />
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

function Checker(props) {
    return (
        <button onClick={props.onClick}>Check</button>
    )
}

function CheckBox(props) {
    const [checked, setChecked] = useState(false);

    return (
        <input type="checkbox" onChange={e => {
            if (props.revealed) return;
            if (e.target.checked) {
                setChecked(true)
                props.setSelectedAnswers([...props.selectedAnswers, props.option]);
            } else {
                setChecked(false);
                if (props.selectedAnswers.includes(props.option)) {
                    props.setSelectedAnswers(props.selectedAnswers.filter(x => x !== props.option));
                }
            }
        }} checked={checked} />
    )
}

function Toast(props) {
    return (
        <div className={`toast ${props.correct !== null ? 'active' : ''} ${props.correct ? 'correct' : 'incorrect'}`}>
            {props.correct !== null ? (props.correct ? 'Correct! ✅' : 'Not quite 😔') : ''}
        </div>
    )
}

export default App;
