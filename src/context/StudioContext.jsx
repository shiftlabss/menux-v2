import React, { createContext, useContext, useState, useEffect } from 'react';

const StudioContext = createContext();

// Dados padrão iniciais (fallback)
const DEFAULT_BRANDING = {
    restName: 'Menux Restaurante',
    restBio: 'Especialistas em gastronomia premium e experiências sensoriais.',
    restCover: '',
    restLogo: '/icon-menux.svg',
    brandColor: '#7A55FD'
};

const DEFAULT_CATEGORIES = [
    {
        id: 'entradas',
        name: 'ENTRADAS',
        subcategories: [
            { id: 'frias', name: 'Frias' },
            { id: 'quentes', name: 'Quentes' },
            { id: 'compartilhar', name: 'Para Compartilhar' }
        ]
    },
    {
        id: 'principais',
        name: 'PRATOS PRINCIPAIS',
        subcategories: [
            { id: 'massas', name: 'Massas' },
            { id: 'carnes', name: 'Carnes' },
            { id: 'peixes', name: 'Peixes' }
        ]
    },
    {
        id: 'lanches',
        name: 'LANCHES',
        subcategories: [
            { id: 'hamburgueres', name: 'Hambúrgueres' },
            { id: 'sanduiches', name: 'Sanduíches' },
            { id: 'acompanhamentos', name: 'Acompanhamentos' }
        ]
    },
    {
        id: 'sobremesas',
        name: 'SOBREMESAS',
        subcategories: [
            { id: 'classicas', name: 'Clássicas' },
            { id: 'quentes-doce', name: 'Quentes' },
            { id: 'gelados', name: 'Gelados' }
        ]
    },
    {
        id: 'bebidas',
        name: 'BEBIDAS & DRINKS',
        subcategories: [
            { id: 'nao-alcoolicas', name: 'Não Alcoólicas' },
            { id: 'drinks-classicos', name: 'Drinks Clássicos' },
            { id: 'drinks-autorais', name: 'Drinks Autorais' }
        ]
    }
];

const DEFAULT_PRODUCTS = [
    // ENTRADAS - Frias
    { id: '1', name: 'Carpaccio de Carne', price: 'R$ 48,00', desc: 'Fatias finas de carne bovina crua marmorizada, finalizadas com lascas de parmesão, rúcula fresca e fios de azeite extravirgem.', categoryId: 'entradas', subcategoryId: 'frias', image: '' },
    { id: '2', name: 'Burrata com Tomate Confit', price: 'R$ 52,00', desc: 'Burrata extremamente cremosa acompanhada de tomates cereja confitados no azeite de ervas e finalizada com pesto de manjericão artesanal.', categoryId: 'entradas', subcategoryId: 'frias', image: '' },
    { id: '3', name: 'Ceviche de Peixe Branco', price: 'R$ 46,00', desc: 'Peixe branco fresco marinado em leite de tigre cítrico, cebola roxa crocante, coentro e um toque de pimenta dedo-de-moça.', categoryId: 'entradas', subcategoryId: 'frias', image: '' },
    // ENTRADAS - Quentes
    { id: '4', name: 'Camarão Empanado', price: 'R$ 56,00', desc: 'Camarões selecionados empanados em farinha panko ultra crocante, servidos com nosso exclusivo molho agridoce da casa.', categoryId: 'entradas', subcategoryId: 'quentes', image: '' },
    { id: '5', name: 'Dadinho de Tapioca', price: 'R$ 38,00', desc: 'Cubos crocantes de tapioca com queijo coalho, fritos até dourarem, acompanhados de geleia de pimenta levemente picante.', categoryId: 'entradas', subcategoryId: 'quentes', image: '' },
    { id: '6', name: 'Bolinho de Costela', price: 'R$ 42,00', desc: 'Bolinhos recheados com costela bovina desfiada e suculenta, empanados e servidos com maionese defumada artesanal.', categoryId: 'entradas', subcategoryId: 'quentes', image: '' },
    // ENTRADAS - Compartilhar
    { id: '7', name: 'Tábua de Frios', price: 'R$ 78,00', desc: 'Seleção premium de queijos finos, embutidos artesanais, frutas secas da estação, castanhas crocantes e torradas da casa.', categoryId: 'entradas', subcategoryId: 'compartilhar', image: '' },
    { id: '8', name: 'Batata Rústica', price: 'R$ 34,00', desc: 'Batatas cortadas à mão, assadas com dentes de alho inteiros, alecrim fresco e uma pitada de páprica defumada especial.', categoryId: 'entradas', subcategoryId: 'compartilhar', image: '' },
    { id: '9', name: 'Anéis de Cebola', price: 'R$ 32,00', desc: 'Anéis de cebola selecionados, empanados em massa leve e crocante, servidos com molho especial de ervas finas.', categoryId: 'entradas', subcategoryId: 'compartilhar', image: '' },

    // PRINCIPAIS - Massas
    { id: '10', name: 'Spaghetti à Bolonhesa', price: 'R$ 62,00', desc: 'Massa al dente envolvida em um robusto molho de carne bovina e tomates pelados, cozido lentamente por 6 horas.', categoryId: 'principais', subcategoryId: 'massas', image: '' },
    { id: '11', name: 'Penne ao Molho Alfredo', price: 'R$ 58,00', desc: 'Penne grano duro mergulhado em um molho aveludado de creme de leite fresco, manteiga noisette e parmesão envelhecido.', categoryId: 'principais', subcategoryId: 'massas', image: '' },
    { id: '12', name: 'Nhoque de Cogumelos', price: 'R$ 76,00', desc: 'Nhoque artesanal de batata salteado na manteiga de sálvia com mix de cogumelos frescos e finalizado com creme de trufas negras.', categoryId: 'principais', subcategoryId: 'massas', image: '' },
    // PRINCIPAIS - Carnes
    { id: '13', name: 'Picanha na Brasa', price: 'R$ 96,00', desc: 'Corte nobre de picanha grelhado na brasa de carvão, servido com farofa crocante de ovos e vinagrete de tomatinhos coloridos.', categoryId: 'principais', subcategoryId: 'carnes', image: '' },
    { id: '14', name: 'Filé Mignon', price: 'R$ 88,00', desc: 'Medalhão de filé mignon grelhado ao ponto do chef, banhado em redução de vinho tinto Malbec e especiarias selecionadas.', categoryId: 'principais', subcategoryId: 'carnes', image: '' },
    { id: '15', name: 'Contra-filé', price: 'R$ 82,00', desc: 'Corte alto de contra-filé angus grelhado com manteiga de ervas da horta, servido com alho assado e batatas douradas.', categoryId: 'principais', subcategoryId: 'carnes', image: '' },
    // PRINCIPAIS - Peixes
    { id: '16', name: 'Salmão Grelhado', price: 'R$ 82,00', desc: 'Posta de salmão fresco selada na chapa, acompanhada de legumes da estação salteados e molho cítrico de limão siciliano.', categoryId: 'principais', subcategoryId: 'peixes', image: '' },
    { id: '17', name: 'Tilápia Grelhada', price: 'R$ 64,00', desc: 'Filé de tilápia leve e suculento, servido com arroz branco soltinho e mix de legumes cozidos no vapor.', categoryId: 'principais', subcategoryId: 'peixes', image: '' },
    { id: '18', name: 'Atum Selado', price: 'R$ 86,00', desc: 'Lombo de atum fresco selado em crosta de gergelim preto e branco, servido mal passado com redução de balsâmico e mel.', categoryId: 'principais', subcategoryId: 'peixes', image: '' },

    // LANCHES - Hamburgueres
    { id: '19', name: 'Hambúrguer Clássico', price: 'R$ 46,00', desc: 'Hambúrguer artesanal de 180g no pão brioche amanteigado, queijo prato derretido, alface crespa e nosso molho secreto.', categoryId: 'lanches', subcategoryId: 'hamburgueres', image: '' },
    { id: '20', name: 'Cheeseburger Bacon', price: 'R$ 52,00', desc: 'Blend de carnes selecionadas com muito cheddar cremoso, fatias de bacon crocante e cebola roxa no pão australiano.', categoryId: 'lanches', subcategoryId: 'hamburgueres', image: '' },
    { id: '21', name: 'Burger Duplo', price: 'R$ 58,00', desc: 'Para os famintos: dois discos de 160g de carne angus, camadas duplas de queijo cheddar e bacon no pão brioche.', categoryId: 'lanches', subcategoryId: 'hamburgueres', image: '' },
    // LANCHES - Sanduiches
    { id: '22', name: 'Frango Crispy', price: 'R$ 44,00', desc: 'Peito de frango empanado em crosta crocante, servido com alface americana fresca e maionese de ervas finas no pão de batata.', categoryId: 'lanches', subcategoryId: 'sanduiches', image: '' },
    { id: '23', name: 'Sanduíche de Filé', price: 'R$ 49,00', desc: 'Iscas de filé mignon grelhadas com queijo gruyère derretido e cebolas caramelizadas lentamente no vinho do porto.', categoryId: 'lanches', subcategoryId: 'sanduiches', image: '' },
    { id: '24', name: 'Vegetariano', price: 'R$ 42,00', desc: 'Hambúrguer artesanal de grão-de-bico com especiarias, servido com abobrinha grelhada e homus cremoso no pão integral.', categoryId: 'lanches', subcategoryId: 'sanduiches', image: '' },
    // LANCHES - Acompanhamentos
    { id: '25', name: 'Batata Frita', price: 'R$ 26,00', desc: 'Porção generosa de batatas palito ultra crocantes e perfeitamente douradas, finalizadas com flor de sal.', categoryId: 'lanches', subcategoryId: 'acompanhamentos', image: '' },
    { id: '26', name: 'Onion Rings', price: 'R$ 28,00', desc: 'Anéis de cebola artesanais empanados em massa de cerveja pilsen, fritos até a perfeição, acompanhados de barbecue original.', categoryId: 'lanches', subcategoryId: 'acompanhamentos', image: '' },
    { id: '27', name: 'Salada Verde', price: 'R$ 24,00', desc: 'Mix refrescante de folhas jovens da horta, tomatinhos cereja, pepino japonês e croutons integrais com molho de mostarda e mel.', categoryId: 'lanches', subcategoryId: 'acompanhamentos', image: '' },

    // SOBREMESAS - Classicas
    { id: '28', name: 'Pudim de Leite', price: 'R$ 24,00', desc: 'O clássico pudim de leite condensado, extremamente liso e cremoso, banhado em calda de caramelo dourado artesanal.', categoryId: 'sobremesas', subcategoryId: 'classicas', image: '' },
    { id: '29', name: 'Mousse de Chocolate', price: 'R$ 26,00', desc: 'Mousse aerado preparado com chocolate belga 54%, finalizado com raspas de chocolate amargo e flor de sal.', categoryId: 'sobremesas', subcategoryId: 'classicas', image: '' },
    { id: '30', name: 'Torta de Limão', price: 'R$ 28,00', desc: 'Massa sablée crocante recheada com creme aveludado de limão taiti e coberta com merengue suíço maçaricado.', categoryId: 'sobremesas', subcategoryId: 'classicas', image: '' },
    // SOBREMESAS - Quentes
    { id: '31', name: 'Brownie com Sorvete', price: 'R$ 32,00', desc: 'Brownie intenso de chocolate meio amargo servido quente, acompanhado de uma bola de sorvete de baunilha bourbon.', categoryId: 'sobremesas', subcategoryId: 'quentes-doce', image: '' },
    { id: '32', name: 'Petit Gâteau', price: 'R$ 34,00', desc: 'Bolinho quente de chocolate com o coração derretido, servido com sorvete de creme e calda de frutas vermelhas.', categoryId: 'sobremesas', subcategoryId: 'quentes-doce', image: '' },
    { id: '33', name: 'Churros', price: 'R$ 30,00', desc: 'Mini churros crocantes polvilhados com açúcar e canela, servidos com uma generosa porção de doce de leite mineiro.', categoryId: 'sobremesas', subcategoryId: 'quentes-doce', image: '' },
    // SOBREMESAS - Gelados
    { id: '34', name: 'Sorvete Artesanal', price: 'R$ 22,00', desc: 'Duas bolas generosas de sorvete artesanal de fabricação própria, à sua escolha entre os sabores da estação.', categoryId: 'sobremesas', subcategoryId: 'gelados', image: '' },
    { id: '35', name: 'Taça de Frutas', price: 'R$ 20,00', desc: 'Seleção refrescante de frutas da estação laminadas, servidas com mel de flores silvestres e raspas de limão siciliano.', categoryId: 'sobremesas', subcategoryId: 'gelados', image: '' },
    { id: '36', name: 'Milkshake', price: 'R$ 26,00', desc: 'Milkshake ultra cremoso batido na hora com sorvete premium, disponível nos sabores Chocolate Belga ou Baunilha Bourbon.', categoryId: 'sobremesas', subcategoryId: 'gelados', image: '' },

    // BEBIDAS & DRINKS - Nao Alcoolicas
    { id: '37', name: 'Suco Natural', price: 'R$ 12,00', desc: 'Suco extraído na hora da própria fruta fresca, garantindo o máximo de sabor e vitaminas. Consulte as frutas do dia.', categoryId: 'bebidas', subcategoryId: 'nao-alcoolicas', image: '' },
    { id: '38', name: 'Refrigerante', price: 'R$ 8,00', desc: 'Opções variadas de refrigerantes em lata de 350ml, servidos geladíssimos para sua maior refrescância.', categoryId: 'bebidas', subcategoryId: 'nao-alcoolicas', image: '' },
    { id: '39', name: 'Água com Gás', price: 'R$ 6,00', desc: 'Água mineral captada diretamente da fonte com gás natural, servida com uma rodela de limão e pedras de gelo.', categoryId: 'bebidas', subcategoryId: 'nao-alcoolicas', image: '' },
    // BEBIDAS & DRINKS - Drinks Classicos
    { id: '40', name: 'Caipirinha', price: 'R$ 22,00', desc: 'A estrela brasileira: limão taiti macerado com açúcar orgânico e cachaça artesanal envelhecida em tonéis de madeira.', categoryId: 'bebidas', subcategoryId: 'drinks-classicos', image: '' },
    { id: '41', name: 'Gin Tônica', price: 'R$ 28,00', desc: 'Gin premium combinado com tônica botânica selecionada, infusão de especiarias e uma rodela de limão siciliano.', categoryId: 'bebidas', subcategoryId: 'drinks-classicos', image: '' },
    { id: '42', name: 'Moscow Mule', price: 'R$ 32,00', desc: 'Cocktail refrescante à base de vodka premium, suco de limão e finalizado com nossa famosa espuma artesanal de gengibre.', categoryId: 'bebidas', subcategoryId: 'drinks-classicos', image: '' },
    // BEBIDAS & DRINKS - Drinks Autorais
    { id: '43', name: 'Drink da Casa', price: 'R$ 34,00', desc: 'Criação autoral do nosso mixologista: vodka, purê de frutas vermelhas frescas e folhas de manjericão maceradas.', categoryId: 'bebidas', subcategoryId: 'drinks-autorais', image: '' },
    { id: '44', name: 'Cítrico Tropical', price: 'R$ 30,00', desc: 'Uma viagem aos trópicos: rum envelhecido, polpa de maracujá fresco e um toque vibrante de limão siciliano.', categoryId: 'bebidas', subcategoryId: 'drinks-autorais', image: '' },
    { id: '45', name: 'Negroni Brasileiro', price: 'R$ 36,00', desc: 'Nossa versão do clássico: cachaça de alambique selecionada, vermute tinto italiano e bitter de ervas selecionadas.', categoryId: 'bebidas', subcategoryId: 'drinks-autorais', image: '' }
];

export const StudioProvider = ({ children }) => {
    const [branding, setBranding] = useState(() => {
        const saved = localStorage.getItem('menux_studio_branding');
        return saved ? { ...DEFAULT_BRANDING, ...JSON.parse(saved) } : DEFAULT_BRANDING;
    });

    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('menux_studio_categories');
        const parsed = saved ? JSON.parse(saved) : null;
        return (parsed && parsed.length > 0) ? parsed : DEFAULT_CATEGORIES;
    });

    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('menux_studio_products');
        const parsed = saved ? JSON.parse(saved) : null;
        return (parsed && parsed.length > 0) ? parsed : DEFAULT_PRODUCTS;
    });

    // Salvar no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('menux_studio_branding', JSON.stringify(branding));
        document.documentElement.style.setProperty('--brand-primary', branding.brandColor);
    }, [branding]);

    useEffect(() => {
        localStorage.setItem('menux_studio_categories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('menux_studio_products', JSON.stringify(products));
    }, [products]);

    const resetToDefault = () => {
        setBranding(DEFAULT_BRANDING);
        setCategories(DEFAULT_CATEGORIES);
        setProducts(DEFAULT_PRODUCTS);
        localStorage.removeItem('menux_studio_branding');
        localStorage.removeItem('menux_studio_categories');
        localStorage.removeItem('menux_studio_products');
        alert("Dados redefinidos com sucesso!");
    };

    const addCategory = (name) => {
        const id = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
        setCategories([...categories, { id, name, subcategories: [] }]);
    };

    const addSubcategory = (categoryId, subName) => {
        setCategories(categories.map(cat => {
            if (cat.id === categoryId) {
                const subId = subName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
                const newSub = { id: subId, name: subName };
                return { ...cat, subcategories: [...(cat.subcategories || []), newSub] };
            }
            return cat;
        }));
    };

    const addProduct = (product) => {
        setProducts([...products, { ...product, id: Date.now() }]);
    };

    const updateBranding = (data) => {
        setBranding({ ...data });
    };

    return (
        <StudioContext.Provider value={{
            branding,
            categories,
            products,
            addCategory,
            addSubcategory,
            addProduct,
            updateBranding,
            resetToDefault,
            setCategories,
            setProducts
        }}>
            {children}
        </StudioContext.Provider>
    );
};

export const useStudio = () => useContext(StudioContext);
