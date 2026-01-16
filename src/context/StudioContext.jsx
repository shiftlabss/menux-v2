import React, { createContext, useContext, useState, useEffect } from 'react';
import storage, { KEYS } from '../services/storageService';
import { DEFAULT_BRANDING, DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from '../data/defaults';
import { generateId } from '../utils/generateId';
import { safeParseBranding, safeParseCategories, safeParseProducts } from '../schemas';
import { getMenuByRestaurantId } from '../services/api';

const StudioContext = createContext();

export const StudioProvider = ({ children }) => {
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
        return DEFAULT_CATEGORIES;
    });

    const [products, setProducts] = useState(() => {
        // Force reset if migration flag missing
        const resetFlag = storage.get(KEYS.V4_MIGRATION);

        if (!resetFlag) {
            storage.set(KEYS.V4_MIGRATION, 'true');
            storage.remove(KEYS.STUDIO_CATEGORIES);
            storage.remove(KEYS.STUDIO_PRODUCTS);
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
    useEffect(() => {
        // Verifica se existem produtos com imagem vazia, caminho antigo de entrada, ou caminho antigo de bebidas com espaço
        const needsFix = products.some(p =>
            p.image === '' ||
            (p.image || '').includes('/imgs-entrada/') ||
            (p.image || '').includes('bebidas e drinks')
        );

        if (needsFix) {
            console.log("Migrando imagens dos produtos para o novo padrão (Entradas e Bebidas)...");
            const updatedProducts = products.map(p => {
                const defaultProd = DEFAULT_PRODUCTS.find(dp => dp.id === p.id);
                // Se encontrar o produto padrão e o atual estiver com problemas, atualiza
                if (defaultProd && (
                    p.image === '' ||
                    (p.image || '').includes('/imgs-entrada/') ||
                    (p.image || '').includes('bebidas e drinks')
                )) {
                    return { ...p, image: defaultProd.image };
                }
                return p;
            });
            setProducts(updatedProducts);
        }
    }, [products]);

    // Fetch from API if not using Mock Auth
    useEffect(() => {
        const fetchMenu = async () => {
            if (import.meta.env.VITE_USE_MOCK_AUTH === 'false') {
                try {
                    const restaurantId = import.meta.env.VITE_RESTAURANT_ID;
                    if (!restaurantId) {
                        console.warn("VITE_RESTAURANT_ID not found in .env");
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
                                    subcategoryId: null
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
                                            subcategoryId: sub.id
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
    }, []);

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
