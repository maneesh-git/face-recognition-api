const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

/*

    Database connection strings : 
    add database url in connectionString.
    Also add tables users and login in the database before registering or signing in.

    Following is the code for adding the tables users and login in PostgreSQL.

    CREATE TABLE users(
        id serial PRIMARY KEY,
        name varchar(100),
        email text UNIQUE NOT NULL,
        entries BIGINT DEFAULT 0,
        joined TIMESTAMP NOT NULL
    );

    CREATE TABLE login(
        id serial PRIMARY KEY,
        hash varchar(100) NOT NULL,
        email text UNIQUE NOT NULL,
    );
*/

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send("It is working."))
app.post('/signin', (req,res) => signin.handleSignin(req,res,db, bcrypt))
app.post('/register', (req,res) => register.handleRegister(req,res,db, bcrypt))
app.get('/profile/:id', (req,res) => profile.handleProfileGet(req,res,db))
app.put('/image', (req,res) => image.handleImagePut(req,res,db))
app.post('/imageurl',(req,res) => image.handleImageApiCall(req,res))

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})
/*
    Endpoints
    
    /  --> res = It is working
    /signin --> POST - success/fail
    /register --> POST - user
    /profile/:id --> To show profile of user GET = user
    /image --> To add image score so PUT = user 
    /rank --> To get user's rank
*/