import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
const app = express();

app.use(cors());
app.use(express.json());
const api_key = "p8k4r8ua5w5y";
const api_secret =
  "bke93fcs55m29vg3ca4uarkdx9m8xmbthwfugb2eahxhauvb5zxysddn2jmyddw5";
const serverClient = StreamChat.getInstance(api_key, api_secret);

async function isUsernameTaken(username) {
  const response = await serverClient.queryUsers({ username });
  return response.users.length > 0;
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
    const { users } = await serverClient.queryUsers({ name: username });
    if (users.length === 0) return res.json({ message: "User not found" });

    const token = serverClient.createToken(users[0].id);
    const passwordMatch = await bcrypt.compare(
      password,
      users[0].hashedPassword
    );

    if (passwordMatch) {
      res.json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        username,
        userId: users[0].id,
      });
    }
  } catch (error) {
    res.json(error);
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
