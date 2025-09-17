import { createClient } from "redis";

const client = createClient({
  url: "redis://localhost:6379",
  // password: "your_password"  // if needed
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect(); 
console.log("Connected to Redis");

export default client;