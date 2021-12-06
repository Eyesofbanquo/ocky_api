import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

let databaseConfig;

if (process.env.DATABASE_URL) {
  databaseConfig = { connectionString: process.env.DATABASE_URL };
}

const pool = new Pool(databaseConfig);

export default pool;

/* Create default database */
const databaseName = process.env.DATBASE_NAME ?? 'ocky_api';

/* Add UUID extension */
export const createUUIDExtension = async () => {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  } catch (error) {
    console.error(error);
  }
};

export const createAnswerTableIfNeeded = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS answers(
      answer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      is_correct BOOLEAN NOT NULL,
      text TEXT NOT NULL,
      deleted BOOLEAN DEFAULT FALSE NOT NULL,
      fk_question_id UUID REFERENCES questions(question_id),
      UNIQUE(text)
    )`);
  } catch (error) {
    console.log(error);
  }
};

export const createQuestionTableIfNeeded = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS questions(
      question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      player TEXT NOT NULL,
      question_type INTEGER NOT NULL,
      fk_quiz_id UUID REFERENCES quizzes(quiz_id),
      deleted BOOLEAN DEFAULT FALSE NOT NULL,
      UNIQUE(name)
    )`);
  } catch (error) {
    console.log(error);
  }
};

export const createQuizTableIfNeeded = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS quizzes(
      quiz_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      player TEXT NOT NULL,
      deleted BOOLEAN DEFAULT FALSE NOT NULL,
      UNIQUE(name)
    )`);
  } catch (error) {
    console.log(error);
  }
};
