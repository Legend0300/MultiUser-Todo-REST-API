const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Task = require('../models/taskModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth  = require('../middleware/authUser');

// GET all users
router.get('/users', auth , async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a user by id
router.get('/users/:id', auth , getUser, (req, res) => {
  res.json(req.user);
});

// CREATE a new user
router.post('/users', async (req, res) => {


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword // Add the password field here
    });
    
    try {
    const newUser = await user.save();
    res.status(201).json(newUser);
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
    });

// UPDATE a user by id
router.patch('/users/:id', auth, getUser, async (req, res) => {
try {
    if(req.user)
    {
      const editeduser = await User.findByIdAndUpdate(req.params.id ,
        req.body,
        { new: true });
        res.json(editeduser);
      }
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a user by id
router.delete('/users/:id', auth , getUser, async (req, res) => {
  try {
    if(req.user)
    {
      const deleteduser = await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email' });
  }

  // Compare the password with the hashed password in the database
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Create a JWT token
  const token = jwt.sign({
    user : {
      name: user.name,
      email: user.email ,
      id: user._id
    }

} , process.env.JWT_SECRET, {
    expiresIn: '1h'
    });

  // Send the token in the response
  console.log(token);
  res.json({ token });
})

// GET all tasks
router.get('/tasks', auth , async (req, res) => {
  try {
    const tasks = await Task.find({user: req.user.id});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET a task by id
router.get('/tasks/:id', auth  , getTask, async (req, res) => {
  try {
    const tasks = await Task.find(req.params.id);
    res.json(tasks);
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a new task
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    user: req.user.id,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a task by id
router.patch('/tasks/:id', auth, getTask, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id , 
      req.body,
      { new: true })
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a task by id
router.delete('/tasks/:id', auth, getTask, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
    }
});

//setup middleware for get user by id
async function getUser(req, res, next) {
  let user;
  try {
      user = await User.findById(req.params.id);
      if (user == null) {
          return res.status(404).json({ message: 'Cannot find user' });
      }
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
  req.user = user; // attach user to req object
  next();
}
//setup middleware for get task by id
async function getTask(req, res, next) {
    let task;
    try {
        task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'Cannot find task' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    next()
}

module.exports = router;