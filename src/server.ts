


import express, { Request, Response } from "express";

import config from "./config";
import initDB from "./config/dB";

const app = express()
const port = config.port
app.use(express.json())

initDB();

app.get('/', (req:Request, res:Response) => {
  res.send('Ronaldo is the Goat!')
})

app.listen(port, () => {
  console.log(`vehicle Running on port ${port}`)
})
