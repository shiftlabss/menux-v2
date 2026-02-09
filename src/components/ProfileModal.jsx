import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { useToast } from '../context/ToastContext';

const MenuxLogo = ({ height = 24 }) => (
    <img src="/logo-menux.svg" alt="Menux" style={{ height }} />
);

const CameraIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

const MenuxFaceIcon = () => (
    <img src="/icon-menux.svg" alt="Menux Face" style={{ width: 20, height: 20 }} />
);

const DeleteAccountModal = ({ onClose, onConfirm }) => (
    <motion.div
        className="delete-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
    >
        <motion.div
            className="delete-modal-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
        >
            <div>
                <h3 className="delete-modal-title">Excluir sua conta?</h3>
                <p className="delete-modal-desc">
                    Isso vai desconectar todos os dispositivos vinculados à sua conta e excluir permanentemente seus dados do Menux.
                </p>
                <a href="#" className="delete-modal-link">Saiba mais sobre a exclusão da conta</a>
            </div>

            <div className="delete-modal-actions">
                <button
                    onClick={onClose}
                    className="btn-delete-cancel"
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    className="btn-delete-confirm"
                >
                    Excluir minha conta
                </button>
            </div>
        </motion.div>
    </motion.div>
);

export default function ProfileModal({ onClose, currentAvatar, onUpdateAvatar, userName, phone, onLogout, onDeleteAccount, onSaveProfile }) {
    const fileInputRef = useRef(null);
    const { showToast } = useToast();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Editable states
    const [editableName, setEditableName] = useState(userName || '');
    const [editablePhone, setEditablePhone] = useState(phone || '');
    const [rawDigits, setRawDigits] = useState(() => {
        // Extract digits from initial phone
        return phone ? phone.replace(/[^\d]/g, '') : '';
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 200;
                    const MAX_HEIGHT = 200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    onUpdateAvatar(dataUrl);
                    showToast("Avatar atualizado!");
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const formatPhoneNumber = (digits) => {
        if (!digits) return '';
        const len = digits.length;

        if (len <= 2) return digits;
        if (len <= 6) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        }
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    };

    const handlePhoneChange = (e) => {
        const digitsOnly = e.target.value.replace(/[^\d]/g, '');
        setRawDigits(digitsOnly);
        setEditablePhone(formatPhoneNumber(digitsOnly));
    };

    const handlePhoneKeyDown = (e) => {
        if (e.key === 'Backspace') {
            const selection = e.target.selectionStart;
            const value = e.target.value;

            if (selection === value.length && rawDigits.length > 0) {
                e.preventDefault();
                const newDigits = rawDigits.slice(0, -1);
                setRawDigits(newDigits);
                setEditablePhone(formatPhoneNumber(newDigits));
            }
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value.slice(0, 20); // Limit to 20 chars
        setEditableName(value);
    };

    // Check if there are any changes (phone is read-only, only name can change)
    const hasChanges = editableName !== (userName || '');

    return (
        <>
            <motion.div
                className="profile-modal-overlay"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{ ease: "easeOut", duration: 0.3 }}
            >
                <div className="profile-header">
                    <MenuxLogo height={24} />
                    <button className="btn-profile-back" onClick={onClose}>
                        Voltar ao Cardápio
                    </button>
                </div>

                <div className="profile-content">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar" onClick={triggerFileInput} style={{ cursor: 'pointer' }}>
                            {currentAvatar && (
                                <img
                                    src={currentAvatar}
                                    alt="Profile"
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            )}
                            <div className="profile-camera-icon">
                                <CameraIcon />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className="profile-name">{editableName || "Visitante"}</div>
                        <div className="profile-since">
                            <MenuxFaceIcon />
                            <span>Há 3 meses usando menuxIA</span>
                        </div>
                    </div>

                    <div className="profile-form-group">
                        <label className="profile-label">Seu Telefone*</label>
                        <div className="profile-input-row">
                            <input type="text" className="profile-input-ddi" defaultValue="+55" readOnly />
                            <input
                                type="tel"
                                className="profile-input"
                                value={editablePhone || ''}
                                readOnly
                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                placeholder="(00) 00000-0000"
                                maxLength={15}
                            />
                        </div>
                        <span style={{ fontSize: '11px', color: '#999', marginTop: '4px', display: 'block' }}>
                            Para alterar o telefone, saia da conta e faça login com o novo número.
                        </span>
                    </div>

                    <div className="profile-form-group">
                        <label className="profile-label">Seu Nome*</label>
                        <input
                            type="text"
                            className="profile-input"
                            value={editableName || ''}
                            onChange={handleNameChange}
                            placeholder="Seu nome"
                            maxLength={20}
                        />
                    </div>

                    <div className="profile-form-group">
                        <label className="profile-label">Zona de Perigo</label>
                        <button className="profile-danger-zone" onClick={() => setShowDeleteConfirm(true)}>
                            <span className="text-danger">Deletar minha conta</span>
                            <MenuxLogo height={17} />
                        </button>
                    </div>

                    <div className="profile-actions-row">
                        <button
                            className={`btn-save-profile ${hasChanges ? 'active' : ''}`}
                            style={{
                                backgroundColor: hasChanges ? '#000' : undefined,
                                color: hasChanges ? '#fff' : undefined,
                                cursor: hasChanges ? 'pointer' : 'not-allowed',
                                opacity: hasChanges ? 1 : undefined
                            }}
                            onClick={() => {
                                if (onSaveProfile) {
                                    onSaveProfile(editableName, editablePhone);
                                }
                                showToast("Perfil atualizado com sucesso!");
                                onClose();
                            }}>
                            Salvar ajustes
                        </button>
                        <button className="btn-logout-profile" onClick={() => {
                            onLogout();
                            onClose();
                        }}>
                            Sair da Conta
                        </button>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {showDeleteConfirm && (
                    <DeleteAccountModal
                        onClose={() => setShowDeleteConfirm(false)}
                        onConfirm={() => {
                            if (onDeleteAccount) onDeleteAccount();
                            setShowDeleteConfirm(false);
                            onClose();
                            showToast("Sua conta e todos os seus dados foram removidos.");
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
