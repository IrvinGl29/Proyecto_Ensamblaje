// Manejo del menú desplegable en dispositivos móviles
document.querySelector('.hamburger').addEventListener('click', () => {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('open');  // Alterna la clase para mostrar/ocultar el menú
});
