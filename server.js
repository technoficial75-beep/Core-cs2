async function getStats() {
    const steamId = document.getElementById('steamIdInput').value;
    const resultDiv = document.getElementById('result'); // Tvoj div na zobrazenie výsledkov

    try {
        const response = await fetch(`/api/stats/${steamId}`);
        const data = await response.json();

        if (data.playerstats && data.playerstats.stats) {
            const stats = data.playerstats.stats;

            // Pomocná funkcia na nájdenie konkrétnej štatistiky podľa mena
            const findStat = (name) => {
                const stat = stats.find(s => s.name === name);
                return stat ? stat.value : 0;
            };

            // Vytiahneme konkrétne dáta
            const kills = findStat('total_kills');
            const deaths = findStat('total_deaths');
            const hs = findStat('total_sum_headshots');
            const wins = findStat('total_wins');
            const matches = findStat('total_matches_played');

            // Výpočet KD Ratio
            const kd = (kills / (deaths || 1)).toFixed(2);

            // Vložíme to do HTML
            resultDiv.innerHTML = `
                <div class="stat-box">
                    <p>Zabitia: <span>${kills}</span></p>
                    <p>Úmrtia: <span>${deaths}</span></p>
                    <p>K/D Ratio: <span>${kd}</span></p>
                    <p>Headshoty: <span>${hs}</span></p>
                    <p>Vyhrané zápasy: <span>${wins}</span></p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = "<p>Dáta sa nenašli. Máš profil nastavený na Public?</p>";
        }
    } catch (error) {
        console.error("Chyba:", error);
        resultDiv.innerHTML = "<p>Server neodpovedá.</p>";
    }
}
