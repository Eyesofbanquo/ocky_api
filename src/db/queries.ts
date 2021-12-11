export const retrieveQuestionUsingId = `select json_build_object(
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

export const retrieveAllQuestions = `select json_build_object(
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
group by question.name, question.question_id, question.question_type;`;

export const retrieveAllOckyQuestionHashIds = `select * from ocky_question;`;

export const retrieveSingleIdFromOckyQuestionHash = `select * from ocky_question where code_id = $1`;
