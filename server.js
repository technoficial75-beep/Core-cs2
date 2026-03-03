const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

// Endpoint pre CS2 / CS:GO štatistiky
app.get('/api/stats/:steamid', async (req, res) => {
    const { steamid } = req.params;
    const API_KEY = process.env.STEAM_API_KEY;

    try {
        const url = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${API_KEY}&steamid=${steamid}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Nepodarilo sa načítať dáta. Skontroluj SteamID alebo či je profil verejný." });
    }
});

app.listen(PORT, () => {
    console.log(`Server beží na porte ${PORT}`);
});
