window.addEventListener("scroll", function () {
    const navbar = document.querySelector("nav"); //get nach tag
    const scrollPosition = window.scrollY; //scroll position    

    const maxScroll = 500;

    let opacity = 1 - Math.min(scrollPosition / maxScroll, 1); // Reduziert die Transparenz schrittweise

    // Setze die Hintergrundfarbe der Navbar mit der berechneten Transparenz
    navbar.style.backgroundColor = `rgba(54, 54, 54, ${opacity})`;
    //Wenn gewisse Transparenz das ist soll die bleiben
    if(opacity < 0.6){
            navbar.style.backgroundColor = `rgba(0, 0, 0, 0.6)`;
    }
});