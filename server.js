const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/api/stats/:steamid', async (req, res) => {
    const { steamid } = req.params;
    const API_KEY = process.env.STEAM_API_KEY;

    try {
        const statsUrl = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${API_KEY}&steamid=${steamid}`;
        const timeUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${steamid}&format=json&appids_filter[0]=730`;

        const [resStats, resTime] = await Promise.all([
            axios.get(statsUrl).catch(() => ({ data: { playerstats: { stats: [] } } })),
            axios.get(timeUrl).catch(() => ({ data: { response: { games: [] } } }))
        ]);

        const playtime = resTime.data.response.games?.[0]?.playtime_forever || 0;
        
        res.json({
            stats: resStats.data.playerstats.stats || [],
            hours: Math.floor(playtime / 60)
        });
    } catch (e) {
        res.status(500).json({ error: "Chyba" });
    }
});

app.listen(PORT, () => console.log(`Beží na ${PORT}`));
