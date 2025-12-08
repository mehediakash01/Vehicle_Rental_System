


import express, { Request, Response } from "express";

import config from "./config";
import initDB from "./config/dB";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRouter } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.route";

const app = express()
const port = config.port

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// initializing database
initDB();
// user apis
app.use("/users",userRoutes);

// vehicle apis
app.use("/api/v1/vehicles",vehicleRouter)
// booking api's
app.use("/api/v1/bookings",bookingRoutes)

app.get('/', (req:Request, res:Response) => {
  res.send('Ronaldo is the Goat!')
})

app.listen(port, () => {
  console.log(`vehicle Running on port ${port}`)
})
