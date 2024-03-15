const express = require('express');
const axios = require('axios');
const md5 = require('md5');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Users',
  password: 'pw',
  port: 5432,
});

//Getting additional info from the API 
async function fetchUserInfo(username, timestamp) {
  try {
    const response = await axios.get('https://eofvhpgrx56rud5.m.pipedream.net', {
      params: { username, timestamp },
      authorization: {
        Username: 'Summer',
        Password: 'AmazingProgrammer134!',
      },
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//Routing post requests
app.post('/register', async (req, res) => {
  try {
    const { username, password, timestamp } = req.body;

    const pw = md5(password);

    const userInfo = await fetchUserInfo(username, timestamp);

    //Adding data to the database
    const query = 'INSERT INTO users (username, password, info) VALUES ($1, $2, $3)';
    await pool.query(query, [username, pw, JSON.stringify(userInfo)]);

    res.status(200).json({ message: 'User registration successful.' });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port ${PORT}');
});