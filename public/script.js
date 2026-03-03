async function loadStats() {
    const id = document.getElementById('steamInput').value;
    if (!id) return alert("Zadaj SteamID!");

    try {
        const res = await fetch(`/api/stats/${id}`);
        const data = await res.json();

        // Skontrolujeme, či máme aspoň nejaké dáta (buď štatistiky alebo čas)
        if (data.playerstats || data.real_playtime !== undefined) {
            
            // 1. Zobrazenie času (tých tvojich reálnych 32 hodín)
            const playtimeElement = document.getElementById('playtime');
            if (playtimeElement) {
                playtimeElement.innerText = (data.real_playtime || 0) + " hodín";
            }

            // 2. Zobrazenie štatistík (ak existujú)
            if (data.playerstats && data.playerstats.stats) {
                const stats = data.playerstats.stats;
                
                document.getElementById('wins').innerText = stats.find(s => s.name === 'total_wins')?.value || 0;
                document.getElementById('hs').innerText = stats.find(s => s.name === 'total_kills_headshot')?.value || 0;
                document.getElementById('kills').innerText = stats.find(s => s.name === 'total_kills')?.value || 0;
            }
        } else {
            alert("Dáta sa nenašli. Máš verejný profil?");
        }
    } catch (e) {
        console.error("Chyba pri načítaní:", e);
        alert("Server neodpovedá. Skontroluj, či ti beží Render.");
    }
}
