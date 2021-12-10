import React, { FC } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Routes, Route, Link } from 'react-router-dom';
import QuestionList from './components/QuestionList';

const App: FC = (props) => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h1">Ocky App</Typography>
      <Routes>
        <Route path="/" element={<QuestionList />} />
        <Route path="/questions" element={<QuestionList />}></Route>
      </Routes>
    </Container>
  );
};

export default App;
