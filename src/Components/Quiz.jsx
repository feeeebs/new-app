import React, { useEffect, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useCollection } from '@squidcloud/react';
import { useDispatch, useSelector } from 'react-redux';
import { setFinalQuiz, setQuestions, setFirstQuestion, updateUserAnswers } from '../Utilities/Redux/quizSlice';
import { v4 as uuidv4 } from 'uuid';
import { updateAlbumQuizTaken } from '../Utilities/Redux/userSlice';


export default function Quiz(props) {

    // State to manage user answers and quiz questions
    const userId = useSelector(state => state.user.userInfo.id);

    const [loading, setLoading] = useState(true);
    const [disableButton, setDisableButton] = useState(true);
    const [totalScore, setTotalScore] = useState([]);
    const [allAlbums, setAllAlbums] = useState([]); // Array of all albums in the DB
    
    const questionCollection = useCollection('quiz_questions', 'postgres_id'); // DB reference to quiz questions
    const answerCollection = useCollection('quiz_answers', 'postgres_id'); // DB reference to quiz answers
    const userQuizCollection = useCollection('user_quizzes', 'postgres_id'); // DB reference to user quizzes
    const quizScoringCollection = useCollection('quiz_scoring', 'postgres_id'); // DB reference to quiz scores
    const albumsCollection = useCollection('albums', 'postgres_id'); // DB reference to albums
    const usersCollection = useCollection('users', 'postgres_id'); // DB reference to users

    const createQuiz = []; // Just used to store quiz as it's being collected from the DB

    const dispatch = useDispatch();
    const currentQuestion = useSelector(state => state.quizQuestions.question);
    const questionIndex = useSelector(state => state.quizQuestions.currentIndex);
    const userAnswers = useSelector(state => state.quiz.userAnswers);

    useEffect(() => {
        console.log('total score: ', totalScore);
        //console.log('album journey: ', albumJourney);
        console.log('all albums: ', allAlbums);
    }, [totalScore, allAlbums]);

    // get list of albums from DB
    useEffect(() => {
        const getAlbums = async () => {
            const albumList = [];
            try {
                const albumSnapshot = await albumsCollection.query().dereference().snapshot();
                albumSnapshot.forEach(albumRow => {
                    const { album_id, album_title, album_art_key, album_description } = albumRow;
                    albumList.push({ album_id, album_title, album_art_key, album_description });
                })
                setAllAlbums(albumList);
            } catch (error) {
                console.error('Error fetching albums:', error);
            }
        }
        getAlbums();
    }, []);


    useEffect(() => {
        const getQuiz = async () => {
            try {
                const questionSnapshot = await questionCollection.query().snapshot();
                questionSnapshot.forEach(questionRow => {
                    const { question_id, question } = questionRow.data;
                    //console.log('running question snapshot for loop for: ', question);
                    createQuiz[question_id] = { question: {question_id: question_id, question: question}, answers: [] };
                });
                const answerSnapshot = await answerCollection.query().snapshot();
                //console.log('number of rows in answerSnapshot: ', answerSnapshot.length);
                answerSnapshot.forEach((answerRow) => {
                    //console.log('loop iteration: ', `${index + 1}`)
                    const { answer_id, question_id, answer } = answerRow.data;
                    //console.log("running answer snapshot for loop for: ", answer);
                    // Check if the answer_id already exists in the answers array
                    // TODO: Fix this hacky solution because it's inefficient, but we don't really care b/c n
                    //       doesn't get very big.
                    const existingAnswer = createQuiz[question_id].answers.find(ans => ans.answer_id === answer_id);

                    // If the answer_id doesn't exist, push the new answer
                    if (!existingAnswer) {
                        const answerObject = { answer_id, answer };
                        createQuiz[question_id].answers.push(answerObject);
                    }
                })
                // Store final quiz in redux
                dispatch(setFinalQuiz(createQuiz));
                setLoading(false);

            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        getQuiz();

    }, []);

    useEffect(() => {
        // Convert totalScore into an array of objects
        const totalScoreArray = Object.entries(totalScore).map(([album_id, score]) => ({ album_id, score }));

        // Sort the array by score from biggest to smallest
        totalScoreArray.sort((a, b) => b.score - a.score);

        // Convert the sorted array back into an object
        // Sort the totalScore array by score from biggest to smallest
        const sortedTotalScore = [...totalScore].sort((a, b) => b.score - a.score);

        console.log('sortedTotalScore: ', sortedTotalScore);
        // Update the albumJourney state
        props.setAlbumJourney(sortedTotalScore);

    }, [totalScore]);

    // Set up final quiz and first question
    const finalQuiz = useSelector(state => state.quiz.finalQuiz)
    dispatch(setFirstQuestion(finalQuiz[questionIndex]));


    // Get quiz length to track progress through quiz
    const quizLength = Object.keys(finalQuiz).length;
    

    // Save current selection to userAnswers on button click
    function handleButtonClick(event) {
        event.preventDefault();
        // save user choice to userAnswers state
        const selectedAnswerId = event.currentTarget.id;
        console.log("answer id: ", selectedAnswerId);
        dispatch(updateUserAnswers({ [questionIndex]: selectedAnswerId }));
        // enable submit button
        setDisableButton(false);
    }

    // Function to insert quiz data into Postgres 
    const insertUserAnswersToDb = async () => {
        console.log('inserting quizAnswers: ', userAnswers);

        // TO DO - add the timestamp back into the DB insert once the squid schema updates
        //const currentDate = new Date(); // Get current date/time
        //const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' '); // Format date/time as YYYY-MM-DD HH:MM:SS

        for (const questionId in userAnswers) {
            const answerId = parseInt(userAnswers[questionId]);
            const userAnswerId = uuidv4();

            await userQuizCollection.doc({ user_answer_id: userAnswerId }).insert({
                user_answer_id: userAnswerId,
                user_id: userId,
                question_id: parseInt(questionId),
                answer_id: answerId,
                //timestamp: formattedDate,
            }).then(() => console.log("Answers inserted into DB successfully"))
            .catch((err) => console.error("Error inserting user answers into DB: ", err));
        }
      }

      // Function to update the user's quiz status in the DB
      const insertQuizStatusToDb = async () => {
        await usersCollection.doc({ id: userId }).update({
            quiz_taken: 'true',
        }).then(() => console.log("Quiz status updated successfully in DB"))
        .catch((err) => console.error("Error updating quiz status in DB: ", err));
    }
    
    // Handle user answers on answer submission
    async function handleSubmit(event) {
        event.preventDefault();

        // Calculate the index of the next question
        const newIndex = questionIndex + 1;
        
        // check if quiz is completed
        if (newIndex === quizLength) {
            // If the album_id is not in totalScoreArray, add it with a score of 0
            let updatedTotalScore = [...totalScore];
            allAlbums.forEach(album => {
                if (!updatedTotalScore.some(item => item.album_id === album)) {
                    const album_id = album.album_id;
                    const albumTitle = album.album_title;
                    const albumArtUrl = album.album_art_key;
                    const albumDescription = album.album_description;

                    updatedTotalScore.push({ album_id: album_id, score: 0, albumTitle: albumTitle, albumArtUrl:albumArtUrl, albumDescription: albumDescription });
                }
            });
            setTotalScore(updatedTotalScore);

            // Update quiz status in Redux
            dispatch(updateAlbumQuizTaken(true));
            
            // Write user answers to DB
            insertUserAnswersToDb();

            // Update the user's quiz status in the DB
            insertQuizStatusToDb();
        } else {
            // Get the answer's scores from the quiz_scoring table
            const getScores = async () => {
                const answerId = parseInt(userAnswers[questionIndex]);
                //console.log('getting snapshot for answer_id: ', answerId);
                //console.log('getting snapshot for question_id: ', finalQuiz[questionIndex].question.question_id);
                const scoreSnapshot = await quizScoringCollection
                    .query()
                    .eq('answer_id', answerId)
                    .eq('question_id', finalQuiz[questionIndex].question.question_id)
                    .dereference()
                    .snapshot();
                
                //console.log('scoreSnapshot: ', scoreSnapshot);
                scoreSnapshot.forEach(scoreRow => {
                    const { album_id, score } = scoreRow;
                    //console.log('album_id: ', album_id);
                    //console.log('score: ', score);

                    // Update the total score state
                    setTotalScore(prevTotalScore => {
                        const existingAlbumIndex = prevTotalScore.findIndex(item => item.album_id === album_id);

                        if (existingAlbumIndex > -1) {
                            // If the album_id already exists, update the score
                            const updatedTotalScore = [...prevTotalScore];
                            updatedTotalScore[existingAlbumIndex].score += score;
                            return updatedTotalScore;
                        } else {
                            // If the album_id does not exist, add a new object
                            return [...prevTotalScore, { album_id, score }];
                        }
                    });
                });
            }
            await getScores();

            // Get the next question from fullQuiz
            //console.log('setting next question: ', finalQuiz[newIndex])
            //console.log('fullquiz after submit: ', finalQuiz)
            const nextQuestion = finalQuiz[newIndex];
            dispatch(setQuestions({ newIndex, nextQuestion }))
            setDisableButton(true);
        }
    }

    // Get score of answer and add it to the user's score object
    // scoreObject = [{album_id: 1, score: 0}, {album_id: 2, score: 0}, {album_id: 3, score: 0}, etc]
    // STEPS
        // take the question_id and answer_id from the user answer; 
        // look up the score in the quiz_scoring table
        // for each row, add the score value to the related album_id in the scoreObject


    return (
        <Card>
            <Card.Body>
                <h2 className='text-center mb-4'>Start your Swiftie journey</h2>
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            currentQuestion && currentQuestion.answers && (
                                <div className='list-group'>
                                    <h5>{currentQuestion.question.question}</h5>
                                    <Form onSubmit={handleSubmit}>
                                        {currentQuestion.answers.map((answer, answerIndex) => (
                                            <div key={answerIndex}>
                                                <button 
                                                    type='button'
                                                    className='list-group-item list-group-item-action'
                                                    id={answer.answer_id}
                                                    onClick={handleButtonClick}
                                                >{answer.answer}</button>
                                            </div>
                                        ))}
                                        <button className='btn btn-primary wt-100 mt-4' disabled={disableButton}>Submit</button>
                                    </Form>
                                </div>
                            )
                        )}
                        
                    </div>
            </Card.Body>
        </Card>
    )
}

