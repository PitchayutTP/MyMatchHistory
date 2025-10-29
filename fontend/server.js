import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000; 

// --- Middleware ---
app.use(cors()); 
app.use(express.json()); 

// --- VVV อัปเดต "ฐานข้อมูลจำลอง" VVV ---
// (เพิ่ม field profile เข้าไปใน user ที่มีอยู่)
let registeredUsers = [
  { 
    id: "1", 
    username: "admin", 
    password: "1234", 
    // ข้อมูล Profile ของ "admin"
    firstname: "Somsak (Admin)", 
    lastname: "Jaidee", 
    email: "somsak.admin@example.com", 
    phone_number: "081-234-5678", 
    description: "123/45 BKK, Thailand 10110" 
  },
  { 
    id: "2", 
    username: "user", 
    password: "pass",
    // ข้อมูล Profile ของ "user"
    firstname: "Somchai (User)", 
    lastname: "Makdee", 
    email: "somchai.user@example.com", 
    phone_number: "089-999-8888", 
    description: "I am a normal user." 
  },
];
// --- ^^^ จบส่วนอัปเดต ^^^ ---


// ----------------------------------------------
// 🚀 Endpoint: Register, Login, Reset... (เหมือนเดิม)
// ----------------------------------------------
app.post("/api/auth/register", (req, res) => { /* ...โค้ดเดิม... */ });
app.post("/api/auth/login", (req, res) => { /* ...โค้ดเดิม... */ });
app.post("/api/reset-password", (req, res) => { /* ...โค้ดเดิม... */ });

// ----------------------------------------------
// 🚀 Endpoint: Get User List (เหมือนเดิม)
// ----------------------------------------------
app.get("/api/users", (req, res) => { /* ...โค้ดเดิม... */ });

// ----------------------------------------------
// 🚀 Endpoint: Get User Detail (เหมือนเดิม)
// ----------------------------------------------
app.get("/api/users/:id", (req, res) => { /* ...โค้ดเดิม... */ });
app.get("/api/history/:userId", (req, res) => { /* ...โค้ดเดิม... */ });
app.delete("/api/history/:itemId", (req, res) => { /* ...โค้ดเดิม... */ });
app.put("/api/history/:itemId", (req, res) => { /* ...โค้ดเดิม... */ });


// ----------------------------------------------
// VVV --- Endpoint ใหม่สำหรับ "หน้าบัญชีของคุณ" --- VVV
// ----------------------------------------------

// 1. Endpoint: "ดึง" ข้อมูลโปรไฟล์ (GET)
app.get("/api/profile/:userId", (req, res) => {
  const { userId } = req.params;
  console.log(`Request to GET /api/profile/${userId}`);
  
  const user = registeredUsers.find(u => u.id === userId);
  
  if (user) {
    // ส่งเฉพาะข้อมูล Profile (ไม่ส่ง password!)
    return res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone_number: user.phone_number,
      description: user.description,
    });
  } else {
    return res.status(404).json({ detail: "User not found" });
  }
});

// 2. Endpoint: "อัปเดต" ข้อมูลโปรไฟล์ (PATCH)
// (PATCH = อัปเดตแค่บางส่วน)
app.patch("/api/profile/:userId", (req, res) => {
  const { userId } = req.params;
  const data = req.body;
  console.log(`Request to PATCH /api/profile/${userId}`, data);

  const userIndex = registeredUsers.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    // อัปเดตข้อมูล user ใน "ฐานข้อมูล"
    // (ใช้ ...spread operator เพื่อรวม object)
    registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...data };
    
    console.log("Profile updated for:", registeredUsers[userIndex].username);
    // ส่งข้อมูลที่อัปเดตแล้วกลับไป
    return res.status(200).json(registeredUsers[userIndex]);
  } else {
    return res.status(404).json({ detail: "User not found" });
  }
});

// ^^^ --- จบ Endpoint ใหม่ --- ^^^
app.post("/api/logout", (req, res) => {
  // (ในการใช้งานจริง Server อาจจะต้องทำลาย session หรือ invalidate token)
  
  // ใน Mock Server นี้ เราแค่รับรู้ว่ามีการ logout
  console.log("Request to /logout (User logged out)");
  
  // ส่ง 200 (OK) กลับไป
  return res.status(200).json({ message: "Logout successful" });
});

// --- รัน Server ---
app.listen(PORT, () => {
  console.log(`Mock Node.js server running on http://localhost:${PORT}`);
});