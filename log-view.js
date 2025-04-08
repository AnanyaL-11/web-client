// web-application/log-view.js
import { DRONE_ID } from "./config.js";

const apiUrl =  `http://172.20.10.4:3000/logs/${DRONE_ID}`;


async function loadLogs() {
  try {
    const response = await fetch(apiUrl);
    const logs = await response.json();

    const tableBody = document.querySelector("#log-table tbody");
    tableBody.innerHTML = ""; 

    logs.forEach(log => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td data-label="Drone ID">${log.drone_id}</td>
        <td data-label="Drone Name">${log.drone_name}</td>
        <td data-label="Country">${log.country}</td>
        <td data-label="Celsius">${log.celsius}</td>
        <td data-label="Created">${log.created}</td>
      `;

      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error("Error loading logs:", err);
  }
}

loadLogs();
