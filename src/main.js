import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import routes from "./routes/index.js";

// Ncharjiw el variables d'environnement mel fichier .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware bech Express yefhem el JSON fel request body
app.use(express.json());

// Route basique bech nthabbtou elli el serveur yekhdem
app.get("/", (req, res) => {
  res.json({ message: "API tekhdem jawha behi!" });
});

// Nrabbtou el routes el kol ta7t /api (par ex: /api/auth/login)
app.use("/api", routes);

// Nconnectiw lel MongoDB 9bal ma nkhaddmou el serveur
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
