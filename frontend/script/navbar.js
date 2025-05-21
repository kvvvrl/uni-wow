window.addEventListener("scroll", function () {
    const navbar = document.querySelector("nav"); // select nav element
    const scrollPosition = window.scrollY; //scroll position   
    
    const navbara = document.querySelectorAll("nav a");

    const maxScroll = 500;

    let opacity = 1 - Math.min(scrollPosition / maxScroll, 1); // Reduziert die Transparenz schrittweise

    opacity = Math.max(opacity,0.6);


    // Setze die Hintergrundfarbe der Navbar mit der berechneten Transparenz
    navbar.style.backgroundColor = `rgba(54, 54, 54, ${opacity})`;
    navbara.forEach(element => {
        element.style.color = `rgba(255, 255, 255, ${opacity})`;
    });
});