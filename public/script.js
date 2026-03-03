async function loadStats() {
    const id = document.getElementById('steamInput').value;
    if (!id) return alert("Zadaj SteamID!");

    try {
        const res = await fetch(`/api/stats/${id}`);
        const data = await res.json();

        if (data.playerstats && data.playerstats.stats) {
            const stats = data.playerstats.stats;
            
            document.getElementById('wins').innerText = stats.find(s => s.name === 'total_wins')?.value || 0;
            document.getElementById('hs').innerText = stats.find(s => s.name === 'total_kills_headshot')?.value || 0;
            document.getElementById('kills').innerText = stats.find(s => s.name === 'total_kills')?.value || 0;
        } else {
            alert("Dáta sa nenašli. Máš verejný profil?");
        }
    } catch (e) {
        console.error(e);
    }
}
