document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('produto-form') || 
                 document.getElementById('fornecedor-form') || 
                 document.getElementById('estoque-form');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            let targetUrl = '';
            if (form.id === 'produto-form') {
                targetUrl = 'http://localhost:3322/produtos';
            } else if (form.id === 'fornecedor-form') {
                targetUrl = 'http://localhost:3322/fornecedores';
            } else if (form.id === 'estoque-form') {
                targetUrl = 'http://localhost:3322/inventario';
            }

            fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(result => {
                    console.log('Success:', result);
                    form.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    }

    window.onload = function () {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const currentDate = `${year}-${month}-${day}`;
        const dataCadastro = document.getElementById('data-cadastro');
        if (dataCadastro) {
            dataCadastro.value = currentDate;
        }
    };

    const codeInput = document.querySelector('.code-page');
    const formFields = document.querySelectorAll('#produto-form input, #produto-form select, #produto-form textarea');
    const apiUrl = 'http://localhost:3322/produtos';

    formFields.forEach(field => {
        field.disabled = true;
    });

    async function checkProductExists(id) {
        try {
            const response = await fetch(`${apiUrl}/${id}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else if (response.status === 404) {
                return null;
            } else {
                throw new Error(`Erro ao verificar o produto: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao conectar-se à API:', error);
            return null;
        }
    }

    codeInput.addEventListener('blur', async () => {
        const id = codeInput.value.trim();
        if (!id) {
            return;
        }
    
        const produto = await checkProductExists(id);
        if (produto) {
            alert('Produto já existe! Por favor, edite ou insira outro ID.');
        } else {
            alert('Produto não encontrado. Campo será limpo.');
            codeInput.value = '';
        }
    });

    const newButton = document.querySelector('.new-btn');

    if (newButton && codeInput) {
        newButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`${apiUrl}/ultimo`);
                if (!response.ok) {
                    throw new Error(`Erro ao buscar o último código: ${response.statusText}`);
                }

                const data = await response.json();
                if (data && data.ultimoCodigo) {
                    codeInput.value = data.ultimoCodigo;
                    codeInput.focus();
                } else {
                    alert('Nenhum produto encontrado no banco de dados.');
                }
            } catch (error) {
                console.error('Erro ao buscar o último código:', error);
                alert('Erro ao buscar o último código. Tente novamente.');
            }
        });
    }

});
