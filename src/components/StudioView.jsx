import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStudio } from '../context/StudioContext';
import { useToast } from '../context/ToastContext';

export default function StudioView({ onClose }) {
    const { branding, updateBranding, categories, setCategories, products, setProducts, addSubcategory, resetToDefault } = useStudio();
    const [activeTab, setActiveTab] = useState('branding');
    const { showToast } = useToast();

    // Branding State
    const [localBranding, setLocalBranding] = useState(branding);

    // Category/Subcategory State
    const [newCatName, setNewCatName] = useState('');
    const [selectedCatForSub, setSelectedCatForSub] = useState('');
    const [newSubName, setNewSubName] = useState('');

    // Product State
    const [newProd, setNewProd] = useState({ name: '', price: '', desc: '', categoryId: '', subcategoryId: '', image: '' });
    const [editingProductId, setEditingProductId] = useState(null);

    const handleImageUpload = (file, callback) => {
        if (!file) return;

        // Validação de tamanho (max 2MB para evitar erro de LocalStorage)
        if (file.size > 2 * 1024 * 1024) {
            alert("A imagem é muito grande! Por favor, escolha uma imagem menor que 2MB para não sobrecarregar o navegador.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveBranding = () => {
        updateBranding(localBranding);
        showToast('Identidade visual atualizada!');
    };

    const handleAddCategory = () => {
        if (!newCatName) return;
        const id = newCatName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
        setCategories([...categories, { id, name: newCatName, subcategories: [] }]);
        setNewCatName('');
    };

    const handleAddSubcategory = () => {
        if (!selectedCatForSub || !newSubName) return;
        addSubcategory(selectedCatForSub, newSubName);
        setNewSubName('');
        showToast('Subcategoria adicionada!');
    };

    const handleAddProduct = () => {
        if (!newProd.name || !newProd.categoryId) return;

        if (editingProductId) {
            const updatedProducts = products.map(p =>
                p.id === editingProductId ? { ...newProd, id: p.id } : p
            );
            setProducts(updatedProducts);
            setEditingProductId(null);
            showToast('Produto atualizado!');
        } else {
            setProducts([...products, { ...newProd, id: Date.now() }]);
            showToast('Produto adicionado!');
        }

        setNewProd({ name: '', price: '', desc: '', categoryId: '', subcategoryId: '', image: '' });
    };

    const startEditing = (product) => {
        setNewProd({ ...product });
        setEditingProductId(product.id);
        const scrollArea = document.querySelector('.studio-content-scroll');
        if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditing = () => {
        setEditingProductId(null);
        setNewProd({ name: '', price: '', desc: '', categoryId: '', subcategoryId: '', image: '' });
    };

    const currentSubcategories = categories.find(c => c.id === newProd.categoryId)?.subcategories || [];

    return (
        <motion.div
            className="studio-view-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
        >
            <div className="studio-header">
                <div className="studio-header-info">
                    <button className="studio-back-btn" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        Voltar ao Menu
                    </button>
                    <div className="studio-title-group">
                        <h1>Menux Studio</h1>
                        <p>Configure o branding e o cardápio do seu restaurante em tempo real.</p>
                    </div>
                </div>
            </div>

            <div className="studio-tabs">
                <button className={activeTab === 'branding' ? 'active' : ''} onClick={() => setActiveTab('branding')}>
                    <span>Identidade Visual</span>
                </button>
                <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>
                    <span>Estrutura de Categorias</span>
                </button>
                <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
                    <span>Gestão de Itens</span>
                </button>
            </div>

            <div className="studio-content-scroll">
                <div className="studio-form-container">
                    {activeTab === 'branding' && (
                        <div className="admin-form">
                            <div className="admin-field">
                                <label>Nome do Restaurante</label>
                                <input type="text" value={localBranding.restName} onChange={e => setLocalBranding({ ...localBranding, restName: e.target.value })} />
                            </div>

                            <div className="admin-row">
                                <div className="admin-field" style={{ flex: 1 }}>
                                    <label>Logo (Avatar)</label>
                                    <div className="admin-image-upload">
                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], (res) => setLocalBranding({ ...localBranding, restLogo: res }))} />
                                        {localBranding.restLogo ? <img src={localBranding.restLogo} alt="Logo Preview" /> : <span>Upload Logo</span>}
                                    </div>
                                </div>
                                <div className="admin-field" style={{ flex: 1 }}>
                                    <label>Capa (Banner)</label>
                                    <div className="admin-image-upload">
                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], (res) => setLocalBranding({ ...localBranding, restCover: res }))} />
                                        {localBranding.restCover ? <img src={localBranding.restCover} alt="Cover Preview" /> : <span>Upload Capa</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="admin-field">
                                <label>Descrição do Restaurante (Bio)</label>
                                <textarea rows="3" value={localBranding.restBio} onChange={e => setLocalBranding({ ...localBranding, restBio: e.target.value })} />
                            </div>

                            <div className="admin-field">
                                <label>Cor Primária (Hex)</label>
                                <div className="color-input-wrapper">
                                    <input type="color" value={localBranding.brandColor} onChange={e => setLocalBranding({ ...localBranding, brandColor: e.target.value })} />
                                    <input type="text" value={localBranding.brandColor} onChange={e => setLocalBranding({ ...localBranding, brandColor: e.target.value })} />
                                </div>
                            </div>
                            <button className="admin-save-btn" onClick={handleSaveBranding}>Salvar Alterações</button>
                        </div>
                    )}

                    {activeTab === 'categories' && (
                        <div className="admin-form">
                            <div className="admin-section-box">
                                <label className="admin-section-title">1. Criar Categoria Principal</label>
                                <div className="admin-row">
                                    <input type="text" placeholder="Ex: Pratos Principais, Bebidas..." value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                                    <button className="admin-btn-add" onClick={handleAddCategory}>Adicionar</button>
                                </div>
                            </div>

                            <div className="admin-section-box" style={{ marginTop: 16 }}>
                                <label className="admin-section-title">2. Criar Subcategoria (Opcional)</label>
                                <div className="admin-field">
                                    <select value={selectedCatForSub} onChange={e => setSelectedCatForSub(e.target.value)} style={{ width: '100%', marginBottom: 12 }}>
                                        <option value="">Vincular à Categoria...</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
                                    </select>
                                    <div className="admin-row">
                                        <input type="text" placeholder="Ex: Vinhos Tintos, Sobremesas Geladas..." value={newSubName} onChange={e => setNewSubName(e.target.value)} />
                                        <button className="admin-btn-add" onClick={handleAddSubcategory}>Adicionar</button>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-list" style={{ marginTop: 24 }}>
                                <label className="admin-section-title">Estrutura do Cardápio</label>
                                <div className="admin-list-scroll full-list">
                                    {categories.length === 0 && <p className="admin-empty-text">Nenhuma categoria criada ainda.</p>}
                                    {categories.map(cat => (
                                        <div key={cat.id} className="category-group-preview">
                                            <div className="admin-list-item category-item">
                                                <strong>{cat.name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</strong>
                                                <button className="admin-btn-remove" onClick={() => setCategories(categories.filter(c => c.id !== cat.id))}>&times;</button>
                                            </div>
                                            <div className="subcategory-list-preview">
                                                {cat.subcategories?.length === 0 && <span className="admin-hint-text">Sem subcategorias</span>}
                                                {cat.subcategories?.map(sub => (
                                                    <div key={sub.id} className="admin-list-item sub-item">
                                                        <span>— {sub.name}</span>
                                                        <button className="admin-btn-remove" onClick={() => {
                                                            const updated = categories.map(c => c.id === cat.id ? { ...c, subcategories: c.subcategories.filter(s => s.id !== sub.id) } : c);
                                                            setCategories(updated);
                                                        }}>&times;</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="admin-form">
                            {editingProductId && (
                                <div className="editing-banner">
                                    <span>Você está editando: <strong>{newProd.name}</strong></span>
                                    <button className="admin-cancel-btn" onClick={cancelEditing}>Cancelar</button>
                                </div>
                            )}

                            <div className="admin-row">
                                <div className="admin-field" style={{ flex: 2 }}>
                                    <label>Nome do Produto</label>
                                    <input type="text" value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} />
                                </div>
                                <div className="admin-field" style={{ flex: 1 }}>
                                    <label>Foto</label>
                                    <div className="admin-image-upload small">
                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], (res) => setNewProd({ ...newProd, image: res }))} />
                                        {newProd.image ? <img src={newProd.image} alt="Preview" /> : <span>+ Foto</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="admin-row">
                                <div className="admin-field" style={{ flex: 1 }}>
                                    <label>Categoria</label>
                                    <select value={newProd.categoryId} onChange={e => setNewProd({ ...newProd, categoryId: e.target.value, subcategoryId: '' })}>
                                        <option value="">Selecione...</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
                                    </select>
                                </div>
                                <div className="admin-field" style={{ flex: 1 }}>
                                    <label>Subcategoria</label>
                                    <select value={newProd.subcategoryId} onChange={e => setNewProd({ ...newProd, subcategoryId: e.target.value })}>
                                        <option value="">Selecione...</option>
                                        {currentSubcategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="admin-field">
                                <label>Preço</label>
                                <input type="text" placeholder="R$ 0,00" value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} />
                            </div>

                            <div className="admin-field">
                                <label>Descrição</label>
                                <textarea rows="2" value={newProd.desc} onChange={e => setNewProd({ ...newProd, desc: e.target.value })} />
                            </div>
                            <button className="admin-save-btn" onClick={handleAddProduct}>
                                {editingProductId ? 'Salvar Alterações' : 'Adicionar Produto'}
                            </button>

                            <div className="admin-list" style={{ marginTop: 24 }}>
                                <label className="admin-section-title">Produtos Cadastrados ({products.length})</label>
                                <div className="admin-list-scroll full-list">
                                    {products.map(p => (
                                        <div key={p.id} className="admin-list-item product-list-item">
                                            <div className="prod-list-info" onClick={() => startEditing(p)}>
                                                {p.image && <img src={p.image} className="prod-thumb" alt="" />}
                                                <div className="prod-text">
                                                    <strong>{p.name}</strong>
                                                    <span>{p.price}</span>
                                                </div>
                                            </div>
                                            <button className="admin-btn-remove" onClick={() => setProducts(products.filter(item => item.id !== p.id))}>&times;</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="studio-footer-actions">
                    <button className="admin-reset-btn" onClick={() => {
                        if (confirm("Isso apagará todas as suas alterações e carregará os dados padrão. Deseja continuar?")) {
                            resetToDefault();
                            showToast("Dados redefinidos com sucesso.");
                        }
                    }}>Redefinir Dados Atuais</button>
                    <p>Cuidado: esta ação reverte todas as edições para o cardápio padrão.</p>
                </div>
            </div>
        </motion.div>
    );
}
