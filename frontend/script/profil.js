document.addEventListener("DOMContentLoaded", function(){
    getUser();
})

window.onload = function (){};

function getUser(){
    ajaxGet(`http://localhost:8000/api/user/profil`, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        data = JSON.parse(data);
        console.log(data);

        const form = document.getElementById('upper-form');
        const profil_upper_template = document.getElementById('profil-upper-template');
        const profil_upper = profil_upper_template.content.cloneNode(true);

        profil_upper.querySelector('.vname').value = data.user.Vorname;
        profil_upper.querySelector('.fname').value = data.user.Nachname;
        profil_upper.querySelector('.mnummer').value = data.user.Matnr;

        form.appendChild(profil_upper);

        const logoutLink = form.querySelector('#logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                sessionStorage.removeItem('JWT'); 
                window.location.href = 'index.html'; 
            });
        }

        const table = document.getElementById('noten-tabelle');
        const noten_zeile = document.getElementById('noten-zeile');

        for (let i = 0; i < data.grades.length; i++) {

            const zeile = noten_zeile.content.cloneNode(true);
            let grade = data.grades[i];

            zeile.querySelector('.modul-name').textContent = grade.Name
            zeile.querySelector('.modul-note').textContent = grade.Note
            zeile.querySelector('.modul-ects').textContent = grade.Credits

            table.appendChild(zeile);
        }

        document.getElementById('durchschnitt').textContent = parseFloat(data.avg_sum.Durchschnitt).toFixed(1);
        document.getElementById('credits').textContent = data.avg_sum.Creditsumme;
    });
}