// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var authRouter = require('./authRouter')
//
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/auth', authRouter)
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;
///////////////////////////////////
// const express = require('express');
// const authRouter = require('./authRouter');
// const cors = require('cors');
//
// const db = require('./database'); // Update the path to match your project structure
//
// const app = express();
// const corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200,
//   credentials: true,
//   exposedHeaders: ['Content-Length', 'Authorization'],
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };
//
//
// app.use(express.json());
// app.use(`/auth`, authRouter);
// app.use(cors(corsOptions));
//
// // Add a simple test endpoint
// app.get('/test', (req, res) => {
//   res.json({ message: 'Backend is connected to frontend!' });
// });
//
// const PORT = process.env.PORT || 5000;
// const startServer = async () => {
//   try {
//     // Check the connection to the database
//     await db.authenticate();
//     console.log('Connection to PostgreSQL has been established successfully.');
//
//     // Create tables based on defined Sequelize models
//     await db.sync();
//
//     app.listen(PORT, () => {
//       console.log(`Server started on port ${PORT}`);
//     });
//   } catch (e) {
//     console.error('Unable to connect to the database:', e);
//     process.exit(1); // exit with an error code
//   }
// };
//
// startServer();
/////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT ?? 8000
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const app = express()
const pool = require('./database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

app.get('/users', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);  // Log the actual error message
    res.status(500).send('Internal Server Error');
  }
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  try {
    const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
        [email, hashedPassword])

    const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })

    res.json({ email, token })
  } catch (err) {
    console.log(err.toString())
      res.json({ detail: err})

  }
})


// login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (!users.rows.length) return res.json({ detail: 'User does not exist!' })

    const success = await bcrypt.compare(password, users.rows[0].hashed_password)
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })

    if (success) {
      res.json({ 'email' : users.rows[0].email, token})
    } else {
      res.json({ detail: "Login failed"})
    }
  } catch (err) {
    console.error(err)
  }
})

app.listen(PORT, ( )=> console.log(`Server running on PORT ${PORT}`))