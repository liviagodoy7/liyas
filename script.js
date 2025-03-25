// Variáveis globais
let totalProdutos = 0;
let frete = 0;
let carrinho = [];

// Tabela de frete baseada na região
const fretesPorRegiao = {
    "Norte": 80,
    "Nordeste": 60,
    "Sul": 30,
    "Sudeste": 40,
    "Centro-Oeste": 50
};

// Função para calcular o total de produtos e o valor total
function calcularTotal() {
    const total = totalProdutos + frete;
    document.getElementById("totalProdutos").textContent = totalProdutos.toFixed(2);
    document.getElementById("totalFrete").textContent = frete.toFixed(2);
    document.getElementById("totalGeral").textContent = total.toFixed(2);
}

// Função para atualizar a lista de itens no carrinho
function atualizarCarrinho() {
    const itensCarrinho = document.getElementById("itensCarrinho");
    itensCarrinho.innerHTML = '';

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `<p>${item.nome} - R$ ${item.preco}</p><button onclick="removerItem(${item.id})">Remover</button>`;
        itensCarrinho.appendChild(div);
    });

    // Atualiza o total de produtos
    totalProdutos = carrinho.reduce((total, item) => total + item.preco, 0);
    calcularTotal();
}

// Função para adicionar um item ao carrinho
document.querySelectorAll(".adicionar").forEach((botao, index) => {
    botao.addEventListener("click", () => {
        const nomeProduto = botao.parentElement.querySelector(".descricao").textContent;
        const precoProduto = parseFloat(botao.parentElement.dataset.preco);

        carrinho.push({
            id: carrinho.length + 1,
            nome: nomeProduto,
            preco: precoProduto
        });

        atualizarCarrinho();
        document.getElementById("finalizarCompra").disabled = false; // Ativa o botão de finalizar compra
    });
});

// Função para remover um item do carrinho
function removerItem(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarCarrinho();
}

// Função para calcular o frete ao pesquisar o CEP
const pesquisarCep = async () => {
    const cep = document.getElementById("cep").value;
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    if (cep.length === 8) {
        try {
            const dados = await fetch(url);
            const endereco = await dados.json();
            if (!endereco.erro) {
                const regiao = endereco.regiao;
                frete = fretesPorRegiao[regiao] || 0;
                document.getElementById("regiao").value = regiao;
                calcularTotal();
            } else {
                alert("CEP inválido!");
            }
        } catch (error) {
            console.error("Erro ao buscar o CEP:", error);
        }
    } else {
        alert("CEP inválido! Digite 8 números.");
    }
};

// Evento para buscar o CEP ao perder o foco do campo
document.getElementById("cep").addEventListener("focusout", pesquisarCep);

// Seleciona todos os elementos com a classe 'produto'
const produtos = document.querySelectorAll('.produto');

produtos.forEach(produto => {
    const precoTexto = produto.querySelector('.preco').innerText; // Obtém o texto do preço
    const precoDolar = parseFloat(precoTexto); // Converte para número (float)

    // Função para obter o valor do dólar em relação ao real
    fetch(`https://economia.awesomeapi.com.br/last/USD-BRL`)
        .then(resposta => resposta.json())
        .then(economia => {
            const cotacaoDoDolar = economia.USDBRL.bid; // Obter a cotação do dólar

            const valorReal = precoDolar * cotacaoDoDolar; // Convertendo para reais
            produto.querySelector('.precoReal').innerHTML = `R$ ${valorReal.toFixed(2)}`; // Atualizar no HTML

            produto.querySelector('.preco').innerHTML = `$ ${precoDolar.toFixed(2)}`; // Atualizar no HTML para mostrar o preço em dólar
        });
});
