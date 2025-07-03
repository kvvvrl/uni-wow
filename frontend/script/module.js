document.addEventListener("DOMContentLoaded", function () {
    getData();
    const filterIcon = document.querySelector('.filter-icon');
    const filterMenu = document.querySelector('.filter-menu');
    const filterOptions = document.querySelectorAll('.filter-option');

    if (filterIcon && filterMenu) {
        filterIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            filterMenu.style.display = (filterMenu.style.display === "block") ? "none" : "block";
        });

        // Klick außerhalb schließt das Menü
        document.addEventListener('click', function(e) {
            if (!filterMenu.contains(e.target) && e.target !== filterIcon) {
                filterMenu.style.display = "none";
            }
        });
    }

    // Suche
    const search = document.getElementById('search');
    if (search) {
        search.addEventListener('input', function() {
            const suchbegriff = this.value.toLowerCase();
            const module = document.querySelectorAll('.modul-liste .modul-link');
            module.forEach(modulLink => {
                const text = modulLink.textContent.toLowerCase();
                modulLink.style.display = text.includes(suchbegriff) ? '' : 'none';
            });
        });
    }
    function getData() {
        ajaxGet("http://localhost:8000/api/modul/alle", (err, data) => {
            if (err) {
                console.log(err);
            } else {
                data = JSON.parse(data);

                // Sortierung: Module mit Note zuerst
                data.sort((a, b) => {
                    // Module mit Note (nicht null/leer) sollen zuerst stehen
                    const aHasNote = a.Note !== null && a.Note !== "" && !isNaN(parseFloat(a.Note));
                    const bHasNote = b.Note !== null && b.Note !== "" && !isNaN(parseFloat(b.Note));
                    return (aHasNote === bHasNote) ? 0 : aHasNote ? -1 : 1;
                });

                const liste = document.getElementById('modul-liste');
                const template = document.getElementById('modul-template');
                liste.innerHTML = '';

                for (let i = 0; i < data.length; i++) {
                    let modul = data[i];
                    const clone = template.content.cloneNode(true);
                    clone.querySelector('.modul-name').textContent = modul.Name;
                    clone.querySelector('.modul-beschreibung').textContent = modul.Inhalte;
                    clone.querySelector('.modul-link').href = `modul.html?id=${modul.id}`;

                    // Datenattribute für Filter setzen
                    if (parseFloat(modul.Note)) {
                        const modulSection = clone.querySelector('.modul');
                        if (modul.Note <= 4) {
                            clone.querySelector('.modul-link').dataset.bestanden = "true";
                            modulSection.classList.add('modul-bestanden');
                        } else {
                            clone.querySelector('.modul-link').dataset.bestanden = "false";
                            modulSection.classList.add('modul-durchfall');
                        }
                        modulSection.classList.remove('modul');
                    } else {
                        clone.querySelector('.modul-link').dataset.bestanden = "";
                    }

                    // Bewertung-Tag setzen
                    if (modul.Score && modul.Score !== "0") {
                        clone.querySelector('.modul-link').dataset.bewertung = "true";
                    } else {
                        clone.querySelector('.modul-link').dataset.bewertung = "false";
                    }

                    // Sterne setzen
                    const score = parseFloat(modul.Score);
                    const stars = clone.querySelectorAll('.modul-bewertung-value .fa');
                    setStarRating(score, stars);

                    liste.appendChild(clone);
                }
            }
        })
    }

    filterOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.dataset.filter; // z.B. "bestanden", "durchgefallen", "bewertet", "zuruecksetzen"
            const module = document.querySelectorAll('.modul-liste .modul-link');
            module.forEach(modulLink => {
                let show = true;
                if (filter === "bestanden") {
                    show = modulLink.dataset.bestanden === "true";
                } else if (filter === "durchgefallen") {
                    show = modulLink.dataset.bestanden === "false";
                } else if (filter === "bewertet") {
                    show = modulLink.dataset.bewertung === "true";
                } else if (filter === "zuruecksetzen") {
                    show = true;
                }
                modulLink.style.display = show ? '' : 'none';
            });
            filterMenu.style.display = "none";
        });
    });
});