import { Request, Response, NextFunction, request } from 'express';
import { questionHash } from './db/hash';
import {
  retrieveAllQuestions,
  retrieveSingleIdFromOckyQuestionHash,
  retrieveAllOckyQuestionHashIds,
} from './db/queries';
import pool from './db/pool';

export const RetrieveOckyQuestionHash = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const hash_id = request.query.id;
  const result = await pool.query(retrieveSingleIdFromOckyQuestionHash, [
    hash_id,
  ]);
  const rows = result.rows;

  if (rows.length > 0) {
    const question_id = rows[0].fk_question_id;
    request.body.question_id = question_id;
    next();
  } else {
    response.send({
      status: 200,
      error: {
        message: 'Question does not exist/was not hashed.',
      },
    });
  }
};

export const RetrieveAllQuestions = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const result = await pool.query(retrieveAllQuestions);
  const rows = result.rows;

  const questions = rows.map((row) => row.question.quiz_question);
  const availableKeys = questionHash.map((hash) => hash.key);

  questions.forEach((question) => {
    const foundHash = questionHash.find(
      (hash) => hash.value === question.id
    ).key;
    question.hash_id = foundHash;
  });

  request.body.questions = questions;
  next();
};

/**
 * Middleware that looks to just find the question from the hash and creates link
 * @param request
 * @param response
 * @param next
 */
export const QuestionUrlFinderMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const hash_id = request.query.id;

  const result = await pool.query(retrieveAllOckyQuestionHashIds);
  const rows = result.rows;
  const containsHash = rows.find((row) => row.code_id.toString() === hash_id);

  if (containsHash) {
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
