import { motion } from 'framer-motion';
import { useState } from 'react';
import '../styles/ProductPizzaModal.css';
import './ProductPizzaModal.css';



export default function ProductPizzaModal({ product, onClose, onAddToCart }) {
    // Parse optionsConfig if it's a JSON string
    let customConfig = null;
    try {
        if (typeof product.optionsConfig === 'string') {
            customConfig = JSON.parse(product.optionsConfig);
        } else {
            customConfig = product.optionsConfig;
        }
    } catch (e) {
        console.error("Error parsing optionsConfig", e);
    }

    // Check if we are using the new dynamic config or legacy fixed structure
    const isDynamicConfig = Array.isArray(customConfig);

    // LEGACY SETUP
    const doughOptions = !isDynamicConfig ? (customConfig?.doughs || []) : [];

    const flavorOptions = !isDynamicConfig ? (customConfig?.flavors || []) : [];

    const crustOptions = !isDynamicConfig ? (customConfig?.crusts || []) : [];

    const otherOptions = !isDynamicConfig ? (customConfig?.others || []) : [];

    // DYNAMIC SETUP
    let sortedGroups = isDynamicConfig
        ? [...customConfig].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        : [];

    // Process choiceItems if present
    // Process choiceItems if present
    if (product.choiceItems && product.choiceItems.length > 0) {
        // Group choiceItems by category
        const choiceGroups = {};

        product.choiceItems.forEach(choice => {
            const targetItem = choice.choosenMenuItem || {};
            const category = targetItem.category || {};
            const catId = category.id || 'extras';

            if (!choiceGroups[catId]) {
                const isOptional = category.isOptional === true;
                choiceGroups[catId] = {
                    id: `choice_group_${catId}`,
                    name: category.name || 'Extras',
                    // If optional, min is 0. If not optional, assume mandatory (1) unless minChoices is set.
                    min_selected: isOptional ? 0 : (category.minChoices || 1),
                    max_selected: category.maxChoices || 99,
                    sort_order: category.order || 999,
                    price_rule: category.priceRule || 'SUM',
                    options: []
                };
            }

            choiceGroups[catId].options.push({
                id: choice.id,
                choosenMenuItemId: targetItem.id, // Store the linked MenuItem ID
                name: targetItem.name || choice.name || 'Opção',
                description: targetItem.description || choice.description,
                extra_price: choice.extra_price || 0,
                price: choice.price // maintain original price field just in case
            });
        });

        const choiceGroupsArray = Object.values(choiceGroups).sort((a, b) => a.sort_order - b.sort_order);

        // Merge with existing groups (append choice items after optionsConfig)
        sortedGroups = [...sortedGroups, ...choiceGroupsArray];
        // Ensure dynamic config flag is true if we have choiceItems
        if (choiceGroupsArray.length > 0) {
            // Force dynamic layout
            // Note: We can't easily change the const isDynamicConfig defined above, 
            // but we can use a new check in the render.
            // Actually, the render uses isDynamicConfig check. 
            // Let's rely on sortedGroups being non-empty and update the render condition condition slightly or just assume if choices exist -> dynamic.
        }
    }

    // Evaluate if we should force dynamic mode (if not already set by config but we have choice items)
    const renderDynamic = isDynamicConfig || (product.choiceItems && product.choiceItems.length > 0);

    const [observation, setObservation] = useState('');

    // Legacy State
    const [selections, setSelections] = useState({
        dough: doughOptions[0]?.id || 'tradicional',
        quantity: 1,
        flavors: [],
        crust: null,
        others: []
    });

    const doughOptions = [
        { id: 'tradicional', name: 'Tradicional', price: 0 },
        { id: 'fina', name: 'Massa Fina', price: 0 },
        { id: 'integral', name: 'Massa integral', desc: 'Massa feita com farinha integral, mais leve e nutritiva.', price: 4.00 }
    ];
    // Dynamic State
    const [dynamicSelections, setDynamicSelections] = useState({});

    const getPriceVal = (P) => {
        if (!P) return 0;
        if (typeof P === 'number') return P;
        if (typeof P === 'string') {
            return parseFloat(P.replace(/[^\d,]/g, '').replace(',', '.'));
        }
        return 0;
    };

    const formatPrice = (p) => {
        const val = getPriceVal(p);
        return val > 0 ? `+ R$ ${val.toFixed(2).replace('.', ',')}` : '';
    };

    // LEGACY HANDLERS
    const toggleFlavor = (id) => {
        setSelections(prev => {
            const current = prev.flavors;
            if (current.includes(id)) {
                return { ...prev, flavors: current.filter(x => x !== id) };
            }
            if (current.length >= pd_flavorLimit) return prev;
            return { ...prev, flavors: [...current, id] };
        });
    };
    const pd_flavorLimit = selections.quantity; // 1 or 2

    const toggleOther = (id) => {
        setSelections(prev => {
            const current = prev.others;
            if (current.includes(id)) {
                return { ...prev, others: current.filter(x => x !== id) };
            }
            return { ...prev, others: [...current, id] };
        });
    };

    // DYNAMIC HANDLERS
    const handleDynamicSelection = (groupId, optionId, maxSelected, isMultiple) => {
        setDynamicSelections(prev => {
            const currentGroup = prev[groupId] || [];

            // Toggle Logic
            if (currentGroup.includes(optionId)) {
                return { ...prev, [groupId]: currentGroup.filter(id => id !== optionId) };
            }

            // Check Max
            if (maxSelected === 1 && !isMultiple) {
                // Radio behavior: replace
                return { ...prev, [groupId]: [optionId] };
            }

            if (currentGroup.length < maxSelected) {
                return { ...prev, [groupId]: [...currentGroup, optionId] };
            }

            // If max reached, maybe replace last? Or just block. Standard is block or replace.
            // Let's replace the first one if max is 1, otherwise block.
            if (maxSelected === 1) {
                return { ...prev, [groupId]: [optionId] };
            }

            return prev;
        });
    };

    const calculateTotal = () => {
        const base = getPriceVal(product.price);

        if (renderDynamic) {
            let totalExtras = 0;
            sortedGroups.forEach(group => {
                const selectedIds = dynamicSelections[group.id] || [];
                if (selectedIds.length === 0) return;

                const groupPrices = selectedIds.map(optId => {
                    const opt = group.options.find(o => o.id === optId);
                    // Use extra_price if available, fallback to price, ensure number
                    const val = Number(opt.extra_price || opt.price || 0);
                    return val;
                });

                const rule = group.price_rule || 'SUM';

                switch (rule) {
                    case 'AVERAGE':
                        if (groupPrices.length > 0) {
                            const sum = groupPrices.reduce((a, b) => a + b, 0);
                            totalExtras += sum / groupPrices.length;
                        }
                        break;
                    case 'HIGHEST':
                        if (groupPrices.length > 0) {
                            totalExtras += Math.max(...groupPrices);
                        }
                        break;
                    case 'NONE':
                        // Do nothing, add 0
                        break;
                    case 'SUM':
                    default:
                        totalExtras += groupPrices.reduce((a, b) => a + b, 0);
                        break;
                }
            });
            return base + totalExtras;
        }

        // Legacy Calc
        const doughP = getPriceVal(doughOptions.find(d => d.id === selections.dough)?.price);
        const flavorsP = selections.flavors.reduce((acc, id) => acc + getPriceVal(flavorOptions.find(f => f.id === id)?.price), 0);
        const crustP = getPriceVal(crustOptions.find(c => c.id === selections.crust)?.price);
        const othersP = selections.others.reduce((acc, id) => acc + getPriceVal(otherOptions.find(o => o.id === id)?.price), 0);
        return base + doughP + flavorsP + crustP + othersP;
    };

    const canAdd = () => {
        if (renderDynamic) {
            // Check Min Selected for all groups
            return sortedGroups.every(group => {
                // If min_selected is 0, it's always valid
                if ((group.min_selected || 0) === 0) return true;

                const selectedCount = (dynamicSelections[group.id] || []).length;
                return selectedCount >= (group.min_selected || 0);
            });
        }
        // Legacy Check
        return selections.dough && selections.flavors.filter(Boolean).length === selections.quantity && selections.crust;
    };

    const handleAddToCartAction = () => {
        if (renderDynamic) {
            const details = [];
            const composition = []; // New composition array for order payload

            sortedGroups.forEach(group => {
                const selectedIds = dynamicSelections[group.id] || [];
                if (selectedIds.length > 0) {
                    const names = selectedIds.map(optId => {
                        const opt = group.options.find(o => o.id === optId);

                        // Build composition item for each selected option
                        composition.push({
                            menuItemId: opt.choosenMenuItemId || opt.id, // Use choosenMenuItemId if available
                            groupKey: group.name,
                            quantity: 1,
                            name: opt.name,
                            priceRule: group.price_rule || 'SUM',
                            extraPrice: Number(opt.extra_price || 0)
                        });

                        return opt.name;
                    }).join(', ');
                    details.push(`${group.name}: ${names}`);
                }
            });
            if (observation) details.push(`Obs: ${observation}`);

            const total = calculateTotal();
            const formattedPrice = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            // Pass composition array along with product
            onAddToCart({ ...product, price: formattedPrice, composition }, details.join('\n'), 1);
        } else {
            // Legacy Add
            const doughName = doughOptions.find(d => d.id === selections.dough)?.name || 'Massa Padrão';
            const flavorNames = selections.flavors.map(id => flavorOptions.find(f => f.id === id)?.name).join(' / ');
            const crustName = crustOptions.find(c => c.id === selections.crust)?.name;
            const othersNames = selections.others.map(id => otherOptions.find(o => o.id === id)?.name).join(', ');

            const details = [
                doughName.startsWith('Massa') ? doughName : `Massa ${doughName}`,
                flavorNames,
                (crustName && crustName !== 'Sem Borda') ? `Borda ${crustName}` : (crustName === 'Sem Borda' ? crustName : null),
                othersNames,
                observation ? `Obs: ${observation}` : null
            ].filter(Boolean).join('\n');

            const total = calculateTotal();
            const formattedPrice = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            onAddToCart({ ...product, price: formattedPrice }, details, 1);
        }
        onClose();
    };

    const canAdd = selections.dough && selections.flavors.length === selections.quantity && selections.flavors.every(Boolean) && selections.crust;

    const getMissingHint = () => {
        if (!selections.dough) return 'Selecione o tipo de massa';
        if (selections.flavors.length < selections.quantity) return `Selecione ${selections.quantity === 1 ? 'o sabor' : 'os sabores'}`;
        if (!selections.crust) return 'Selecione a borda';
        return null;
    };
    const canAdd = selections.dough && selections.flavors.filter(Boolean).length === selections.quantity && selections.crust;

    return (
        <motion.div
            className="product-modal-overlay"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ ease: "easeOut", duration: 0.3 }}
        >
            <div className="pizza-modal-container">

                <div className="pizza-header">
                    <button className="pizza-back-button" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <div className="pizza-image-placeholder" style={{
                        backgroundImage: product.image ? `url(${product.image})` : 'none'
                    }}>
                    </div>
                </div>

                <div className="pizza-info">
                    <div>
                        <h2 className="pizza-title">{product.name}</h2>
                        <p className="pizza-description">{product.desc}</p>
                    </div>
                    <div className="pizza-price">{product.price}</div>
                </div>

                <div className="pizza-steps-container">

                    {renderDynamic ? (
                        /* DYNAMIC RENDERING */
                        sortedGroups.map(group => {
                            const min = group.min_selected || 0;
                            const max = group.max_selected || 1;
                            const currentSelected = dynamicSelections[group.id] || [];
                            const isSatisfied = currentSelected.length >= min && currentSelected.length <= max;

                            return (
                                <div key={group.id} className="pizza-section-group">
                                    <div className="pizza-section-header-block">
                                        <h3 className="pizza-section-title">{group.name}</h3>
                                        <p className="pizza-section-subtitle">
                                            {min === max && min === 1 ? 'Escolha 1 opção' :
                                                min === 0 ? 'Opcional' :
                                                    `Escolha de ${min} a ${max} opções`}
                                        </p>
                                    </div>
                                    <div className="pizza-options-container">
                                        {group.options.map(opt => {
                                            const isSelected = currentSelected.includes(opt.id);
                                            return (
                                                <div
                                                    key={opt.id}
                                                    className={`pizza-option-row ${isSelected ? 'active' : ''}`}
                                                    onClick={() => handleDynamicSelection(group.id, opt.id, max, max > 1)}
                                                >
                                                    <div className="pizza-option-info">
                                                        <span className="pizza-option-label">{opt.name}</span>
                                                        {opt.description && <p className="pizza-option-description">{opt.description}</p>}
                                                        {(opt.price || opt.extra_price) > 0 &&
                                                            <span className="pizza-option-price-tag">{Number(opt.extra_price) > 0 ? Number(opt.extra_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}</span>
                                                        }
                                                    </div>
                                                    <div className="pizza-selection-box">
                                                        {isSelected && (
                                                            <motion.svg
                                                                width="14" height="14" viewBox="0 0 14 14" fill="none"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                            >
                                                                <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </motion.svg>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        /* LEGACY RENDERING (Existing logic) */
                        <>
                            {/* Dough Section */}
                            <div className="pizza-section-group">
                                <div className="pizza-section-header-block">
                                    <h3 className="pizza-section-title">Tipo de Massa</h3>
                                    <p className="pizza-section-subtitle">Escolha 1 opção</p>
                                </div>
                                <div className="pizza-options-container">
                                    {doughOptions.map(opt => (
                                        <div
                                            key={opt.id}
                                            className={`pizza-option-row ${selections.dough === opt.id ? 'active' : ''}`}
                                            onClick={() => setSelections(prev => ({ ...prev, dough: opt.id }))}
                                        >
                                            <div className="pizza-option-info">
                                                <span className="pizza-option-label">{opt.name}</span>
                                                {opt.desc && <p className="pizza-option-description">{opt.desc}</p>}
                                                {opt.price > 0 && <span className="pizza-option-price-tag">{formatPrice(opt.price)}</span>}
                                            </div>
                                            <div className="pizza-selection-box">
                                                {selections.dough === opt.id && (
                                                    <motion.svg
                                                        width="14" height="14" viewBox="0 0 14 14" fill="none"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                    >
                                                        <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </motion.svg>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Section */}
                            <div className="pizza-section-group">
                                <div className="pizza-section-header-block">
                                    <h3 className="pizza-section-title">Quantidade de Sabores</h3>
                                    <p className="pizza-section-subtitle">Quantos sabores você gostaria?</p>
                                </div>
                                <div className="pizza-options-container">
                                    {[1, 2].map(qty => (
                                        <div
                                            key={qty}
                                            className={`pizza-option-row ${selections.quantity === qty ? 'active' : ''}`}
                                            onClick={() => {
                                                if (selections.quantity !== qty) {
                                                    setSelections(prev => ({ ...prev, quantity: qty, flavors: [] }));
                                                }
                                            }}
                                        >
                                            <div className="pizza-option-info">
                                                <span className="pizza-option-label">{qty === 1 ? '1 Sabor' : '2 Sabores'}</span>
                                            </div>
                                            <div className="pizza-selection-box">
                                                {selections.quantity === qty && (
                                                    <motion.svg
                                                        width="14" height="14" viewBox="0 0 14 14" fill="none"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                    >
                                                        <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </motion.svg>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Flavors Section(s) */}
                            {selections.quantity === 1 ? (
                                <div className="pizza-section-group">
                                    <div className="pizza-section-header-block">
                                        <h3 className="pizza-section-title">Sabores</h3>
                                        <p className="pizza-section-subtitle">Escolha 1 opção</p>
                                    </div>
                                    <div className="pizza-options-container">
                                        {flavorOptions.map(opt => (
                                            <div
                                                key={opt.id}
                                                className={`pizza-option-row ${selections.flavors[0] === opt.id ? 'active' : ''}`}
                                                onClick={() => setSelections(prev => ({ ...prev, flavors: [opt.id] }))}
                                            >
                                                <div className="pizza-option-info">
                                                    <span className="pizza-option-label">{opt.name}</span>
                                                    {opt.desc && <p className="pizza-option-description">{opt.desc}</p>}
                                                    {opt.price > 0 && <span className="pizza-option-price-tag">{formatPrice(opt.price)}</span>}
                                                </div>
                                                <div className="pizza-selection-box">
                                                    {selections.flavors[0] === opt.id && (
                                                        <motion.svg
                                                            width="14" height="14" viewBox="0 0 14 14" fill="none"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                        >
                                                            <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </motion.svg>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Flavor 1 */}
                                    <div className="pizza-section-group">
                                        <div className="pizza-section-header-block">
                                            <h3 className="pizza-section-title">1º Sabor</h3>
                                            <p className="pizza-section-subtitle">Escolha o primeiro sabor</p>
                                        </div>
                                        <div className="pizza-options-container">
                                            {flavorOptions.map(opt => (
                                                <div
                                                    key={opt.id}
                                                    className={`pizza-option-row ${selections.flavors[0] === opt.id ? 'active' : ''}`}
                                                    onClick={() => setSelections(prev => {
                                                        const newFlavors = [...prev.flavors];
                                                        newFlavors[0] = opt.id;
                                                        return { ...prev, flavors: newFlavors };
                                                    })}
                                                >
                                                    <div className="pizza-option-info">
                                                        <span className="pizza-option-label">{opt.name}</span>
                                                        {opt.desc && <p className="pizza-option-description">{opt.desc}</p>}
                                                        {opt.price > 0 && <span className="pizza-option-price-tag">{formatPrice(opt.price)}</span>}
                                                    </div>
                                                    <div className="pizza-selection-box">
                                                        {selections.flavors[0] === opt.id && (
                                                            <motion.svg
                                                                width="14" height="14" viewBox="0 0 14 14" fill="none"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                            >
                                                                <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </motion.svg>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Flavor 2 */}
                                    <div className="pizza-section-group">
                                        <div className="pizza-section-header-block">
                                            <h3 className="pizza-section-title">2º Sabor</h3>
                                            <p className="pizza-section-subtitle">Escolha o segundo sabor</p>
                                        </div>
                                        {selections.flavors[0] ? (
                                            <div className="pizza-options-container">
                                                {flavorOptions.map(opt => (
                                                    <div
                                                        key={opt.id}
                                                        className={`pizza-option-row ${selections.flavors[1] === opt.id ? 'active' : ''}`}
                                                        onClick={() => setSelections(prev => {
                                                            const newFlavors = [...prev.flavors];
                                                            if (!newFlavors[0]) return prev;
                                                            newFlavors[1] = opt.id;
                                                            return { ...prev, flavors: newFlavors };
                                                        })}
                                                    >
                                                        <div className="pizza-option-info">
                                                            <span className="pizza-option-label">{opt.name}</span>
                                                            {opt.desc && <p className="pizza-option-description">{opt.desc}</p>}
                                                            {opt.price > 0 && <span className="pizza-option-price-tag">{formatPrice(opt.price)}</span>}
                                                        </div>
                                                        <div className="pizza-selection-box">
                                                            {selections.flavors[1] === opt.id && (
                                                                <motion.svg
                                                                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                                >
                                                                    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </motion.svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="pizza-placeholder-container">
                                                <img src="/icon-menux.svg" alt="Menux Icon" className="pizza-hand-icon" />
                                                <span className="pizza-placeholder-title">Selecione o 1º sabor</span>
                                                <span className="pizza-placeholder-desc">Antes de escolher o segundo sabor, selecione o primeiro acima.</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Crust Section */}
                            <div className="pizza-section-group">
                                <div className="pizza-section-header-block">
                                    <h3 className="pizza-section-title">Bordas</h3>
                                    <p className="pizza-section-subtitle">Escolha 1 opção</p>
                                </div>
                                {selections.flavors.length === 0 ? (
                                    <div className="pizza-placeholder-container">
                                        <img src="/icon-menux.svg" alt="Menux Icon" className="pizza-hand-icon" />
                                        <span className="pizza-placeholder-title">Selecione os sabores da pizza</span>
                                        <span className="pizza-placeholder-desc">Selecione os sabores da pizza e iremos te ajudar a escolher a melhor borda que combina com a sua pizza!</span>
                                    </div>
                                ) : (
                                    <div className="pizza-options-container">
                                        {crustOptions.map(opt => (
                                            <div
                                                key={opt.id}
                                                className={`pizza-option-row ${selections.crust === opt.id ? 'active' : ''}`}
                                                onClick={() => setSelections(prev => ({ ...prev, crust: opt.id }))}
                                            >
                                                <div className="pizza-option-info">
                                                    <span className="pizza-option-label">{opt.name}</span>
                                                    {opt.price > 0 && <span className="pizza-option-price-tag">{formatPrice(opt.price)}</span>}
                                                </div>
                                                <div className="pizza-selection-box">
                                                    {selections.crust === opt.id && (
                                                        <motion.svg
                                                            width="14" height="14" viewBox="0 0 14 14" fill="none"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                        >
                                                            <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </motion.svg>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Others Section */}
                            <div className="pizza-section-group">
                                <div className="pizza-section-header-block">
                                    <h3 className="pizza-section-title">Outros</h3>
                                    <p className="pizza-section-subtitle">Escolha 1 opção</p>
                                </div>
                                {!selections.crust ? (
                                    <div className="pizza-placeholder-container">
                                        <img src="/icon-menux.svg" alt="Menux Icon" className="pizza-hand-icon" />
                                        <span className="pizza-placeholder-title">Selecione a borda antes</span>
                                        <span className="pizza-placeholder-desc">Selecione a borda e iremos te ajudar a escolher os outros que combina com a sua pizza!</span>
                                    </div>
                                ) : (
                                    <div className="pizza-options-container">
                                        {otherOptions.map(opt => (
                                            <div
                                                key={opt.id}
                                                className={`pizza-option-row ${selections.others.includes(opt.id) ? 'active' : ''}`}
                                                onClick={() => toggleOther(opt.id)}
                                            >
                                                <div className="pizza-option-info">
                                                    <span className="pizza-option-label">{opt.name}</span>
                                                    {opt.price > 0 && <span className="pizza-option-price-tag">{formatPrice(opt.price)}</span>}
                                                </div>
                                                <div className="pizza-selection-box">
                                                    {selections.others.includes(opt.id) && (
                                                        <motion.svg
                                                            width="14" height="14" viewBox="0 0 14 14" fill="none"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                        >
                                                            <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </motion.svg>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Observations */}
                    <div className="pizza-obs-section">
                        <label className="pizza-obs-label">Observações do pedido</label>
                        <textarea
                            className="pizza-obs-input"
                            placeholder="Digite aqui as observações"
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                        ></textarea>
                    </div>

                </div>

                <div className="pizza-footer-bar">
                    {!canAdd && getMissingHint() && (
                        <span className="pizza-footer-hint">{getMissingHint()}</span>
                    )}
                    <button
                        className="pizza-footer-btn"
                        onClick={handleAddToCartAction}
                        disabled={!canAdd()}
                    >
                        Adicionar • {calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
