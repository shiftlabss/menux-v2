/**
 * Dados estáticos do cardápio para exibição no MenuHub.
 * Serve como fallback quando não há dados customizados no Studio.
 */
export const MENU_DATA = [
    {
        id: 'entradas',
        name: 'Entradas',
        subcategories: [
            {
                name: 'Favoritos', items: [
                    { id: 101, name: "Carpaccio de Carne", desc: "Lâminas de filé mignon, molho de alcaparras, parmesão e rúcula fresca.", price: "R$ 44,90", image: "/imgs/entrada/entrada-carpacio-de-carne.jpg" },
                    { id: 102, name: "Ceviche Clássico", desc: "Peixe branco marinado no limão, cebola roxa e pimenta dedo de moça.", price: "R$ 42,90", image: "/imgs/entrada/entrada-ceviche.jpg" },
                    { id: 105, name: "Burrata Artesanal", desc: "Burrata cremosa, tomates cereja confitados e pesto de manjericão.", price: "R$ 58,00", image: "/imgs/entrada/entrada-burrata.jpg" },
                ]
            },
            {
                name: 'Quentes', items: [
                    { id: 103, name: "Bolinho de Costela", desc: "6 unidades de bolinhos crocantes de costela desfiada com cream cheese.", price: "R$ 38,00", image: "/imgs/entrada/entrada-bolinho-costela.jpg" },
                    { id: 104, name: "Camarão Empanado", desc: "Camarões empanados crocantes com molho agridoce.", price: "R$ 56,00", image: "/imgs/entrada/entrada-camarão.jpg" },
                    { id: 106, name: "Dadinho de Tapioca", desc: "Dadinhos de tapioca com queijo coalho servidos com geleia de pimenta.", price: "R$ 32,00", image: "/imgs/entrada/entrada-dadinho.jpg" },
                    { id: 107, name: "Tábua de Frios", desc: "Seleção de queijos e embutidos artesanais, acompanhados de pães e antepastos.", price: "R$ 89,00", image: "/imgs/entrada/entrada-tabua.jpg" },
                ]
            }
        ]
    },
    {
        id: 'saladas',
        name: 'Saladas',
        subcategories: [
            {
                name: 'Leves e Frescas', items: [
                    { id: 401, name: "Salada Caesar", desc: "Alface americana, croutons artesanais, molho caesar caseiro e lascas de grana padano.", price: "R$ 38,00", image: "/imgs/lanche/acomp-salada-verde.jpg" },
                    { id: 402, name: "Salada Verde", desc: "Mix de folhas verdes frescas, tomate cereja e molho especial da casa.", price: "R$ 28,00", image: "/imgs/lanche/acomp-salada-verde.jpg" },
                ]
            }
        ]
    },
    {
        id: 'pizzas',
        name: 'Pizzas',
        subcategories: [
            {
                name: 'Monte do seu jeito', items: [
                    {
                        id: 'pizza-custom',
                        name: "Pizza Customizável",
                        desc: "Escolha sua massa, sabores, bordas e acompanhamentos.",
                        price: "R$ 49,90",
                        image: "/imgs/pratos-principais/pratop-picanha.jpg",
                        type: 'pizza'
                    },
                ]
            }
        ]
    },
    {
        id: 'pratos-principais',
        name: 'Pratos Principais',
        subcategories: [
            {
                name: 'Carnes Bovinas',
                items: [
                    { id: 201, name: "Picanha Grelhada", desc: "Picanha bovina selecionada, grelhada no ponto da casa, finalizada com manteiga de ervas. Acompanha arroz branco, farofa e vinagrete.", price: "R$ 69,90", image: "/imgs/pratos-principais/pratop-picanha.jpg" },
                    { id: 202, name: "Contra Filé na Chapa", desc: "Contra filé bovino grelhado, preparado na chapa quente para preservar a suculência. Acompanha arroz temperado e batata frita.", price: "R$ 59,90", image: "/imgs/pratos-principais/pratop-contrafile.jpg" },
                    { id: 203, name: "Filé Mignon ao Molho Madeira", desc: "Filé mignon bovino macio, servido com molho madeira e champignons frescos. Acompanha purê de batatas e arroz branco.", price: "R$ 74,90", image: "/imgs/pratos-principais/pratop-file-mignon.jpg" },
                    { id: 204, name: "Costela Bovina Assada", desc: "Costela bovina assada lentamente por várias horas até atingir textura macia. Servida com mandioca cozida e vinagrete.", price: "R$ 79,90" },
                ]
            },
            {
                name: 'Aves',
                items: [
                    { id: 205, name: "Frango Grelhado com Legumes", desc: "Peito de frango grelhado, temperado com ervas naturais, acompanhado de legumes salteados.", price: "R$ 44,90" },
                    { id: 206, name: "Frango à Parmegiana", desc: "Filé de frango empanado, coberto com molho de tomate artesanal e queijo derretido. Acompanha arroz branco e batata frita.", price: "R$ 49,90" },
                ]
            },
            {
                name: 'Peixes',
                items: [
                    { id: 207, name: "Salmão Grelhado", desc: "Filé de salmão grelhado, finalizado com ervas frescas. Acompanha arroz com amêndoas e legumes no vapor.", price: "R$ 79,90", image: "/imgs/pratos-principais/pratop-salmao.jpg" },
                    { id: 208, name: "Tilápia Empanada", desc: "Filé de tilápia empanado e crocante, servido com arroz, feijão e salada da casa.", price: "R$ 46,90", image: "/imgs/pratos-principais/pratop-tilapia.jpg" },
                    { id: 211, name: "Atum Selado", desc: "Lombo de atum selado com crosta de gergelim, servido mal passado com molho teriyaki.", price: "R$ 82,90", image: "/imgs/pratos-principais/pratop-atum.jpg" }
                ]
            },
            {
                name: 'Massas',
                items: [
                    { id: 209, name: "Spaghetti à Bolonhesa", desc: "Massa spaghetti ao molho bolonhesa tradicional, preparada com carne bovina e tomate. Finalizada com queijo parmesão.", price: "R$ 39,90", image: "/imgs/pratos-principais/pratop-spaghetti.jpg" },
                    { id: 210, name: "Fettuccine Alfredo com Frango", desc: "Massa fettuccine ao molho cremoso à base de queijo, acompanhada de cubos de frango grelhado.", price: "R$ 45,90", image: "/imgs/pratos-principais/pratop-penne.jpg" },
                    { id: 212, name: "Gnochi ao Sugo", desc: "Massa fresca de batata com molho de tomate artesanal e manjericão fresco.", price: "R$ 42,00", image: "/imgs/pratos-principais/pratop-gnocchi.jpg" }
                ]
            }
        ]
    },
    {
        id: 'bebidas',
        name: 'Bebidas',
        subcategories: [
            {
                name: 'Sucos Naturais', items: [
                    { id: 301, name: "Suco Natural da Estação", desc: "Sucos preparados na hora com frutas frescas selecionadas.", price: "R$ 12,00", image: "/imgs/bebidas-e-drinks/drink-suco-natural.jpg" },
                    { id: 302, name: "Água com Gás", desc: "Água mineral com gás, servida gelada com ou sem rodela de limão.", price: "R$ 6,00", image: "/imgs/bebidas-e-drinks/drinks-agua-gas.jpg" }
                ]
            },
            {
                name: 'Drinks Autorais', items: [
                    { id: 303, name: "Caipirinha Clássica", desc: "A autêntica caipirinha brasileira com limão tahiti, cachaça artesanal e açúcar.", price: "R$ 24,00", image: "/imgs/bebidas-e-drinks/drink-caipirinha.jpg" },
                    { id: 304, name: "Moscow Mule", desc: "Vodka, xarope de gengibre, limão e espuma cítrica de gengibre.", price: "R$ 34,00", image: "/imgs/bebidas-e-drinks/drinks-moscow-mule.jpg" },
                    { id: 305, name: "Gin Tônica", desc: "Gin importado, água tônica premium, rodela de limão siciliano e alecrim.", price: "R$ 32,00", image: "/imgs/bebidas-e-drinks/drinks-gin-tonica.jpg" },
                    { id: 306, name: "Negroni", desc: "O clássico italiano com Gin, Vermouth Rosso e Campari em partes iguais.", price: "R$ 36,00", image: "/imgs/bebidas-e-drinks/drinks-negroni.jpg" }
                ]
            }
        ]
    },
    {
        id: 'sobremesas',
        name: 'Sobremesas',
        subcategories: [
            {
                name: 'Clássicas', items: [
                    { id: 501, name: "Pudim de Leite", desc: "Pudim de leite condensado tradicional, liso e cremoso, com calda de caramelo.", price: "R$ 18,00", image: "/imgs/sobremesas/sobremesa-pudim.jpg" },
                    { id: 502, name: "Torta de Limão", desc: "Massa crocante, recheio cremoso de limão e cobertura de merengue maçaricado.", price: "R$ 22,00", image: "/imgs/sobremesas/sobremesa-torta-limao.jpg" },
                    { id: 503, name: "Churros com Doce de Leite", desc: "Porção de mini churros crocantes passados no açúcar e canela, servidos com doce de leite.", price: "R$ 24,00", image: "/imgs/sobremesas/sobremesa-churros.jpg" }
                ]
            },
            {
                name: 'Doces Finos', items: [
                    { id: 504, name: "Petit Gateau", desc: "Bolo quente de chocolate com interior cremoso, servido com bola de sorvete de baunilha.", price: "R$ 28,00", image: "/imgs/sobremesas/sobremesa-petit-gateau.jpg" },
                    { id: 505, name: "Brownie com Sorvete", desc: "Brownie de chocolate meio amargo com nozes, servido quente com sorvete de creme.", price: "R$ 26,00", image: "/imgs/sobremesas/sobremesa-brownie-sorvete.jpg" },
                    { id: 506, name: "Mousse de Chocolate", desc: "Mousse aerada de chocolate belga 70% cacau, finalizada com raspas de chocolate.", price: "R$ 20,00", image: "/imgs/sobremesas/sobremesa-mosse-chocolate.jpg" }
                ]
            }
        ]
    },
    {
        id: 'vinhos',
        name: 'Vinhos',
        subcategories: [
            {
                name: 'Seleção Especial', items: [
                    {
                        id: 999,
                        name: "Don Simon Selección Tempranillo",
                        desc: "Vinho tinto seco de corpo equilibrado e notas de frutas vermelhas.",
                        price: "R$ 28,00",
                        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop",
                        type: 'wine',
                        country: 'Brasileiro',
                        countryFlag: 'https://flagcdn.com/w20/br.png',
                        year: '1982',
                        facts: {
                            vinicola: 'Marchesi Antinori',
                            uvas: 'Cabernet',
                            regiao: 'Toscana',
                            estilo: 'Tinto Encorpado'
                        }
                    },
                    {
                        id: 1000,
                        name: "Casillero del Diablo Reserva",
                        desc: "Cabernet Sauvignon chileno com aromas de cerejas pretas e toques de baunilha.",
                        price: "R$ 89,00",
                        image: "https://images.unsplash.com/photo-1553361371-9bb22026829b?q=80&w=1000&auto=format&fit=crop",
                        type: 'wine',
                        country: 'Chileno',
                        countryFlag: 'https://flagcdn.com/w20/cl.png',
                        year: '2021',
                        facts: {
                            vinicola: 'Concha y Toro',
                            uvas: 'Cabernet Sauvignon',
                            regiao: 'Vale Central',
                            estilo: 'Tinto Médio Corpo'
                        }
                    }
                ]
            }
        ]
    }
];
