document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('produto-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });


        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = 'https://webhook.site/874df208-a3be-41d9-b1c2-fd5b8668a3ce';

        fetch(proxyUrl + targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(result => {
            console.log('Success:', result);
            alert('Produto cadastrado com sucesso!');
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Erro ao cadastrar o produto.');
        });
    });
});

function toggleMenu() {
    const navMenu = document.querySelector('nav');
    navMenu.classList.toggle('active');
}
