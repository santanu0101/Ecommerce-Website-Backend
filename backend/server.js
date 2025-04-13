import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import { app } from "./app.js";

dotenv.config();
const port = process.env.PORT || 7000;

connectDb().then(() => {
  app.on("error", (error) => {
    console.log("error", error);
    throw error;
  });
  app.listen(port, () => console.log(`Server listening on port ${port}!`));
}).catch((error)=>{
    console.log(`connection fail error ${error}`)
})
