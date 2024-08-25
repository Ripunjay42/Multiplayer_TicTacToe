import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
const app = express();

const allowedOrigins = [
  "https://tictactoe-multiplayer-silk.vercel.app",
  "http://localhost:3000"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());


// app.use(cors());
app.use(express.json());
const api_key = "p8k4r8ua5w5y";
const api_secret =
  "bke93fcs55m29vg3ca4uarkdx9m8xmbthwfugb2eahxhauvb5zxysddn2jmyddw5";
const serverClient = StreamChat.getInstance(api_key, api_secret);

async function isUsernameTaken(username) {
  const { users } = await serverClient.queryUsers({ username });
  return users.length > 0;
}

app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;

    const usernameExists = await isUsernameTaken(username);
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);

    await serverClient.upsertUser({
      id: userId,
      username,
      first_name: firstName,
      last_name: lastName,
      hashedPassword,
    });

    res.status(201).json({ token, userId, firstName, lastName, username });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const { users } = await serverClient.queryUsers({ username });

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, users[0].hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = serverClient.createToken(users[0].id);

    res.status(200).json({
      token,
      firstName: users[0].firstName,
      lastName: users[0].lastName,
      username: users[0].username,
      userId: users[0].id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});


app.get('/users', async (req, res) => {
  try {
    const { usernames } = await serverClient.queryUsers({});
    res.status(200).json(usernames);
  } catch (error) {
    console.log('Error fetching users:', error.message);
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
