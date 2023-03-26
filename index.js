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
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



dbConnection();



app.use(express.json());

app.get('/', (req, res) => {
    res.send('home page of App!');
});
  




app.listen(3000);
