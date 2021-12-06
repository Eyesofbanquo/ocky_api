require('dotenv').config();

import Express, { json } from 'express';
import { Request, Response } from 'express';
import pool, {
  createUUIDExtension,
  createAnswerTableIfNeeded,
  createQuestionTableIfNeeded,
  createQuizTableIfNeeded,
} from './db/pool';

createUUIDExtension().catch();
createAnswerTableIfNeeded().catch();
createQuestionTableIfNeeded().catch();
createQuizTableIfNeeded().catch();

const app = Express();
app.use(json());

app.get('/', (request: Request, response: Response) => {
  response.send('hello, world');
});

app.get('/test-quiz', async (request: Request, response: Response) => {
  const query = `select json_build_object( 'id', quiz.quiz_id, 'name', quiz.name, 'player', quiz.player, 'question', json_build_object( 'id', question.question_id, 'type', question.question_type, 'choices', json_build_object( 'id', answer.answer_id, 'is_correct', answer.is_correct, 'text', answer.text ) ) ) as quiz from quizzes quiz inner join questions question on question.fk_quiz_id = quiz.quiz_id inner join answers answer on answer.fk_question_id = question.question_id;`;

  const quizQuery = `select quiz_id as id, name, player from quizzes;`;

  const quizResults = await pool.query(quizQuery);
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

if (process.env.PORT) {
  app.listen(process.env.PORT, () => {
    console.debug(`Listening on port ${process.env.PORT}`);
  });
} else {
  app.listen(3000, () => console.debug(`Listening on port 3000`));
}
