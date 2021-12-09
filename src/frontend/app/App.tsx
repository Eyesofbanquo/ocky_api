import React, { FC, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { CardView } from './components/CardView';
import Question from './model/question';

const App: React.FC = (props) => {
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
  return (
    <Container maxWidth="sm">
      <Typography variant="h1">Ocky App</Typography>
      {questions.map((question) => (
        <CardView
          key={question.id}
          id={question.id}
          name={question.name}
          player={question.player}
          type={question.type}
        />
      ))}
    </Container>
  );
};

export default App;
