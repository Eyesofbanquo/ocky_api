import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import Question from '../model/question';
import { CardView } from './CardView';
import { useNavigate } from 'react-router-dom';
const QuestionList: FC = (props) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  useEffect(() => {
    axios
      .get('/api/retrieve-questions')
      .then((response) => {
        const networkResponseQuestions = response.data.body.questions;
        console.log(networkResponseQuestions);
        setQuestions(networkResponseQuestions);
      })
      .catch();
  }, []);
  const navigate = useNavigate();
  return (
    <>
      {questions.map((question) => (
        <CardView
          key={question.id}
          id={question.id}
          hash_id={question.hash_id}
          name={question.name}
          player={question.player}
          type={question.type}
        />
      ))}
    </>
  );
};

export default QuestionList;
