import { MongoClient } from "mongodb";

const uri = "mongodb+srv://user:yourPassword@cluster0.yf6drze.mongodb.net/appointments?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected!");
    await client.close();
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

testConnection();
