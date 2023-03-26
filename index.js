express = require('express');
const dbConnection = require('./config/dbConnection');
const apis = require('./routes/usertasksRoutes');
app = express();
app.use(express.json());
app.use('/api', apis);
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());


dbConnection();



app.set('view engine', 'ejs');
app.use(express.json());

app.get('/login', function(req, res){
    res.render('login');
    }
);

app.post('/login', function(req, res){

});
  
  




app.listen(3000);
