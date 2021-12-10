require('dotenv').config();

import Express, { json } from 'express';
import { Request, Response } from 'express';
import { retrieveQuestionUsingId } from './db/queries';
import { questionHash } from './db/hash';
import pool from './db/pool';
import {
  QuestionUrlFinderMiddleware,
  QuestionQRCodeGenerator,
  RetrieveAllQuestions,
  RetrieveOckyQuestionHash,
} from './middleware';
const path = require('path');

const app = Express();
app.use(json());
app.use(Express.static(path.join(__dirname, 'frontend/app')));

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

app.get(
  '/api/retrieve-questions',
  RetrieveAllQuestions,
  async (request: Request, response: Response) => {
    const questions = request.body.questions;

    response.send({
      status: 200,
      body: {
        questions: questions,
      },
    });
  }
);

/**
 * This is the request used for app clips
 */
app.get(
  '/q',
  RetrieveOckyQuestionHash,
  async (request: Request, response: Response) => {
    const question_id = request.body.question_id;

    const result = await pool.query(retrieveQuestionUsingId, [question_id]);
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
  }
);

app.get(
  '/q/code',
  QuestionUrlFinderMiddleware,
  async (request: Request, response: Response) => {
    const url = request.body.question_url;

    response.send({
      status: 200,
      body: {
        question_url: url,
        qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`,
      },
    });
  }
);

app.get(
  '/q/code/redirect',
  QuestionUrlFinderMiddleware,
  QuestionQRCodeGenerator,
  async (request: Request, response: Response) => {
    const url = request.body.qrcode;

    response.redirect(url);
  }
);

app.get('*', (request: Request, response: Response) => {
  response.sendFile(path.join(__dirname, './frontend/app/index.html'));
});

if (process.env.PORT) {
  app.listen(process.env.PORT, () => {
    console.debug(`Listening on port ${process.env.PORT}`);
  });
} else {
  app.listen(3000, () => console.debug(`Listening on port 3000`));
}
