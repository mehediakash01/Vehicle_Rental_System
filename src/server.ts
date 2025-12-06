


import express, { Request, Response } from "express";

import config from "./config";
import initDB from "./config/dB";
import { userRoutes } from "./modules/user/user.routes";

const app = express()
const port = config.port
app.use(express.json())
// initializing database
initDB();

app.use("/users",userRoutes);

app.get('/', (req:Request, res:Response) => {
  res.send('Ronaldo is the Goat!')
})

app.listen(port, () => {
  console.log(`vehicle Running on port ${port}`)
})
