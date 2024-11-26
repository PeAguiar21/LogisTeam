document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('produto-form') || 
                 document.getElementById('fornecedor-form') || 
                 document.getElementById('estoque-form');


    let apiUrl = ''
    let getRegistro = ''

    const deleteButton = document.querySelector('.delete-btn');

    let tipoOperacao = '';

    function setTipoOperacao(tipo) {
        tipoOperacao = tipo;
        calcularNovaQuantidade();
    }


    if (form) {
        if (form.id === 'produto-form') {
            apiUrl = 'http://localhost:3322/produtos';
            getRegistro = 'getProduto'
        } else if (form.id === 'fornecedor-form') {
            apiUrl = 'http://localhost:3322/fornecedores';
            getRegistro = 'getFornecedor'
        } else if (form.id === 'estoque-form') {
            apiUrl = 'http://localhost:3322/inventario';
            getRegistro = 'getEstoque'
            setTipoOperacao('entrada');
        }
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = new FormData(event.target);
            
            let data = {}
            let targetUrl = '';
            let method = 'POST';

            console.log(formData)

            if (form.id === 'produto-form') {
                if (!isNewRegister) {
                    targetUrl = `http://localhost:3322/produtos/${codeInput.value}`;
                    method = 'PUT';
                } else {
                    targetUrl = 'http://localhost:3322/produtos';
                }
                data = {
                    id: document.getElementById('id').value,
                    nome: formData.get('nome'),
                    codigo: formData.get('codigo'),
                    preco: parseFloat(formData.get('preco')),
                    categoria: formData.get('categoria'),
                    descricao: formData.get('descricao') || '',
                    quantidade: parseInt(formData.get('quantidade')) || 0,
                };
            } else if (form.id === 'fornecedor-form') {
                if (!isNewRegister) {
                    targetUrl = `http://localhost:3322/fornecedores/${codeInput.value}`;
                    method = 'PUT';
                } else {
                    targetUrl = 'http://localhost:3322/fornecedores';
                }
                data = {
                    id: document.getElementById('id').value,
                    nome: formData.get('nome'),
                    cpf_cnpj: formData.get('cpfcnpj'),
                    dataCadastro: document.getElementById('data-cadastro').value,
                    contato: formData.get('contato')
                };
            } else if (form.id === 'estoque-form') {
                if (!isNewRegister) {
                    targetUrl = `http://localhost:3322/inventario/${codeInput.value}`;
                    method = 'PUT';
                } else {
                    targetUrl = 'http://localhost:3322/inventario';
                }
                data = {
                    id: document.getElementById('id').value,
                    produtoNome: formData.get('produto'),
                    fornecedorNome: formData.get('fornecedor'),
                    quantidade: formData.get('quantidade'),
                    tipo: tipoOperacao === `entrada` ? 1 : 0
                };
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
    const formFields = document.querySelectorAll('#produto-form input, #produto-form select, #produto-form textarea,#fornecedor-form input, #fornecedor-form select, #fornecedor-form textarea,#estoque-form input, #estoque-form select, #estoque-form textarea, #estoque-form button ');

    let isNewRegister = false

    formFields.forEach(field => {
        if (!field.classList.contains('field-disponivel') || !field.classList.contains('data-cadastro') || !field.classList.contains('quantidade-atual') || !field.classList.contains('nova-quantidade')) { 
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

    function preencherCamposComFornecedor(fornecedor) {
        if (fornecedor) {
            document.getElementById('nome').value = fornecedor.nome || '';
            document.getElementById('cpfcnpj').value = fornecedor.cpf_cnpj || '';
            document.getElementById('data-cadastro').value = fornecedor.dataCadastro;
            document.getElementById('contato').value = fornecedor.contato || '';
        }
    }

    function limparCamposFornecedores() {
        document.getElementById('nome').value =  '';
        document.getElementById('cpfcnpj').value =  '';
        document.getElementById('contato').value = '';
    }

    function preencherCamposComInventario(inventario) {
        if (inventario) {
            document.getElementById('produto').value = inventario.produtoNome || '';
            document.getElementById('fornecedor').value = inventario.fornecedorNome || '';
            document.getElementById('quantidade').value = inventario.quantidade || 0;

            console.log(inventario.tipo)
            if (inventario.tipo === 1) {
                setTipoOperacao('entrada')
            } else {
                setTipoOperacao('saida')
            }
        }
    }

    function limparCamposInventario() {
        document.getElementById('produto').value = '';
        document.getElementById('fornecedor').value = '';
        document.getElementById('quantidade').value =  '';
        document.getElementById('nova-quantidade').value =  '';
        document.getElementById('quantidade-atual').value = '';
    }

    async function checkRegistro(id) {
        try {
            const response = await fetch(`${apiUrl}/${getRegistro}/${id}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else if (response.status === 404) {
                return null;
            } else {
                throw new Error(`Erro ao verificar o registro: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao conectar-se à API:', error);
            return null;
        }
    }

    codeInput?.addEventListener('blur', async () => {
        const id = Number(codeInput.value.trim());

        if (!id) {
            Toastify({
                text: "Por favor, insira um valor válido!",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ba181b, #e5383b",
                },
                stopOnFocus: true
            }).showToast();
            codeInput.value = '';
            return;
        }
        if (getRegistro === 'getProduto') {
            const produto = await checkRegistro(id);
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
        } else if (getRegistro === 'getFornecedor') {
            const Fornecedor = await checkRegistro(id);
            if (Fornecedor) {
                formFields.forEach(field => {
                    if (!field.classList.contains('data-cadastro')) {
                        field.disabled = false;
                    }
                });
                preencherCamposComFornecedor(Fornecedor);
                isNewRegister = false
            } else {
                Toastify({
                    text: "Fornecedor não encontrado, clicar no botão Novo!",
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
                    if (!field.classList.contains('data-cadastro')) {
                        field.disabled = true;
                    }
                });
                codeInput.value = '';
                limparCamposFornecedores()
            }
        } else {
            const Inventario = await checkRegistro(id);
            if (Inventario) {
                formFields.forEach(field => {
                    if (!field.classList.contains('quantidade-atual') && 
                    !field.classList.contains('nova-quantidade')) {
                    field.disabled = true;
                }
                });
                preencherCamposComInventario(Inventario);
                isNewRegister = false
            } else {
                Toastify({
                    text: "Inventario não encontrado, clicar no botão Novo!",
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
                    if (!field.classList.contains('quantidade-atual') && 
                    !field.classList.contains('nova-quantidade')) {
                    field.disabled = true;
                }
                });
                codeInput.value = '';
                limparCamposInventario()
            }
        }
    });

    const newButton = document.querySelector('.new-btn');

    if (newButton) {
        newButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`${apiUrl}/getUltimoRegistro`);
                if (!response.ok) {
                    throw new Error(`Erro ao buscar o último código: ${response.statusText}`);
                }

                const data = await response.json();
                if (data && data.ultimoCodigo) {
                    codeInput.value = data.ultimoCodigo;

                    if (nameInput) {
                        nameInput.focus();
                    }


                    isNewRegister = true

                    if (getRegistro === 'getProduto') {
                        limparCamposProdutos()
                        formFields.forEach(field => {
                            if (!field.classList.contains('field-disponivel')) {
                                field.disabled = false;
                            }
                        });
                    } else if (getRegistro === 'getFornecedor') {
                        limparCamposFornecedores()
                        formFields.forEach(field => {
                            if (!field.classList.contains('data-cadastro')) {
                                field.disabled = false;
                            }
                        });
                    } else if (getRegistro === 'getEstoque') {
                        limparCamposInventario()
                        formFields.forEach(field => {
                            if (!field.classList.contains('quantidade-atual') && 
                            !field.classList.contains('nova-quantidade')) {
                            field.disabled = false;
                        }
                        });
                    }
                    
                }
            } catch (error) {
                console.error('Erro ao buscar o último código:', error);
            }
        });
    }

    const productList = document.querySelector('.product-list');
    const supplierList = document.querySelector('.supplier-list');

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3322/produtos');
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos.');
            }
            const products = await response.json();
            productList.innerHTML = '';

            if (products.length === 0) {
                const noRecordsMessage = document.createElement('li');
                noRecordsMessage.textContent = 'Nenhum produto cadastrado.';
                noRecordsMessage.style.fontStyle = 'italic';
                noRecordsMessage.style.color = 'gray';
                productList.appendChild(noRecordsMessage);
            } else {
                products.forEach(product => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <img class="img-home" src="./images/Product.svg" alt="">
                        ${product.id}: ${product.nome} - ${product.quantidade}
                    `;
                    productList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error('Erro:', error.message);
        }
    };

    const fetchFornecedores = async () => {
        try {
            const response = await fetch('http://localhost:3322/fornecedores');
            if (!response.ok) {
                throw new Error('Erro ao buscar fornecedores.');
            }
            const suppliers = await response.json();

            supplierList.innerHTML = '';

            if (suppliers.length === 0) {
                const noRecordsMessage = document.createElement('li');
                noRecordsMessage.textContent = 'Nenhum fornecedor cadastrado.';
                noRecordsMessage.style.fontStyle = 'italic';
                noRecordsMessage.style.color = 'gray';
                supplierList.appendChild(noRecordsMessage);
            } else {
                suppliers.forEach(supplier => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <img class="img-home" src="./images/Supplier.svg" alt="">
                        ${supplier.id}: ${supplier.nome}
                    `;
                    supplierList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error('Erro:', error.message);
        }
    };

    if (!getRegistro) {
        fetchProducts();
        fetchFornecedores();
    }

    function toggleButtons(activeButton, inactiveButton) {
        activeButton.classList.add('active-btn');
        activeButton.classList.remove('inactive-btn');

        inactiveButton.classList.add('inactive-btn');
        inactiveButton.classList.remove('active-btn');
    }

    if (getRegistro === 'getEstoque') {

        const entradaBtn = document.getElementById('enter-btn');
        const saidaBtn = document.getElementById('saida-btn');

        
        carregarDadosSelectProduto();
        carregarDadosSelectFornecedor();

        const produtoSelect = document.getElementById('produto');
        const fornecedorSelect = document.getElementById('fornecedor');
    
        let dadosProdutos = [];
    
        entradaBtn.addEventListener('click', (event) => {
            event.preventDefault();
            toggleButtons(entradaBtn, saidaBtn);
            setTipoOperacao('entrada')
            calcularNovaQuantidade();
        });
    
        saidaBtn.addEventListener('click', (event) => {
            event.preventDefault();
            toggleButtons(saidaBtn, entradaBtn);
            setTipoOperacao('saida')
            calcularNovaQuantidade();
        });
    
        async function carregarDadosSelectProduto() {
            try {
                const response = await fetch('http://localhost:3322/produtos');
                const dados = await response.json();
    
                dadosProdutos = dados;
    
                produtoSelect.innerHTML = '';

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = '-- Selecione um produto --';
                produtoSelect.appendChild(defaultOption);

                dados.forEach(produto => {
                    const option = document.createElement('option');
                    option.value = produto.nome;
                    option.textContent = produto.nome;
                    produtoSelect.appendChild(option);
                });
    
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            }
        }
    
        async function carregarDadosSelectFornecedor() {
            try {
                const response = await fetch('http://localhost:3322/fornecedores');
                const dados = await response.json();
    
                fornecedorSelect.innerHTML = '';
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = '-- Selecione um fornecedor --';
                fornecedorSelect.appendChild(defaultOption);
                dados.forEach(fornecedor => {
                    const option = document.createElement('option');
                    option.value = fornecedor.nome;
                    option.textContent = fornecedor.nome;
                    fornecedorSelect.appendChild(option);
                });
    
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            }
        }
    
        function exibirQuantidadeAtual() {
            const produtoSelecionado = produtoSelect.value;
            const produto = dadosProdutos.find(p => p.nome === produtoSelecionado);
        
            if (produto) {
                document.getElementById('quantidade-atual').value = produto.quantidade || 0;
                document.getElementById('nova-quantidade').value = '';
            }

            calcularNovaQuantidade()
        }
    
    
        produtoSelect.addEventListener('change', exibirQuantidadeAtual);
        document.getElementById('quantidade').addEventListener('input', calcularNovaQuantidade)
    }

    function calcularNovaQuantidade() {
        const quantidadeAtual = parseInt(document.getElementById('quantidade-atual').value);
        const quantidadeInserida = parseInt(document.getElementById('quantidade').value);
        let novaQuantidade;
    
        if (!quantidadeInserida || isNaN(quantidadeInserida)) {
            novaQuantidade = 0
        }; 
    
        
    
        if (tipoOperacao === 'entrada') {
            novaQuantidade = quantidadeAtual + quantidadeInserida;
        } else if (tipoOperacao === 'saida') {
            if (quantidadeInserida > quantidadeAtual) {
                Toastify({
                    text: "Estoque insuficiente para a saída!",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ba181b, #e5383b",
                      },
                    stopOnFocus: true
                }).showToast();
                document.getElementById('nova-quantidade').value = quantidadeAtual;
                document.getElementById('quantidade').value = 0;
                return;
            }
            novaQuantidade = quantidadeAtual - quantidadeInserida;
        }
    
        document.getElementById('nova-quantidade').value = novaQuantidade;
    }

});
