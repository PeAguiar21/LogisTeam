document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('produto-form') || 
                 document.getElementById('fornecedor-form') || 
                 document.getElementById('estoque-form');

    const deleteButton = document.querySelector('.delete-btn');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = new FormData(event.target);

            const data = {
                id: document.getElementById('id').value,
                nome: formData.get('nome'),
                codigo: formData.get('codigo'),
                preco: parseFloat(formData.get('preco')),
                categoria: formData.get('categoria'),
                descricao: formData.get('descricao') || '',
                quantidade: parseInt(formData.get('quantidade')) || 0,
            };
        

            let targetUrl = '';
            let method = 'POST';

            if (form.id === 'produto-form') {
                if (!isNewRegister) {
                    targetUrl = `http://localhost:3322/produtos/${codeInput.value}`;
                    method = 'PUT';
                } else {
                    targetUrl = 'http://localhost:3322/produtos';
                }
            } else if (form.id === 'fornecedor-form') {
                targetUrl = 'http://localhost:3322/fornecedores';
            } else if (form.id === 'estoque-form') {
                targetUrl = 'http://localhost:3322/inventario';
            }

            try {
                const response = await fetch(targetUrl, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`Erro: ${response.statusText}`);
                }

                const result = await response.json();
                Toastify({
                    text: "Registro salvo com sucesso",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #006400, #007200",
                      },
                    stopOnFocus: true
                }).showToast();
            } catch (error) {
                console.error('Error:', error);
            }

        });

        deleteButton.addEventListener('click', async () => {
            const productId = document.querySelector('.code-page').value;

            if (!productId) {
                Toastify({
                    text: "Acrescente o código do registro que deseja excluir!",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ba181b, #e5383b",
                      },
                    stopOnFocus: true
                }).showToast();
                return;
            }

            let targetUrl = '';

            if (form.id === 'produto-form') {
                targetUrl = 'http://localhost:3322/produtos';
            } else if (form.id === 'fornecedor-form') {
                targetUrl = 'http://localhost:3322/fornecedores';
            } else if (form.id === 'estoque-form') {
                targetUrl = 'http://localhost:3322/inventario';
            }
    
            try {
                const response = await fetch(`${targetUrl}/${productId}`, {
                    method: 'DELETE',
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    Toastify({
                        text: "Registro excluído com sucesso",
                        duration: 3000,
                        close: true,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #006400, #007200",
                          },
                        stopOnFocus: true
                    }).showToast();
                    form.reset();
                    document.querySelector('.code-page').value = ''
                } else {
                    Toastify({
                        text: result.error || "Erro ao excluir o registro.",
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        style: {
                            background: "linear-gradient(to right, #ba181b, #e5383b",
                          },
                    }).showToast();
                }
            } catch (error) {
                console.error(error);
                Toastify({
                    text: "Erro ao conectar com o servidor.",
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    style: {
                        background: "linear-gradient(to right, #ba181b, #e5383b",
                      },
                }).showToast();
            }
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
    const nameInput = document.getElementById('nome');
    const formFields = document.querySelectorAll('#produto-form input, #produto-form select, #produto-form textarea');
    const apiUrl = 'http://localhost:3322/produtos';

    let isNewRegister = false

    formFields.forEach(field => {
        if (!field.classList.contains('field-disponivel')) { 
            field.disabled = true;
        }
    });

    function preencherCamposComProduto(produto) {
        if (produto) {
            document.getElementById('nome').value = produto.nome || '';
            document.getElementById('codigo').value = produto.codigoDeBarras || '';
            document.getElementById('preco').value = produto.preco || '';
            document.getElementById('categoria').value = produto.categoria || '';
            document.getElementById('quantidade').value = produto.quantidade || 0;
            document.getElementById('descricao').value = produto.descricaoTecnica || '';
        }
    }

    function limparCamposProdutos() {
        document.getElementById('nome').value =  '';
        document.getElementById('codigo').value =  '';
        document.getElementById('preco').value = '';
        document.getElementById('categoria').value = 'eletronicos';
        document.getElementById('quantidade').value = 0;
        document.getElementById('descricao').value = '';
    }

    async function checkProductExists(id) {
        try {
            const response = await fetch(`${apiUrl}/getProduto/${id}`);
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
            formFields.forEach(field => {
                if (!field.classList.contains('field-disponivel')) {
                    field.disabled = false;
                }
            });
            preencherCamposComProduto(produto);
            isNewRegister = false
        } else {
            Toastify({
                text: "Produto não encontrado, clicar no botão Novo!",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ba181b, #e5383b",
                  },
                stopOnFocus: true
            }).showToast();
            formFields.forEach(field => {
                if (!field.classList.contains('field-disponivel')) {
                    field.disabled = true;
                }
            });
            codeInput.value = '';
            limparCamposProdutos()
        }
    });

    const newButton = document.querySelector('.new-btn');

    if (newButton) {
        newButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`${apiUrl}/getProdutoUltimo`);
                if (!response.ok) {
                    throw new Error(`Erro ao buscar o último código: ${response.statusText}`);
                }

                const data = await response.json();
                if (data && data.ultimoCodigo) {
                    codeInput.value = data.ultimoCodigo;

                    if (nameInput) {
                        nameInput.focus();
                    }

                    
                    formFields.forEach(field => {
                        if (!field.classList.contains('field-disponivel')) {
                            field.disabled = false;
                        }
                    });

                    isNewRegister = true

                    limparCamposProdutos()
                }
            } catch (error) {
                console.error('Erro ao buscar o último código:', error);
            }
        });
    }
});
