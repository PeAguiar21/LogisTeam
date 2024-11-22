document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.menu-icon');
    const nav = document.querySelector('nav');

    menuIcon.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    const form = document.getElementById('produto-form') || document.getElementById('fornecedor-form') || document.getElementById('estoque-form');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const targetUrl = 'https://webhook.site/76bef3db-5c1d-4581-8abd-95c235cc7e21';

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
                form.reset();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
    window.onload = function() {
        var today = new Date();
        var day = String(today.getDate()).padStart(2, '0');
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var year = today.getFullYear();
        var currentDate = year + '-' + month + '-' + day;
        document.getElementById('data-cadastro').value = currentDate;
    };
});
