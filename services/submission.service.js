import { db } from "../config/db.js"; // your DB connection

export const saveSubmission = async (data) => {
  const [result] = await db.execute(
    `INSERT INTO student_result_submissions 
      (student_full_name, father_name, mother_name, parent_phone_number,
       whatsapp_number, email_id, other_contact_number, standard, percentage,
       board, attachment_file_name, attachment_file_path, 
       attachment_file_size, attachment_file_type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.student_full_name,
      data.father_name,
      data.mother_name,
      data.parent_phone_number,
      data.whatsapp_number,
      data.email_id,
      data.other_contact_number,
      data.standard,
      data.percentage,
      data.board,
      data.file_name,
      data.file_path,
      data.file_size,
      data.file_type,
    ],
  );
  return result;
};
