import { Request, Response, NextFunction } from 'express';
import { questionHash } from './db/hash';
import { retrieveAllQuestions } from './db/queries';
import pool from './db/pool';

export const RetrieveAllQuestions = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const result = await pool.query(retrieveAllQuestions);
  const rows = result.rows;

  const questions = rows.map((row) => row.question.quiz_question);

  request.body.questions = questions;
  next();
};

/**
 * Middleware that looks to just find the question from the hash and creates link
 * @param request
 * @param response
 * @param next
 */
export const QuestionUrlFinderMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const hash_id = request.query.id;
  const availableKeys = questionHash.map((hash) => hash.key);

  if (availableKeys.find((key) => key == hash_id) != undefined) {
    const url = `https://ocky-api.herokuapp.com/q?id=${hash_id}`;
    request.body.question_url = url;
    next();
  } else {
    response.send({
      status: 200,
      error: {
        message: 'Code does not exist',
      },
    });
  }
};

export const QuestionQRCodeGenerator = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const url = request.body.question_url;
  const qr_code_url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`;

  request.body.qrcode = qr_code_url;

  next();
};
