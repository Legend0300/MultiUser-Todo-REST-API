const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Task = require('../models/taskModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth  = require('../middleware/authUser');
const adminauth  = require('../middleware/authAdmin');
router.use(express.urlencoded({ extended: false }))
router.use(express.json())
const cookieParser = require('cookie-parser');
router.use(cookieParser());


router.get("/home" , (req, res) => {
  res.render("home" , {user: req.user});
}
)

router.get("/logout" , (req, res) => {
    res.clearCookie('jwt');
    res.clearCookie('adminjwt');
    req.session = null
    res.redirect("/api/home");
  });
  


router.get("/register" , (req, res) => {
  res.render("adduser");
}
)
// GET all users
router.get('/users', adminauth , async (req, res) => {
  try {
    const users = await User.find();
    res.render("users" , {users: users ,
      name: req.user.name,
      email: req.user.email,
      usertype: req.user.usertype,
    id: req.user.id});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

// GET a user by id
router.get('/users/:id', adminauth , getUser, (req, res) => {
  res.render("user" , {user: req.user ,usertype: req.body.usertype});
});

// CREATE a new user
router.post('/users', async (req, res) => {


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    usertype: req.body.usertype
    // Add the password field here
    });
    
    try {
    const newUser = await user.save();
    res.status(201).send("<h1> user Created! </h1> "  + '<a href="/api/users"><button type="button" class="btn btn-success">Dashboard</button></a>' + newUser);
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
    });

// UPDATE a user by id
// router.get('/users/update/:id', adminauth, getUser, async (req, res) => {
// try {
//     if(req.user)
//     {
//       const editeduser = await User.findByIdAndUpdate(req.params.id ,
//         req.body,
//         { new: true });
//         res.json(editeduser);
//       }
//     } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// DELETE a user by id
router.get('/users/delete/:id', adminauth , getUser, async (req, res) => {
  try {
    if(req.user)
    {
      const deleteduser = await User.findByIdAndDelete(req.params.id);
      res.send(`<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
      <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css" integrity="sha512-zFYDjyLq3yXs0sE4bA4YwP/Yyn/Oc0o63OeEzLnWp/H1tOz9EBaKVdD8z1tDwFZtdzQDXDTJtF/kEz+Mn54JyA==" crossorigin="anonymous" referrerpolicy="no-referrer" /><div class="container"><h1> user Deleted! </h1> <a href="/api/users"><button type="button" class="btn btn-success">Dashboard</button></a> <br> ${deleteduser}`);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.get("/login" , (req, res) => {
  res.render("login");
}
)

router.post('/login', async (req, res) => {
  const { email, password , usertype} = req.body;
  console.log(email);
  console.log(password);
  console.log(usertype);
  if(usertype == "user")
  {
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
        usertype: user.usertype,
        id: user._id
      }
  
    } , process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
  
    // Send the token in the cookie
    res.cookie('jwt', token , { httpOnly: true});
    res.redirect(`/api/tasks`);
    
  }
  else if (usertype === "admin") {

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
  
    // Check if the user exists and is an admin
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    // Compare the password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    // Create a JWT token
    const token = jwt.sign({
      user: {
        name: user.name,
        email: user.email,
        usertype: user.usertype,
        id: user._id
      }
  
    }, process.env.JWT_ADMIN_SECRET, {
      expiresIn: '1h'
    });

  
  
    // Send the token in the cookie
    res.cookie('adminjwt', token, { httpOnly: true });
    res.redirect('/api/users');
  }
  
})

// GET all tasks
router.get('/tasks', auth , async (req, res) => {
  console.log("from tasks: " + res.cookie.jwt); 
  try {
    const tasks = await Task.find({user: req.user.id});
    res.render("tasks", {tasks: tasks ,
      name: req.user.name,
      id: req.user.id,
      email: req.user.email,
});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a task by id
router.get('/tasks/:id', auth, getTask, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.render("task", {task: task});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/newtask', auth, async (req, res) => {
  res.render("addtask");
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
    res.status(201).send("<h1>Task added! </h1>" +  '<a href="/api/tasks"><button type="button" class="btn btn-success">Dashboard</button></a>' + newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a task by id

router.get('/tasks/update/:id', auth, getTask, async (req, res) => {
  res.render("edittask", {task: req.task});
});

router.post('/tasks/update/:id', auth, getTask, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id , 
      req.body,
      { new: true })
    res.send( "<h1>task updated!</h1>" + '<a href="/api/tasks"><button type="button" class="btn btn-success">Dashboard</button></a>' + updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a task by id
router.get('/tasks/delete/:id', auth, getTask, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.send( "<h1>task deleted!</h1>" + '<a href="/api/tasks"><button type="button" class="btn btn-success">Dashboard</button></a>' + deletedTask);
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
        req.task = task;
        if (task == null) {
            return res.status(404).json({ message: 'Cannot find task' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    next()
}

module.exports = router;