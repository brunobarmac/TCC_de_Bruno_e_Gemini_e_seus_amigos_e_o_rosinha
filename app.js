import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const users = [];
const mindmaps = [];
const JWT_SECRET = "segredo-super-seguro";

// Middleware de autenticação
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).send({ error: "Token ausente" });
  const token = header.replace("Bearer ", "");
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).send({ error: "Token inválido" });
  }
}

// REGISTRO
app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), name, email, password: hash };
  users.push(user);
  res.status(201).send({ id: user.id, name: user.name, email: user.email });
});

// LOGIN
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).send({ error: "Usuário não encontrado" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).send({ error: "Senha incorreta" });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.send({ accessToken: token });
});

// CRIAR MAPA
app.post("/mindmaps", auth, (req, res) => {
  const { title, description } = req.body;
  const map = { id: Date.now().toString(), title, description, owner: req.user.id };
  mindmaps.push(map);
  res.status(201).send(map);
});

app.listen(3000, () => console.log("🚀 API rodando em http://localhost:192.168.2.176"));