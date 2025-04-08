import express from 'express';
import axios from 'axios';
import cors from 'cors';


const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // หรือเปลี่ยน * เป็น origin ที่ต้องการ
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// GET /configs/:id
app.get('/configs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec`);

    const config = response.data;
    res.json({
      drone_id: 64050738,
      drone_name: "Ananya Lucksorn",
      light: "on",
      country: "Thailand",
      weight: 55
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data from Drone Config Server' });
  }
});

// GET /status/:id
app.get('/status/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec?id=${id}`);
    
    const droneConfig = response.data;

    let condition = "good"; 

    if (droneConfig.status === 'offline') {
      condition = "offline";
    }

    res.json({ condition });

  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ message: 'Error fetching drone status data' });
  }
});

//GET/logs/:id
app.get('/logs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get('https://app-tracking.pockethost.io/api/collections/drone_logs/records', {
      params: {
        filter: `drone_id="${id}"`,  
        sort: '-created',            
        perPage: 25                  
      }
    });

    const logs = response.data.items.map(log => ({
      drone_id: log.drone_id,
      drone_name: log.drone_name,
      created: log.created,
      country: log.country,
      celsius: log.celsius
    }));

    res.json(logs);

  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.status(500).json({ message: 'Error fetching drone logs data' });
  }
});

// POST /logs
app.post('/logs', express.json(), async (req, res) => {
  const { drone_id, drone_name, country, celsius } = req.body;

  try {
    const response = await axios.post(
      'https://app-tracking.pockethost.io/api/collections/drone_logs/records',
      {
        drone_id,
        drone_name,
        country,
        celsius
      },
      {
        headers: {
          Authorization: 'Bearer 20250301efx',
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(201).json({
      message: 'Log created successfully!',
      log: response.data
    });

  } catch (error) {
    console.error('Error creating log:', error.message);
    res.status(500).json({ message: 'Failed to create log' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
