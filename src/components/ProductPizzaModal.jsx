import { motion } from 'framer-motion';
import { useState } from 'react';
import './ProductPizzaModal.css';



export default function ProductPizzaModal({ product, onClose, onAddToCart }) {
    const [observation, setObservation] = useState('');
    const [selections, setSelections] = useState({
        dough: 'tradicional',
        quantity: 1,
        flavors: [],
        crust: null,
        others: []
    });

    const doughOptions = [
        { id: 'tradicional', name: 'Tradicional', price: 0 },
        { id: 'fina', name: 'Massa Fina', price: 0 },
        { id: 'integral', name: 'Massa integral', desc: 'Molho de tomate, mussarela, azeitonas e orégano.', price: 4.00 }
    ];

    const flavorOptions = [
        { id: 'mussarela', name: 'Mussarela', desc: 'Molho de tomate, mussarela, azeitonas e orégano.', price: 4.00 },
        { id: 'portuguesa', name: 'Portuguesa', desc: 'Molho de tomate, presunto, ovos, cebola, tomate, pimentão, azeitonas e orégano.', price: 4.00 },
        { id: 'queijo', name: 'Queijo', desc: 'Molho de tomate e queijo mussarela.', price: 0 },
        { id: 'calabresa', name: 'Calabresa', desc: 'Molho de tomate, calabresa fatiada e cebola.', price: 2.00 }
    ];

    const crustOptions = [
        { id: 'sem-borda', name: 'Sem Borda', price: 0 },
        { id: 'catupiry', name: 'Catupiry', price: 6.00 },
        { id: 'cheddar', name: 'Cheddar', price: 6.00 }
    ];

    const otherOptions = [
        { id: 'extra-cheese', name: 'Queijo Extra', price: 5.00 },
        { id: 'bacon', name: 'Bacon Extra', price: 4.00 },
        { id: 'oregano', name: 'Orégano Extra', price: 0 }
    ];

    const toggleFlavor = (id) => {
        setSelections(prev => {
            const current = prev.flavors;
            if (current.includes(id)) {
                return { ...prev, flavors: current.filter(x => x !== id) };
            }
            if (current.length >= 2) return prev; // Max 2
            return { ...prev, flavors: [...current, id] };
        });
    };

    const toggleOther = (id) => {
        setSelections(prev => {
            const current = prev.others;
            if (current.includes(id)) {
                return { ...prev, others: current.filter(x => x !== id) };
            }
            return { ...prev, others: [...current, id] };
        });
    };

    const formatPrice = (p) => p > 0 ? `+ R$ ${p.toFixed(2).replace('.', ',')}` : '';

    const calculateTotal = () => {
        const getPriceVal = (s) => parseFloat(typeof s === 'string' ? s.replace(/[^\d,]/g, '').replace(',', '.') : s);
        const base = getPriceVal(product.price);
        const doughP = doughOptions.find(d => d.id === selections.dough)?.price || 0;
        const flavorsP = selections.flavors.reduce((acc, id) => acc + (flavorOptions.find(f => f.id === id)?.price || 0), 0);
        const crustP = crustOptions.find(c => c.id === selections.crust)?.price || 0;
        const othersP = selections.others.reduce((acc, id) => acc + (otherOptions.find(o => o.id === id)?.price || 0), 0);
        return base + doughP + flavorsP + crustP + othersP;
    };

    const handleAddToCart = () => {
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
        onClose();
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
                                                    // Ensure index 0 is kept
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

                    {/* Crust Section - Dependent on Flavors */}
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

                    {/* Others Section - Dependent on Crust */}
                    <div className="pizza-section-group">
                        <div className="pizza-section-header-block">
                            <h3 className="pizza-section-title">Outros</h3>
                            <p className="pizza-section-subtitle">Escolha 1 opção</p>
                        </div>
                        {!selections.crust ? (
                            <div className="pizza-placeholder-container">
                                <img src="/icon-menux.svg" alt="Menux Icon" className="pizza-hand-icon" />
                                <span className="pizza-placeholder-title">Selecione a borda antes</span>
                                <span className="pizza-placeholder-desc">Selecione os sabores da borda e iremos te ajudar a escolher a melhor outros que combina com a sua pizza!</span>
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
                    <button
                        className="pizza-footer-btn"
                        onClick={handleAddToCart}
                        disabled={!canAdd}
                    >
                        Adicionar • {calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
