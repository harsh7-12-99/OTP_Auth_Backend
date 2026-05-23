const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const { sendOTP, verifyOTP } = require("./controller/otpController");
const sendEmail = require("./controller/sendMail.controller");
const userRouter = require("./routes/userRoutes.routes");
const resultSubmissionRouter = require("./routes/submission.route");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("./config/db");

app.use(express.json());
app.use(cors());

app.use("/api/v1", userRouter);
app.use("/api/v1", resultSubmissionRouter);

app.post("/send-otp", sendOTP); // Send OTP API

const isEmail = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

const isPhone = (input) => {
  const phoneRegex = /^[0-9]{10}$/; // Adjust as per your format (India 10-digit)
  return phoneRegex.test(input);
};

const isUsername = (input) => {
  const usernameRegex = /^[A-Za-z]+$/;
  return usernameRegex.test(input);
};

const arrDummyStudentsListingData = [
  {
    studentId: "ASSP2024001",
    studentName: "Harsh Patel",
    parentName: "Ramesh Patel",
    standard: "B.Sc IT",
    percentage: 88.4,
    board: "GTU",
    email: "harsh.patel@example.com",
    phoneNumber: "9876543201",
    whatsappNumber: "9876543201",
    otherContactNumber: "9825011101",
    homeAddress: "Naroda, Ahmedabad",
    status: "verified",
    profileImage: "https://i.pravatar.cc/150?img=1",
    resultImage: "https://picsum.photos/400/300?random=1",
  },
  {
    studentId: "ASSP2024002",
    studentName: "Krishna Yadav",
    parentName: "Mahesh Yadav",
    standard: "12 Science",
    percentage: 91.2,
    board: "GSEB",
    email: "krishna.yadav@example.com",
    phoneNumber: "9876543202",
    whatsappNumber: "9876543202",
    otherContactNumber: "9825011102",
    homeAddress: "Nikol, Ahmedabad",
    status: "pending",
    profileImage: "https://i.pravatar.cc/150?img=2",
    resultImage: "https://picsum.photos/400/300?random=2",
  },
  {
    studentId: "ASSP2024003",
    studentName: "Meet Chauhan",
    parentName: "Suresh Chauhan",
    standard: "B.Com",
    percentage: 74.5,
    board: "Gujarat University",
    email: "meet.chauhan@example.com",
    phoneNumber: "9876543203",
    whatsappNumber: "9876543203",
    otherContactNumber: "9825011103",
    homeAddress: "Bapunagar, Ahmedabad",
    status: "rejected",
    profileImage: "https://i.pravatar.cc/150?img=3",
    resultImage: "https://picsum.photos/400/300?random=3",
  },
  {
    studentId: "ASSP2024004",
    studentName: "Dhruvi Ahir",
    parentName: "Paresh Ahir",
    standard: "MBA",
    percentage: 84.1,
    board: "GTU",
    email: "dhruvi.ahir@example.com",
    phoneNumber: "9876543204",
    whatsappNumber: "9876543204",
    otherContactNumber: "9825011104",
    homeAddress: "Odhav, Ahmedabad",
    status: "verified",
    profileImage: "https://i.pravatar.cc/150?img=4",
    resultImage: "https://picsum.photos/400/300?random=4",
  },
  {
    studentId: "ASSP2024005",
    studentName: "Yash Solanki",
    parentName: "Arvind Solanki",
    standard: "10 SSC",
    percentage: 79.6,
    board: "GSEB",
    email: "yash.solanki@example.com",
    phoneNumber: "9876543205",
    whatsappNumber: "9876543205",
    otherContactNumber: "9825011105",
    homeAddress: "Vastral, Ahmedabad",
    status: "pending",
    profileImage: "https://i.pravatar.cc/150?img=5",
    resultImage: "https://picsum.photos/400/300?random=5",
  },
  {
    studentId: "ASSP2024006",
    studentName: "Pooja Rabari",
    parentName: "Ketan Rabari",
    standard: "BCA",
    percentage: 86.3,
    board: "GTU",
    email: "pooja.rabari@example.com",
    phoneNumber: "9876543206",
    whatsappNumber: "9876543206",
    otherContactNumber: "9825011106",
    homeAddress: "Maninagar, Ahmedabad",
    status: "verified",
    profileImage: "https://i.pravatar.cc/150?img=6",
    resultImage: "https://picsum.photos/400/300?random=6",
  },
  {
    studentId: "ASSP2024007",
    studentName: "Ravi Gohil",
    parentName: "Bharat Gohil",
    standard: "Diploma Mechanical",
    percentage: 69.8,
    board: "GTU",
    email: "ravi.gohil@example.com",
    phoneNumber: "9876543207",
    whatsappNumber: "9876543207",
    otherContactNumber: "9825011107",
    homeAddress: "Isanpur, Ahmedabad",
    status: "rejected",
    profileImage: "https://i.pravatar.cc/150?img=7",
    resultImage: "https://picsum.photos/400/300?random=7",
  },
  {
    studentId: "ASSP2024008",
    studentName: "Komal Parmar",
    parentName: "Rajesh Parmar",
    standard: "M.Com",
    percentage: 81.9,
    board: "Gujarat University",
    email: "komal.parmar@example.com",
    phoneNumber: "9876543208",
    whatsappNumber: "9876543208",
    otherContactNumber: "9825011108",
    homeAddress: "CTM, Ahmedabad",
    status: "verified",
    profileImage: "https://i.pravatar.cc/150?img=8",
    resultImage: "https://picsum.photos/400/300?random=8",
  },
  {
    studentId: "ASSP2024009",
    studentName: "Amit Dangar",
    parentName: "Vinod Dangar",
    standard: "BE Computer",
    percentage: 92.7,
    board: "GTU",
    email: "amit.dangar@example.com",
    phoneNumber: "9876543209",
    whatsappNumber: "9876543209",
    otherContactNumber: "9825011109",
    homeAddress: "Narol, Ahmedabad",
    status: "pending",
    profileImage: "https://i.pravatar.cc/150?img=9",
    resultImage: "https://picsum.photos/400/300?random=9",
  },
  {
    studentId: "ASSP2024010",
    studentName: "Neha Mori",
    parentName: "Jignesh Mori",
    standard: "BA English",
    percentage: 77.4,
    board: "Gujarat University",
    email: "neha.mori@example.com",
    phoneNumber: "9876543210",
    whatsappNumber: "9876543210",
    otherContactNumber: "9825011110",
    homeAddress: "Vatva, Ahmedabad",
    status: "verified",
    profileImage: "https://i.pravatar.cc/150?img=10",
    resultImage: "https://picsum.photos/400/300?random=10",
  },
  {
    studentId: "ASSP2024011",
    studentName: "Jay Makwana",
    parentName: "Naresh Makwana",
    standard: "12 Commerce",
    percentage: 72.1,
    board: "CBSE",
    email: "jay.makwana@example.com",
    phoneNumber: "9876543211",
    whatsappNumber: "9876543211",
    otherContactNumber: "9825011111",
    homeAddress: "Nava Naroda, Ahmedabad",
    status: "pending",
    profileImage: "https://i.pravatar.cc/150?img=11",
    resultImage: "https://picsum.photos/400/300?random=11",
  },
  {
    studentId: "ASSP2024012",
    studentName: "Heena Bharwad",
    parentName: "Mukesh Bharwad",
    standard: "B.Pharm",
    percentage: 89.6,
    board: "GTU",
    email: "heena.bharwad@example.com",
    phoneNumber: "9876543212",
    whatsappNumber: "9876543212",
    otherContactNumber: "9825011112",
    homeAddress: "Amraiwadi, Ahmedabad",
    status: "verified",
    profileImage: "https://i.pravatar.cc/150?img=12",
    resultImage: "https://picsum.photos/400/300?random=12",
  },
  {
    studentId: "ASSP2024013",
    studentName: "Bhargav Rathod",
    parentName: "Raju Rathod",
    standard: "BBA",
    percentage: 68.2,
    board: "GTU",
    email: "bhargav.rathod@example.com",
    phoneNumber: "9876543213",
    whatsappNumber: "9876543213",
    otherContactNumber: "9825011113",
    homeAddress: "Khokhra, Ahmedabad",
    status: "rejected",
    profileImage: "https://i.pravatar.cc/150?img=13",
    resultImage: "https://picsum.photos/400/300?random=13",
  },
  {
    studentId: "ASSP2024014",
    studentName: "Priya Jadeja",
    parentName: "Dilip Jadeja",
    standard: "MCA",
    percentage: 90.4,
    board: "GTU",
    email: "priya.jadeja@example.com",
    phoneNumber: "9876543214",
    whatsappNumber: "9876543214",
    otherContactNumber: "9825011114",
    homeAddress: "Ghodasar, Ahmedabad",
    status: "verified",
    profileImage: "https://i.pravatar.cc/150?img=14",
    resultImage: "https://picsum.photos/400/300?random=14",
  },
  {
    studentId: "ASSP2024015",
    studentName: "Karan Chudasama",
    parentName: "Manoj Chudasama",
    standard: "11 Science",
    percentage: 83.7,
    board: "GSEB",
    email: "karan.chudasama@example.com",
    phoneNumber: "9876543215",
    whatsappNumber: "9876543215",
    otherContactNumber: "9825011115",
    homeAddress: "Memco, Ahmedabad",
    status: "pending",
    profileImage: "https://i.pravatar.cc/150?img=15",
    resultImage: "https://picsum.photos/400/300?random=15",
  },
  {
    studentId: "ASSP2024016",
    studentName: "Nidhi Koli",
    parentName: "Ashok Koli",
    standard: "B.Sc Nursing",
    percentage: 87.5,
    board: "GTU",
    email: "nidhi.koli@example.com",
    phoneNumber: "9876543216",
    whatsappNumber: "9876543216",
    otherContactNumber: "9825011116",
    homeAddress: "Hatkeshwar, Ahmedabad",
    status: "verified",
    profileImage: "https://i.pravatar.cc/150?img=16",
    resultImage: "https://picsum.photos/400/300?random=16",
  },
  {
    studentId: "ASSP2024017",
    studentName: "Rahul Dabhi",
    parentName: "Mahavir Dabhi",
    standard: "ITI Electrician",
    percentage: 64.9,
    board: "NCVT",
    email: "rahul.dabhi@example.com",
    phoneNumber: "9876543217",
    whatsappNumber: "9876543217",
    otherContactNumber: "9825011117",
    homeAddress: "Rakhial, Ahmedabad",
    status: "rejected",
    profileImage: "https://i.pravatar.cc/150?img=17",
    resultImage: "https://picsum.photos/400/300?random=17",
  },
  {
    studentId: "ASSP2024018",
    studentName: "Sneha Vaghela",
    parentName: "Pravin Vaghela",
    standard: "B.Ed",
    percentage: 85.2,
    board: "Gujarat University",
    email: "sneha.vaghela@example.com",
    phoneNumber: "9876543218",
    whatsappNumber: "9876543218",
    otherContactNumber: "9825011118",
    homeAddress: "Ramol, Ahmedabad",
    status: "pending",
    profileImage: "https://i.pravatar.cc/150?img=18",
    resultImage: "https://picsum.photos/400/300?random=18",
  },
  {
    studentId: "ASSP2024019",
    studentName: "Vikas Ahir",
    parentName: "Haribhai Ahir",
    standard: "BE Civil",
    percentage: 93.1,
    board: "GTU",
    email: "vikas.ahir@example.com",
    phoneNumber: "9876543219",
    whatsappNumber: "9876543219",
    otherContactNumber: "9825011119",
    homeAddress: "New Maninagar, Ahmedabad",
    status: "verified",
    profileImage: "https://i.pravatar.cc/150?img=19",
    resultImage: "https://picsum.photos/400/300?random=19",
  },
  {
    studentId: "ASSP2024020",
    studentName: "Riya Zala",
    parentName: "Kishor Zala",
    standard: "M.Sc Chemistry",
    percentage: 78.8,
    board: "Gujarat University",
    email: "riya.zala@example.com",
    phoneNumber: "9876543220",
    whatsappNumber: "9876543220",
    otherContactNumber: "9825011120",
    homeAddress: "Shahibaug, Ahmedabad",
    status: "pending",
    profileImage: "https://i.pravatar.cc/150?img=20",
    resultImage: "https://picsum.photos/400/300?random=20",
  },
];

const intTotalStudentsData = arrDummyStudentsListingData.length;

app.post("/api/v1/login", (req, res) => {
  const { identifier, password } = req.body;

  let field = "";
  if (isEmail(identifier)) {
    field = "email";
  } else if (isPhone(identifier)) {
    field = "phone";
  } else if (isUsername(identifier)) {
    field = "username";
  } else {
    return res.status(400).json({ error: "Invalid username!" });
  }

  const sql = `SELECT * FROM users WHERE ${field} = ?`;
  db.query(sql, [identifier], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(401).json({ error: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const payload = { id: user.id, username: user.username };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "Login successful", access_token });
  });
});

app.get("/api/v1/get-students-listing", (req, res) => {
  return res
    .status(200)
    .json({ data: arrDummyStudentsListingData, total: intTotalStudentsData });
});

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
