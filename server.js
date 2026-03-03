// Trasa na získanie všetkých CS2 skinov z verejnej databázy
app.get('/api/cs-skins', async (req, res) => {
    try {
        // Toto API obsahuje mená, kolekcie aj min/max floaty pre všetky skiny
        const response = await axios.get('https://bymykel.github.io/CSGO-API/api/sk/skins.json');
        
        // Posielame len potrebné dáta, aby sme nepreťažili prehliadač
        const simplifiedSkins = response.data.map(skin => ({
            name: skin.name,
            image: skin.image,
            min_float: skin.min_float,
            max_float: skin.max_float,
            rarity: skin.rarity.name,
            collection: skin.collections ? skin.collections[0]?.name : "Neznáma"
        }));

        res.json(simplifiedSkins);
    } catch (error) {
        console.error("Chyba pri načítaní skinov:", error);
        res.status(500).json({ error: "Nepodarilo sa stiahnuť zoznam skinov." });
    }
});
