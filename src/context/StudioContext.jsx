import React, { createContext, useContext, useState, useEffect } from 'react';
import storage, { KEYS } from '../services/storageService';
// import { DEFAULT_BRANDING, DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from '../data/defaults';
import { generateId } from '../utils/generateId';
import { safeParseBranding, safeParseCategories, safeParseProducts } from '../schemas';
import { getMenuByRestaurantId } from '../services/api';
import { useUser } from './UserContext';

const StudioContext = createContext();

// Dados padrão iniciais (fallback)
const DEFAULT_BRANDING = {
    restName: 'Menux Restaurante',
    restBio: 'Especialistas em gastronomia premium e experiências sensoriais.',
    restCover: '',
    restLogo: '/icon-menux.svg',
    // restLogo: 'https://img.freepik.com/premium-vector/chef-food-restaurant-logo_100659-548.jpg',
    brandColor: '#7A55FD'
};

const DEFAULT_CATEGORIES = [
    {
        id: 'pizzas',
        name: 'Pizzas',
        subcategories: [
            { id: 'monte-do-seu-jeito', name: 'Monte do seu jeito' }
        ]
    },
    {
        id: 'entradas',
        name: 'Entradas',
        subcategories: [
            { id: 'frias', name: 'Frias' },
            { id: 'quentes', name: 'Quentes' },
            { id: 'compartilhar', name: 'Para Compartilhar' }
        ]
    },
    {
        id: 'principais',
        name: 'Pratos Principais',
        subcategories: [
            { id: 'massas', name: 'Massas' },
            { id: 'carnes', name: 'Carnes' },
            { id: 'peixes', name: 'Peixes' }
        ]
    },
    {
        id: 'lanches',
        name: 'Lanches',
        subcategories: [
            { id: 'hamburgueres', name: 'Hambúrgueres' },
            { id: 'sanduiches', name: 'Sanduíches' },
            { id: 'acompanhamentos', name: 'Acompanhamentos' }
        ]
    },
    {
        id: 'sobremesas',
        name: 'Sobremesas',
        subcategories: [
            { id: 'classicas', name: 'Clássicas' },
            { id: 'quentes-doce', name: 'Quentes' },
            { id: 'gelados', name: 'Gelados' }
        ]
    },
    {
        id: 'bebidas',
        name: 'Bebidas & Drinks',
        subcategories: [
            { id: 'nao-alcoolicas', name: 'Não Alcoólicas' },
            { id: 'drinks-classicos', name: 'Drinks Clássicos' },
            { id: 'drinks-autorais', name: 'Drinks Autorais' }
        ]
    },
    {
        id: 'vinhos',
        name: 'Vinhos',
        subcategories: [
            { id: 'selecao-especial', name: 'Seleção Especial' }
        ]
    }
];

const DEFAULT_PRODUCTS = [
    // PIZZAS
    {
        id: 'pizza-custom',
        name: "Pizza Customizável",
        price: "R$ 49,90",
        desc: "Escolha sua massa, sabores, bordas e acompanhamentos.",
        categoryId: 'pizzas',
        subcategoryId: 'monte-do-seu-jeito',
        image: '/imgs/pratos-principais/pratop-picanha.jpg',
        type: 'pizza'
    },
    // ENTRADAS - Frias
    { id: 101, name: 'Carpaccio de Carne', price: 'R$ 48,00', desc: 'Fatias finas de carne bovina crua, parmesão, rúcula e azeite extravirgem.', categoryId: 'entradas', subcategoryId: 'frias', image: '/imgs/entrada/entrada-carpacio-de-carne.jpg' },
    { id: 105, name: 'Burrata com Tomate Confit', price: 'R$ 52,00', desc: 'Burrata cremosa servida com tomates confitados e pesto.', categoryId: 'entradas', subcategoryId: 'frias', image: '/imgs/entrada/entrada-burrata.jpg' },
    { id: 102, name: 'Ceviche de Peixe Branco', price: 'R$ 46,00', desc: 'Peixe marinado no limão, cebola roxa e coentro.', categoryId: 'entradas', subcategoryId: 'frias', image: '/imgs/entrada/entrada-ceviche.jpg' },
    // ENTRADAS - Quentes
    { id: 104, name: 'Camarão Empanado', price: 'R$ 56,00', desc: 'Camarões empanados crocantes com molho agridoce.', categoryId: 'entradas', subcategoryId: 'quentes', image: '/imgs/entrada/entrada-camarão.jpg' },
    { id: 106, name: 'Dadinho de Tapioca', price: 'R$ 38,00', desc: 'Cubos crocantes de tapioca com geleia de pimenta.', categoryId: 'entradas', subcategoryId: 'quentes', image: '/imgs/entrada/entrada-dadinho.jpg' },
    { id: 103, name: 'Bolinho de Costela', price: 'R$ 42,00', desc: 'Costela desfiada empanada com maionese defumada.', categoryId: 'entradas', subcategoryId: 'quentes', image: '/imgs/entrada/entrada-bolinho-costela.jpg' },
    // ENTRADAS - Compartilhar
    { id: 107, name: 'Tábua de Frios', price: 'R$ 78,00', desc: 'Queijos, embutidos, frutas secas e castanhas.', categoryId: 'entradas', subcategoryId: 'compartilhar', image: '/imgs/entrada/entrada-tabua.jpg' },
    { id: 108, name: 'Batata Rústica', price: 'R$ 34,00', desc: 'Batatas assadas com ervas e páprica.', categoryId: 'entradas', subcategoryId: 'compartilhar', image: '/imgs/entrada/entrada-batatas-rusticas.jpg' },
    { id: 109, name: 'Anéis de Cebola', price: 'R$ 32,00', desc: 'Cebolas empanadas crocantes com molho da casa.', categoryId: 'entradas', subcategoryId: 'compartilhar', image: '/imgs/entrada/entrada-cebolas.jpg' },

    // PRATOS PRINCIPAIS - Massas
    { id: 209, name: 'Spaghetti à Bolonhesa', price: 'R$ 62,00', desc: 'Massa italiana com molho de carne cozido lentamente.', categoryId: 'principais', subcategoryId: 'massas', image: '/imgs/pratos-principais/pratop-spaghetti.jpg' },
    { id: 210, name: 'Penne ao Molho Alfredo', price: 'R$ 58,00', desc: 'Massa curta com molho cremoso de queijo.', categoryId: 'principais', subcategoryId: 'massas', image: '/imgs/pratos-principais/pratop-penne.jpg' },
    { id: 212, name: 'Gnocchi ao Funghi', price: 'R$ 76,00', desc: 'Nhoque macio com cogumelos e creme.', categoryId: 'principais', subcategoryId: 'massas', image: '/imgs/pratos-principais/pratop-gnocchi.jpg' },
    // PRATOS PRINCIPAIS - Carnes
    { id: 201, name: 'Picanha na Brasa', price: 'R$ 96,00', desc: 'Picanha grelhada com farofa e vinagrete.', categoryId: 'principais', subcategoryId: 'carnes', image: '/imgs/pratos-principais/pratop-picanha.jpg' },
    { id: 203, name: 'Filé Mignon', price: 'R$ 88,00', desc: 'Filé grelhado ao ponto com molho de vinho tinto.', categoryId: 'principais', subcategoryId: 'carnes', image: '/imgs/pratos-principais/pratop-file-mignon.jpg' },
    { id: 202, name: 'Contra-filé', price: 'R$ 82,00', desc: 'Corte grelhado com manteiga de ervas.', categoryId: 'principais', subcategoryId: 'carnes', image: '/imgs/pratos-principais/pratop-contrafile.jpg' },
    // PRATOS PRINCIPAIS - Peixes
    { id: 207, name: 'Salmão Grelhado', price: 'R$ 82,00', desc: 'Salmão com legumes salteados e molho cítrico.', categoryId: 'principais', subcategoryId: 'peixes', image: '/imgs/pratos-principais/pratop-salmao.jpg' },
    { id: 208, name: 'Tilápia Grelhada', price: 'R$ 64,00', desc: 'Tilápia servida com arroz e legumes.', categoryId: 'principais', subcategoryId: 'peixes', image: '/imgs/pratos-principais/pratop-tilapia.jpg' },
    { id: 211, name: 'Atum Selado', price: 'R$ 86,00', desc: 'Atum selado com crosta de gergelim.', categoryId: 'principais', subcategoryId: 'peixes', image: '/imgs/pratos-principais/pratop-atum.jpg' },

    // LANCHES - Hamburgueres
    { id: 401, name: 'Hambúrguer Clássico', price: 'R$ 46,00', desc: 'Pão brioche, carne bovina, queijo e molho da casa.', categoryId: 'lanches', subcategoryId: 'hamburgueres', image: '/imgs/lanche/lanche-hamburger.jpg' },
    { id: 402, name: 'Cheeseburger Bacon', price: 'R$ 52,00', desc: 'Hambúrguer com cheddar e bacon crocante.', categoryId: 'lanches', subcategoryId: 'hamburgueres', image: '/imgs/lanche/lanche-burger-bacon.jpg' },
    { id: 403, name: 'Burger Duplo', price: 'R$ 58,00', desc: 'Dois discos de carne, queijo e pão brioche.', categoryId: 'lanches', subcategoryId: 'hamburgueres', image: '/imgs/lanche/lanche-burger-duplo.jpg' },
    // LANCHES - Sanduiches
    { id: 404, name: 'Frango Crispy', price: 'R$ 44,00', desc: 'Frango empanado, alface e maionese.', categoryId: 'lanches', subcategoryId: 'sanduiches', image: '/imgs/lanche/sanduiche-frango-crispy.jpg' },
    { id: 405, name: 'Sanduíche de Filé', price: 'R$ 49,00', desc: 'Filé grelhado com queijo e cebola caramelizada.', categoryId: 'lanches', subcategoryId: 'sanduiches', image: '/imgs/lanche/sanduiche-file.jpg' },
    { id: 406, name: 'Vegetariano', price: 'R$ 42,00', desc: 'Hambúrguer de grão-de-bico com legumes.', categoryId: 'lanches', subcategoryId: 'sanduiches', image: '/imgs/lanche/sanduiche-vegetariano.jpg' },
    // LANCHES - Acompanhamentos
    { id: 407, name: 'Batata Frita', price: 'R$ 26,00', desc: 'Batatas crocantes e douradas.', categoryId: 'lanches', subcategoryId: 'acompanhamentos', image: '/imgs/lanche/acomp-batata-frita.jpg' },
    { id: 408, name: 'Onion Rings', price: 'R$ 28,00', desc: 'Anéis de cebola empanados.', categoryId: 'lanches', subcategoryId: 'acompanhamentos', image: '/imgs/lanche/acomp-onion-rings.jpg' },
    { id: 409, name: 'Salada Verde', price: 'R$ 24,00', desc: 'Mix de folhas frescas.', categoryId: 'lanches', subcategoryId: 'acompanhamentos', image: '/imgs/lanche/acomp-salada-verde.jpg' },

    // SOBREMESAS - Classicas
    { id: 501, name: 'Pudim de Leite', price: 'R$ 24,00', desc: 'Pudim cremoso com calda de caramelo.', categoryId: 'sobremesas', subcategoryId: 'classicas', image: '/imgs/sobremesas/sobremesa-pudim.jpg' },
    { id: 502, name: 'Mousse de Chocolate', price: 'R$ 26,00', desc: 'Mousse aerado de chocolate meio amargo.', categoryId: 'sobremesas', subcategoryId: 'classicas', image: '/imgs/sobremesas/sobremesa-mosse-chocolate.jpg' },
    { id: 503, name: 'Torta de Limão', price: 'R$ 28,00', desc: 'Torta cremosa com merengue.', categoryId: 'sobremesas', subcategoryId: 'classicas', image: '/imgs/sobremesas/sobremesa-torta-limao.jpg' },
    // SOBREMESAS - Quentes
    { id: 504, name: 'Brownie com Sorvete', price: 'R$ 32,00', desc: 'Brownie quente com sorvete de creme.', categoryId: 'sobremesas', subcategoryId: 'quentes-doce', image: '/imgs/sobremesas/sobremesa-brownie-sorvete.jpg' },
    { id: 505, name: 'Petit Gâteau', price: 'R$ 34,00', desc: 'Bolinho de chocolate com recheio cremoso.', categoryId: 'sobremesas', subcategoryId: 'quentes-doce', image: '/imgs/sobremesas/sobremesa-petit-gateau.jpg' },
    { id: 506, name: 'Churros', price: 'R$ 30,00', desc: 'Churros crocantes com doce de leite.', categoryId: 'sobremesas', subcategoryId: 'quentes-doce', image: '/imgs/sobremesas/sobremesa-churros.jpg' },
    // SOBREMESAS - Geladas
    { id: 507, name: 'Sorvete Artesanal', price: 'R$ 22,00', desc: 'Duas bolas de sorvete artesanal.', categoryId: 'sobremesas', subcategoryId: 'gelados', image: '/imgs/sobremesas/sobremesa-sorvete-artesanal.jpg' },
    { id: 508, name: 'Taça de Frutas', price: 'R$ 20,00', desc: 'Frutas frescas da estação.', categoryId: 'sobremesas', subcategoryId: 'gelados', image: '/imgs/sobremesas/sobremesas-taça-frutas.jpg' },
    { id: 509, name: 'Milkshake', price: 'R$ 26,00', desc: 'Milkshake cremoso de chocolate ou baunilha.', categoryId: 'sobremesas', subcategoryId: 'gelados', image: '/imgs/sobremesas/sobremesa-milkshake.jpg' },

    // BEBIDAS & DRINKS - Nao Alcoolicas
    { id: 301, name: 'Suco Natural', price: 'R$ 12,00', desc: 'Suco de frutas da estação.', categoryId: 'bebidas', subcategoryId: 'nao-alcoolicas', image: '/imgs/bebidas-e-drinks/drink-suco-natural.jpg' },
    { id: 302, name: 'Refrigerante', price: 'R$ 8,00', desc: 'Refrigerante lata 350 ml.', categoryId: 'bebidas', subcategoryId: 'nao-alcoolicas', image: '/imgs/bebidas-e-drinks/drink-lata.jpg' },
    { id: 303, name: 'Água com Gás', price: 'R$ 6,00', desc: 'Água mineral com gás.', categoryId: 'bebidas', subcategoryId: 'nao-alcoolicas', image: '/imgs/bebidas-e-drinks/drinks-agua-gas.jpg' },
    // BEBIDAS & DRINKS - Drinks Classicos
    { id: 304, name: 'Caipirinha', price: 'R$ 22,00', desc: 'Limão, açúcar e cachaça artesanal.', categoryId: 'bebidas', subcategoryId: 'drinks-classicos', image: '/imgs/bebidas-e-drinks/drink-caipirinha.jpg' },
    { id: 305, name: 'Gin Tônica', price: 'R$ 28,00', desc: 'Gin, água tônica e especiarias.', categoryId: 'bebidas', subcategoryId: 'drinks-classicos', image: '/imgs/bebidas-e-drinks/drinks-gin-tonica.jpg' },
    { id: 306, name: 'Moscow Mule', price: 'R$ 32,00', desc: 'Vodka, gengibre e espuma cítrica.', categoryId: 'bebidas', subcategoryId: 'drinks-classicos', image: '/imgs/bebidas-e-drinks/drinks-moscow-mule.jpg' },
    // BEBIDAS & DRINKS - Drinks Autorais
    { id: 307, name: 'Drink da Casa', price: 'R$ 34,00', desc: 'Vodka, frutas vermelhas e manjericão.', categoryId: 'bebidas', subcategoryId: 'drinks-autorais', image: '/imgs/bebidas-e-drinks/drinks-da-casa.jpg' },
    { id: 308, name: 'Cítrico Tropical', price: 'R$ 30,00', desc: 'Rum, maracujá e limão siciliano.', categoryId: 'bebidas', subcategoryId: 'drinks-autorais', image: '/imgs/bebidas-e-drinks/drinks-citrico.jpg' },
    { id: 309, name: 'Negroni Brasileiro', price: 'R$ 36,00', desc: 'Cachaça envelhecida, vermute e bitter.', categoryId: 'bebidas', subcategoryId: 'drinks-autorais', image: '/imgs/bebidas-e-drinks/drinks-negroni.jpg' },

    // VINHOS
    {
        id: 999,
        name: "Don Simon Selección Tempranillo",
        desc: "Vinho tinto seco de corpo equilibrado e notas de frutas vermelhas.",
        price: "R$ 28,00",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop",
        type: 'wine',
        categoryId: 'vinhos',
        subcategoryId: 'selecao-especial',
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
        categoryId: 'vinhos',
        subcategoryId: 'selecao-especial',
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
];

export const StudioProvider = ({ children }) => {
    const { restaurantId } = useUser();
    const [branding, setBranding] = useState(() => {
        const saved = storage.getJSON(KEYS.STUDIO_BRANDING);
        const validated = saved ? safeParseBranding({ ...DEFAULT_BRANDING, ...saved }) : null;
        return validated || DEFAULT_BRANDING;
    });

    const [categories, setCategories] = useState(() => {
        const parsed = storage.getJSON(KEYS.STUDIO_CATEGORIES);
        const validated = safeParseCategories(parsed);
        if (validated && validated.length > 0) {
            return validated.map(cat => ({
                ...cat,
                name: cat.name === cat.name.toUpperCase()
                    ? cat.name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                    : cat.name
            }));
        }
        // Force resetCategories if flag is new
        if (!localStorage.getItem('menux_v4_pizza_update')) {
            return DEFAULT_CATEGORIES;
        }
        return DEFAULT_CATEGORIES;
    });

    const [products, setProducts] = useState(() => {
        // Force reset if migration flag missing
        const resetFlag = localStorage.getItem('menux_v4_pizza_update');

        if (!resetFlag) {
            console.log("Resetting to V4 (Pizza Update)...");
            localStorage.setItem('menux_v4_pizza_update', 'true');
            // Clear old data to be safe
            localStorage.removeItem('menux_studio_categories');
            localStorage.removeItem('menux_studio_products');
            return DEFAULT_PRODUCTS;
        }

        const parsed = storage.getJSON(KEYS.STUDIO_PRODUCTS);
        const validated = safeParseProducts(parsed);

        // Auto-fix: If saved data has old string ID '1' (Legacy), force reset to new defaults
        if (validated && validated.length > 0) {
            const hasLegacyIds = validated.some(p => p.id === '1' || p.id === 1);
            if (hasLegacyIds) {
                return DEFAULT_PRODUCTS;
            }
            return validated;
        }
        return DEFAULT_PRODUCTS;
    });

    // Salvar no localStorage sempre que mudar
    useEffect(() => {
        storage.set(KEYS.STUDIO_BRANDING, branding);
        document.documentElement.style.setProperty('--brand-primary', branding.brandColor);
    }, [branding]);

    useEffect(() => {
        storage.set(KEYS.STUDIO_CATEGORIES, categories);
    }, [categories]);

    useEffect(() => {
        storage.set(KEYS.STUDIO_PRODUCTS, products);
    }, [products]);
    // useEffect(() => {
    //     try {
    //         localStorage.setItem('menux_studio_products', JSON.stringify(products));
    //     } catch (error) {
    //         console.error("Erro ao salvar produtos:", error);
    //         if (error.name === 'QuotaExceededError') {
    //             alert("Limite de armazenamento excedido! Tente usar menos imagens ou imagens menores nos produtos.");
    //         }
    //     }
    // }, [products]);

    useEffect(() => {
        setProducts(prev => {
            const hasPizza = prev.find(p => p.id === 'pizza-custom');
            const hasWine = prev.find(p => p.id === 999);

            let current = prev;
            if (!hasPizza) {
                const pizzaProd = DEFAULT_PRODUCTS.find(p => p.id === 'pizza-custom');
                if (pizzaProd) current = [pizzaProd, ...current];
            }
            if (!hasWine) {
                const wineProd = DEFAULT_PRODUCTS.find(p => p.id === 999);
                const wineProd2 = DEFAULT_PRODUCTS.find(p => p.id === 1000);
                if (wineProd) current = [...current, wineProd, wineProd2];
            }
            return current;
        });

        //     setCategories(prev => {
        //         const hasPizza = prev.find(c => c.id === 'pizzas');
        //         const hasWine = prev.find(c => c.id === 'vinhos');

        //         let current = prev;
        //         if (!hasPizza) {
        //             const pizzaCat = DEFAULT_CATEGORIES.find(c => c.id === 'pizzas');
        //             if (pizzaCat) current = [pizzaCat, ...current];
        //         }
        //         if (!hasWine) {
        //             const wineCat = DEFAULT_CATEGORIES.find(c => c.id === 'vinhos');
        //             if (wineCat) current = [...current, wineCat];
        //         }
        //         return current;
        // // Force inject Pizza if missing (Robustness for Hot Reload)
        // useEffect(() => {
        setCategories(prev => {
            if (!prev.find(c => c.id === 'pizzas')) {
                const pizzaCat = DEFAULT_CATEGORIES.find(c => c.id === 'pizzas');
                if (pizzaCat) return [pizzaCat, ...prev];
            }
            return prev;
        });

        setProducts(prev => {
            if (!prev.find(p => p.id === 'pizza-custom')) {
                const pizzaProd = DEFAULT_PRODUCTS.find(p => p.id === 'pizza-custom');
                if (pizzaProd) return [pizzaProd, ...prev];
            }
            return prev;
        });
    }, []);

    useEffect(() => {
        setProducts(prev => {
            const hasPizza = prev.find(p => p.id === 'pizza-custom');
            const hasWine = prev.find(p => p.id === 999);

            let current = prev;
            if (!hasPizza) {
                const pizzaProd = DEFAULT_PRODUCTS.find(p => p.id === 'pizza-custom');
                if (pizzaProd) current = [pizzaProd, ...current];
            }
            if (!hasWine) {
                const wineProd = DEFAULT_PRODUCTS.find(p => p.id === 999);
                const wineProd2 = DEFAULT_PRODUCTS.find(p => p.id === 1000);
                if (wineProd) current = [...current, wineProd, wineProd2];
            }
            return current;
        });

        setCategories(prev => {
            const hasPizza = prev.find(c => c.id === 'pizzas');
            const hasWine = prev.find(c => c.id === 'vinhos');

            let current = prev;
            if (!hasPizza) {
                const pizzaCat = DEFAULT_CATEGORIES.find(c => c.id === 'pizzas');
                if (pizzaCat) current = [pizzaCat, ...current];
            }
            if (!hasWine) {
                const wineCat = DEFAULT_CATEGORIES.find(c => c.id === 'vinhos');
                if (wineCat) current = [...current, wineCat];
            }
            return current;
        });
    }, []);

    // Migration logic removed to prevent infinite loops and ID conflicts.
    // The data reset logic in useState initialization handles consistency now.
    // Lógica para corrigir imagens em dados antigos persistidos (Migration)
    // useEffect(() => {
    //     // Verifica se existem produtos com imagem vazia, caminho antigo de entrada, ou caminho antigo de bebidas com espaço
    //     const needsFix = products.some(p =>
    //         p.image === '' ||
    //         (p.image || '').includes('/imgs-entrada/') ||
    //         (p.image || '').includes('bebidas e drinks')
    //     );

    //     if (needsFix) {
    //         console.log("Migrando imagens dos produtos para o novo padrão (Entradas e Bebidas)...");
    //         const updatedProducts = products.map(p => {
    //             const defaultProd = DEFAULT_PRODUCTS.find(dp => dp.id === p.id);
    //             // Se encontrar o produto padrão e o atual estiver com problemas, atualiza
    //             if (defaultProd && (
    //                 p.image === '' ||
    //                 (p.image || '').includes('/imgs-entrada/') ||
    //                 (p.image || '').includes('bebidas e drinks')
    //             )) {
    //                 return { ...p, image: defaultProd.image };
    //             }
    //             return p;
    //         });
    //         setProducts(updatedProducts);
    //     }
    // }, [products]);

    // Fetch from API if not using Mock Auth
    useEffect(() => {
        const fetchMenu = async () => {
            if (import.meta.env.VITE_USE_MOCK_AUTH === 'false') {
                try {
                    // const restaurantId = import.meta.env.VITE_RESTAURANT_ID;
                    if (!restaurantId) {
                        // console.warn("VITE_RESTAURANT_ID not found in .env"); 
                        // Now we wait for restaurantId from context
                        return;
                    }

                    const response = await getMenuByRestaurantId(restaurantId);
                    const apiData = response.data || [];

                    const newCategories = [];
                    const newProducts = [];

                    apiData.forEach(cat => {
                        // Map Category
                        newCategories.push({
                            id: cat.id,
                            name: cat.name,
                            isVisible: cat.isVisible, // Map isVisible from API
                            subcategories: cat.subcategories ? cat.subcategories.map(sub => ({
                                id: sub.id,
                                name: sub.name
                            })) : []
                        });

                        // Map Items in Category (if any - usually none if it has subcategories, but logic allows)
                        if (cat.items && cat.items.length > 0) {
                            cat.items.forEach(item => {
                                newProducts.push({
                                    id: item.id,
                                    name: item.name,
                                    desc: item.description,
                                    price: `R$ ${Number(item.price).toFixed(2).replace('.', ',')}`,
                                    image: item.imageUrl,
                                    categoryId: cat.id,
                                    subcategoryId: null,
                                    // Include extended properties from API
                                    type: item.type,
                                    optionsConfig: item.optionsConfig,
                                    choiceItems: item.choiceItems
                                });
                            });
                        }

                        // Map Items in Subcategories
                        if (cat.subcategories) {
                            cat.subcategories.forEach(sub => {
                                if (sub.items) {
                                    sub.items.forEach(item => {
                                        newProducts.push({
                                            id: item.id,
                                            name: item.name,
                                            desc: item.description,
                                            price: `R$ ${Number(item.price).toFixed(2).replace('.', ',')}`,
                                            image: item.imageUrl,
                                            categoryId: cat.id,
                                            subcategoryId: sub.id,
                                            // Include extended properties from API
                                            type: item.type,
                                            optionsConfig: item.optionsConfig,
                                            choiceItems: item.choiceItems
                                        });
                                    });
                                }
                            });
                        }
                    });

                    if (newCategories.length > 0) setCategories(newCategories);
                    if (newProducts.length > 0) setProducts(newProducts);

                } catch (error) {
                    console.error("Error fetching menu from API:", error);
                }
            }
        };

        fetchMenu();
    }, [restaurantId]);

    const resetToDefault = () => {
        setBranding(DEFAULT_BRANDING);
        setCategories(DEFAULT_CATEGORIES);
        setProducts(DEFAULT_PRODUCTS);
        storage.remove(KEYS.STUDIO_BRANDING);
        storage.remove(KEYS.STUDIO_CATEGORIES);
        storage.remove(KEYS.STUDIO_PRODUCTS);
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
        setProducts([...products, { ...product, id: generateId() }]);
    };

    const updateBranding = (data) => {
        setBranding(prev => ({ ...prev, ...data }));
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
