require('dotenv').config();

import Express, { json } from 'express';
import { Request, Response } from 'express';
import pool from './db/pool';

const app = Express();
app.use(json());

app.get('/', (request: Request, response: Response) => {
  response.send('hello, world');
});

app.get(
  '/apple-app-site-association',
  (request: Request, response: Response) => {
    const json = require('../apple-app-site-association.json');
    response.send(json);
  }
);

app.get(
  '/.well-known/apple-app-site-association',
  (request: Request, response: Response) => {
    const json = require('../apple-app-site-association.json');
    response.send(json);
  }
);

/**
 * Need to have a hash table like so
 *
 * quizResults[0] = uuid for kyrinne
 * quizResults[1] = uuid for markim
 *
 * Basically you pass to the appclip just a regular number that is the index of the quiz/question
 */

const questionHash = [
  { key: '0', value: '81309d24-4626-4288-95a3-f0b4892b46fc' },
  { key: '123', value: '3e979c20-175d-419f-a4e5-cf0017659926' },
];

app.get('/test-quiz', async (request: Request, response: Response) => {
  const quizQuery = `select quiz_id as id, name, player from quizzes;`;

  const quizResults = await pool.query(quizQuery);

  if (quizResults.rows.length == 0) {
    response.send({
      status: 200,
      body: {
        message: "There aren't any quizzes",
      },
    });
    return;
  }

  const quizFromResult = quizResults.rows[0];

  console.log(quizResults.rows[0]); /* retreives one quiz */
  const choicesQuery = `
  select json_build_object(
    'quiz_question', json_build_object(
      'name', question.name,
      'id', question.question_id,
      'type', question.question_type,
      'choices', json_agg(json_build_object(
        'id', answer.answer_id,
        'is_correct', answer.is_correct,
        'text', answer.text
      ))
    )
  ) as quiz from quizzes quiz
  inner join questions question on question.fk_quiz_id = quiz.quiz_id
  inner join answers answer on answer.fk_question_id = question.question_id
  group by quiz.quiz_id, quiz.name, quiz.player, question.name, question.question_id, question.question_type;`;

  const result = await pool.query(choicesQuery);
  const rows = result.rows;
  console.log(rows);

  const questions = rows.map((row) => {
    const question = row.quiz.quiz_question;
    return {
      name: question.name,
      id: question.id,
      type: question.type,
      choices: question.choices,
    };
  });

  console.log(questions);

  const quiz = {
    id: quizFromResult.id,
    name: quizFromResult.name,
    player: quizFromResult.player,
    questions: questions,
  };

  response.send(quiz);
});

/**
 * This is the request used for app clips
 */
app.get('/q', async (request: Request, response: Response) => {
  const hash_id = request.query.id;

  const uuid = questionHash.find((f) => f.key === hash_id);

  if (uuid === undefined) {
    response.send({
      status: 200,
      error: {
        message: 'No question exists',
      },
    });
    return;
  }

  const choicesQuery = `
  select json_build_object(
    'quiz_question', json_build_object(
      'name', question.name,
      'id', question.question_id,
      'type', question.question_type,
      'choices', json_agg(json_build_object(
        'id', answer.answer_id,
        'is_correct', answer.is_correct,
        'text', answer.text
      ))
    )
  ) as question from questions question
  inner join answers answer on answer.fk_question_id = question.question_id
  where question_id = $1
  group by question.name, question.question_id, question.question_type;`;

  const result = await pool.query(choicesQuery, [uuid.value]);
  const rows = result.rows;

  if (rows.length < 1) {
    response.send({
      status: 200,
      error: {
        message: 'No question exists',
      },
    });
    return;
  }

  const question = rows[0].question.quiz_question;

  response.send({
    status: 200,
    body: {
      question: question,
    },
  });
});

if (process.env.PORT) {
  app.listen(process.env.PORT, () => {
    console.debug(`Listening on port ${process.env.PORT}`);
  });
} else {
  app.listen(3000, () => console.debug(`Listening on port 3000`));
}
