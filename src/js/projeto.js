document.querySelector(".project-footer button")
.addEventListener("click", () => {
    alert("Solicitação enviada para participar do projeto!");
});

document.querySelectorAll('.project-image').forEach(img => {

    img.onerror = () => {
        img.style.display = 'none';

        const placeholder =
            img.parentElement.querySelector('.project-placeholder');

        placeholder.style.display = 'flex';
    };

});