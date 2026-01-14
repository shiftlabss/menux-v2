import { motion } from 'framer-motion';
import { useRef } from 'react';

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

export default function ProfileModal({ onClose, currentAvatar, onUpdateAvatar, userName, phone, onLogout }) {
    const fileInputRef = useRef(null);

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
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
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
                    <div className="profile-name">{userName || "Visitante"}</div>
                    <div className="profile-since">
                        <MenuxFaceIcon />
                        <span>Há 3 meses usando menuxIA</span>
                    </div>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Seu Telefone*</label>
                    <div className="profile-input-row">
                        <input type="text" className="profile-input-ddi" defaultValue="+55" readOnly />
                        <input type="text" className="profile-input" value={phone || "(00) 00000-0000"} readOnly />
                    </div>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Seu Nome*</label>
                    <input type="text" className="profile-input" value={userName || "Visitante"} readOnly />
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Zona de Perigo</label>
                    <button className="profile-danger-zone" onClick={() => {
                        if (window.confirm("Deletar minha conta?")) {
                            onLogout();
                            onClose();
                        }
                    }}>
                        <span className="text-danger">Deletar minha conta</span>
                        <MenuxLogo height={17} />
                    </button>
                </div>

                <button className="btn-save-profile" onClick={() => {
                    alert('As alterações foram salvas (Simulação).');
                    onClose();
                }}>
                    Salvar ajustes
                </button>
            </div>
        </motion.div>
    );
}
