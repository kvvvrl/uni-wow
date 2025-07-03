document.addEventListener("DOMContentLoaded", function(){
    loadComments();
    setInterval(loadComments, 5000);
});

function loadComments(id){
    ajaxGet('http://localhost:8000/api/bewertungen/alle', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        data = JSON.parse(data);
        if (!Array.isArray(data) || data.length === 0) return;
        // Drei zufällige Bewertungen auswählen
        const randoms = [];
        const copy = [...data];
        while (randoms.length < 3 && copy.length > 0) {
            const idx = Math.floor(Math.random() * copy.length);
            randoms.push(copy.splice(idx, 1)[0]);
        }
        const bewertungen = document.getElementById('container3');
        bewertungen.innerHTML = '';
        randoms.forEach((b, i) => {
            const farben = ['bewertung1', 'bewertung2', 'bewertung3'];
            const section = document.createElement('section');
            section.className = farben[i % farben.length];
            section.innerHTML = `
                <h1>Bewertung von ${b.Vorname ? b.Vorname : 'Unbekannt'}</h1>
                <p>${b.Inhalt}</p>
            `;
            bewertungen.appendChild(section);
        });
    });
}