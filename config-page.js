import { DRONE_ID } from "./config.js";

const apiUrl = `http://172.20.10.4:3000/configs/${DRONE_ID}`;


console.log("Fetching from:", apiUrl);  

async function loadConfig() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Data received:", data);  

    document.getElementById("drone-id").textContent = data.drone_id;
    document.getElementById("drone-name").textContent = data.drone_name;
    document.getElementById("light").textContent = data.light;
    document.getElementById("country").textContent = data.country;
  } catch (err) {
    console.error("Error loading config:", err);  
  }
}
loadConfig();
