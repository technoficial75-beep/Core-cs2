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
        // 1. Požiadavka na štatistiky (Killy, HS, atď.)
        const statsUrl = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${API_KEY}&steamid=${steamid}`;
        
        // 2. Požiadavka na čas v knižnici (Playtime)
        const libraryUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${steamid}&format=json&appids_filter[0]=730`;

        // Spustíme obe požiadavky naraz
        const [statsResponse, libraryResponse] = await Promise.all([
            axios.get(statsUrl).catch(() => ({ data: { playerstats: { stats: [] } } })),
            axios.get(libraryUrl).catch(() => ({ data: { response: { games: [] } } }))
        ]);

        // Vytiahneme minúty a prerobíme na hodiny
        const games = libraryResponse.data.response.games || [];
        const playtimeMinutes = games.length > 0 ? games[0].playtime_forever : 0;
        const realHours = Math.floor(playtimeMinutes / 60);

        // Pošleme všetko v jednom balíku
        res.json({
            playerstats: statsResponse.data.playerstats,
            real_playtime: realHours
        });

    } catch (error) {
        console.error("Chyba na serveri:", error);
        res.status(500).json({ error: "Chyba pri komunikácii so Steamom." });
    }
});

app.listen(PORT, () => {
    console.log(`Server beží na porte ${PORT}`);
});
