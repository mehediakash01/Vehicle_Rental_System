

import express, { Request, Response } from "express";
const app = express()
const port = 5000

app.get('/', (req:Request, res:Response) => {
  res.send('Ronaldo is the Goat!')
})

app.listen(port, () => {
  console.log(`vehicle Running on port ${port}`)
})
