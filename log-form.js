// web-client/log-form.js
import { DRONE_ID, API_BASE_URL } from "./config.js";

// โหลด config มาก่อน
let configData = null;

async function loadConfig() {
  try {
    const response = await fetch(`http://172.20.10.4:3000/configs/${DRONE_ID}`);
    configData = await response.json();
  } catch (err) {
    console.error("Error loading config:", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadConfig();

  const form = document.getElementById("temp-form");
  const status = document.getElementById("status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const celsius = parseFloat(document.getElementById("celsius").value);

    const payload = {
      drone_id: configData.drone_id,
      drone_name: configData.drone_name,
      country: configData.country,
      celsius,
    };

    try {
      const res = await fetch(`http://172.20.10.4:3000/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        status.textContent = "✅ Submitted successfully!";
        form.reset();
      } else {
        status.textContent = "❌ Failed to submit!";
      }
    } catch (err) {
      console.error("Submit error:", err);
      status.textContent = "⚠️ Error submitting log.";
    }
  });
});
