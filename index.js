const express = require('express');
const connectDB = require('./db');
const Student = require('./models/Student');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(express.json());

// Route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Student Management API');
});

// List all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get a specific student
app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');
    res.status(200).json(student);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add a new student
app.post('/students', async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    const newStudent = new Student({ name, age, grade });
    const student = await newStudent.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update a student's details
app.put('/students/:id', async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');

    student.name = name;
    student.age = age;
    student.grade = grade;

    student = await student.save();
    res.status(200).json(student);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete a student
app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');

    await student.remove();
    res.status(200).json({ msg: 'Student removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
