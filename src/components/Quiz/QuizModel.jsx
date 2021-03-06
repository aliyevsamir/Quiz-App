import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Row, message } from 'antd';
import QuizTemplate from './QuizTemplates/QuizTemplate';
import Loading from '../../utils/Loading';
import { withRouter } from 'react-router-dom';
import { createQuiz } from '../../redux/actions/quizzes';
import { useEffect } from 'react';
import isEmpty from '../../utils/isEmpty';
import axios from 'axios';
import { loadUser } from '../../redux/actions/auth';
import './QuizTemplates/QuizTemplates.scss';

const QuizModel = ({
    mode = 'make',
    quizzes = [],
    createQuiz,
    loadUser,
    history,
    name,
    quizId = null
}) => {
    const [optionValue, setOptionValue] = useState(null);
    const [quizSubmissions, setQuizSubmissions] = useState({});
    const [finalQuizSubmission, setFinalQuizSubmission] = useState({});
    const [quizSubmissionLoading, setQuizSubmissionLoading] = useState(false);

    const [state, setState] = useState({
        currentQuestionID: 0,
        selectedAnswers: 0
    });

    useEffect(() => {
        if (!isEmpty(finalQuizSubmission)) {
            setQuizSubmissionLoading(true);
            if (mode === 'make') {
                createQuiz(finalQuizSubmission).then(() => {
                    loadUser().then(() => {
                        history.push('/profile');
                        setQuizSubmissionLoading(false);
                    });
                });
            } else {
                axios
                    .post(
                        `/api/v1/quizzes/${quizId}/submissions`,
                        finalQuizSubmission
                    )
                    .then(res => {
                        const { quiz_submission_id } = res.data.data;
                        history.push({
                            pathname: `/quizzes/${quizId}/submissions/${quiz_submission_id}`
                        });
                        setQuizSubmissionLoading(false);
                    })
                    .catch(err => console.error(err));
            }
        }
    }, [finalQuizSubmission]);

    const handleOptionChange = e => {
        if (quizSubmissionLoading) return;
        setOptionValue(e.target.value);
    };

    const newQuizSubmissions = (type = 'not final') => {
        if (type === 'final') {
            const newQuizSubmissions = { ...quizSubmissions };

            newQuizSubmissions[
                quizzes[state.currentQuestionID].question_id
            ] = optionValue;

            setFinalQuizSubmission({
                quizChoices: {
                    ...newQuizSubmissions
                }
            });
        } else {
            const newQuizSubmissions = { ...quizSubmissions };

            newQuizSubmissions[
                quizzes[state.currentQuestionID].question_id
            ] = optionValue;

            setQuizSubmissions(newQuizSubmissions);
            setOptionValue(null);
        }
    };

    const handleFinishQuiz = () => {
        if (quizSubmissionLoading) return;

        if (mode === 'make') {
            if (optionValue) {
                newQuizSubmissions('final');
            } else {
                setFinalQuizSubmission({
                    quizChoices: {
                        ...quizSubmissions
                    }
                });
            }
        } else if (mode === 'take') {
            if (optionValue) {
                newQuizSubmissions('final');
            } else {
                message.destroy();
                message.error('Cavablandırdıqdan sonra testi tamamlayın 😊');
            }
        }
    };

    const nextQuestion = () => {
        if (quizSubmissionLoading) return;

        if (optionValue) {
            window.scrollTo(0, 0);
            const { currentQuestionID } = state;
            newQuizSubmissions();

            const newQuestions = [...quizzes];
            newQuestions[currentQuestionID].selected = true;

            if (currentQuestionID < quizzes.length - 1) {
                // not last question
                let newQuiz = newQuestions
                    .slice(currentQuestionID + 1)
                    .find(quiz => quiz.selected !== true);

                if (!newQuiz) {
                    newQuiz = newQuestions
                        .slice(0, currentQuestionID + 1)
                        .find(quiz => quiz.selected !== true);
                }

                if (newQuiz) {
                    let newQuizIndex = newQuestions.findIndex(
                        question => question.question_id === newQuiz.question_id
                    );

                    setState({
                        currentQuestionID: newQuizIndex,
                        selectedAnswers: state.selectedAnswers + 1
                    });

                    quizzes = newQuestions;
                } else {
                    message.destroy();
                    message.warning(
                        'Bütün sualları cavablandırmısınız, testi tamamlayın 😊'
                    );
                }
            } else {
                // last question
                const newQuiz = newQuestions.find(
                    quiz => quiz.selected !== true
                );

                if (newQuiz) {
                    let newQuizIndex = newQuestions.findIndex(
                        question => question.question_id === newQuiz.question_id
                    );

                    setState({
                        currentQuestionID: newQuizIndex,
                        selectedAnswers: state.selectedAnswers + 1
                    });

                    quizzes = newQuestions;
                } else {
                    message.destroy();
                    message.warning(
                        'Bütün sualları cavablandırmısınız, testi tamamlayın 😊'
                    );
                }
            }
        } else {
            message.destroy();

            message.error(
                "Sualı boş cavablandıra bilməzsiniz, sualı keçmək üçün keç'ə tıklayın 😊"
            );
        }
    };

    const skipQuestion = () => {
        if (quizSubmissionLoading) return;

        window.scrollTo(0, 0);
        const { currentQuestionID } = state;

        if (currentQuestionID < quizzes.length - 1) {
            // not last question

            let newQuiz = quizzes
                .slice(currentQuestionID + 1)
                .find(quiz => quiz.selected !== true);

            if (!newQuiz) {
                newQuiz = quizzes
                    .slice(0, currentQuestionID + 1)
                    .find(quiz => quiz.selected !== true);
            }

            let newQuizIndex = quizzes.findIndex(
                question => question.question_id === newQuiz.question_id
            );

            setState({
                ...state,
                currentQuestionID: newQuizIndex
            });
        } else {
            // last question
            const newQuiz = quizzes.find(quiz => quiz.selected !== true);

            let newQuizIndex = quizzes.findIndex(
                question => question.question_id === newQuiz.question_id
            );

            setState({
                ...state,
                currentQuestionID: newQuizIndex
            });
        }
    };

    const { currentQuestionID, selectedAnswers } = state;

    return !quizzes.length ? (
        <Loading />
    ) : (
        <Row
            type='flex'
            align='middle'
            justify='center'
            className='quiz-container'
        >
            <QuizTemplate
                quiz={quizzes[currentQuestionID]}
                currentQuestionID={currentQuestionID}
                skipQuestion={skipQuestion}
                nextQuestion={nextQuestion}
                selectedAnswers={selectedAnswers}
                quizLength={quizzes.length}
                handleOptionChange={handleOptionChange}
                optionValue={optionValue}
                handleFinishQuiz={handleFinishQuiz}
                mode={mode}
                name={name}
                quizSubmissionLoading={quizSubmissionLoading}
            />
        </Row>
    );
};

export default connect(null, { createQuiz, loadUser })(withRouter(QuizModel));
