import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { saveSubmission } from "../services/submission.service.js";

export const submitResult = async (req, res) => {
  try {
    const {
      "student-full-name": studentFullName,
      "father-name": fatherName,
      "mother-name": motherName,
      "parent-phone-number": parentPhoneNumber,
      "whatsapp-number": whatsappNumber,
      "email-id": emailId,
      "other-contact-number": otherContactNumber,
      standard,
      percentage,
      board,
    } = req.body;

    // Upload file to Cloudinary
    let attachmentData = null;
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
      );
      attachmentData = {
        file_name: req.file.originalname,
        file_path: cloudinaryResult.secure_url, // store this URL in DB
        file_size: req.file.size,
        file_type: req.file.mimetype,
      };
    }

    // Save to DB
    const submission = await saveSubmission({
      student_full_name: studentFullName,
      father_name: fatherName,
      mother_name: motherName,
      parent_phone_number: parentPhoneNumber,
      whatsapp_number: whatsappNumber,
      email_id: emailId || null,
      other_contact_number: otherContactNumber,
      standard,
      percentage: parseFloat(percentage),
      board,
      ...attachmentData,
    });

    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: submission,
    });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
