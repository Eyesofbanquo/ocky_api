/* Create Quiz */
INSERT INTO quizzes (quiz_id, name, player) VALUES ('a86c639b-496a-4817-9d4d-908944e2ba8f', 'DJ Salinger quiz', 'DJ Salinger');

/* Question 1 */
INSERT INTO questions (question_id, name, player, question_type, fk_quiz_id) VALUES ('81309d24-4626-4288-95a3-f0b4892b46fc', 'question 1', 'DJ Salinger', 2, 'a86c639b-496a-4817-9d4d-908944e2ba8f');
INSERT INTO answers (answer_id, is_correct, text, fk_question_id) VALUES ('8695402e-a19c-45eb-8dce-298c38bafbde', false, 'False', '81309d24-4626-4288-95a3-f0b4892b46fc');
INSERT INTO answers (answer_id, is_correct, text, fk_question_id) VALUES ('5d2247f7-8e23-4d6f-a379-7f90e4e5cfad', true, 'True', '81309d24-4626-4288-95a3-f0b4892b46fc');

/* Question 2 */
INSERT INTO questions (question_id, name, player, question_type, fk_quiz_id) VALUES ('3e979c20-175d-419f-a4e5-cf0017659926', 'question 2', 'DJ Salinger', 0, 'a86c639b-496a-4817-9d4d-908944e2ba8f');
INSERT INTO answers (answer_id, is_correct, text, fk_question_id) VALUES ('2b00f5af-b58f-4588-82cd-a02b1fc30d81', false, 'One', '3e979c20-175d-419f-a4e5-cf0017659926');
INSERT INTO answers (answer_id, is_correct, text, fk_question_id) VALUES ('3ad1a6c1-1f34-4896-bc22-6e92c8ead4f1', true, 'Two', '3e979c20-175d-419f-a4e5-cf0017659926');
INSERT INTO answers (answer_id, is_correct, text, fk_question_id) VALUES ('fff17507-71c8-42f3-acb7-b76d126de020', true, 'Three', '3e979c20-175d-419f-a4e5-cf0017659926');