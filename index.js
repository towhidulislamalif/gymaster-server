require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const chalk = require('chalk');

const app = express();
const port = process.env.PORT;

// ? middleware
app.use(cors());
app.use(express.json());

// ? Database connection

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    // console.log(chalk.bgGreenBright('Database connection established'));
  } catch (err) {
    // console.log(chalk.bgRedBright(err.name, err.message));
  }
};

run();

const Users = client.db('genesys-softwares').collection('users');

// * routes
app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.send('Hello World!');
});

// get user from database
app.get('/users', async (req, res) => {
  try {
    const result = await Users.find({}).toArray();
    res.send({
      success: true,
      data: result,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});
// add user to database
app.put('/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = req.body;
    const filter = { email: email };
    const options = { upsert: true };
    const updatedDoc = {
      $set: user,
    };
    const result = await Users.updateOne(filter, updatedDoc, options);
    // console.log(result);
    res.send({
      success: true,
      data: result,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
