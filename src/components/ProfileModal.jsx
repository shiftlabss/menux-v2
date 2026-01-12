import { motion } from 'framer-motion';

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

export default function ProfileModal({ onClose }) {
    return (
        <motion.div
            className="profile-modal-overlay"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="profile-header">
                <MenuxLogo />
                <button className="btn-profile-back" onClick={onClose}>
                    Voltar ao Cardápio
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        <div className="profile-camera-icon">
                            <CameraIcon />
                        </div>
                    </div>
                    <div className="profile-name">Lucas</div>
                    <div className="profile-since">
                        <MenuxFaceIcon />
                        <span>Há 3 meses usando menuxIA</span>
                    </div>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Seu Telefone*</label>
                    <div className="profile-input-row">
                        <input type="text" className="profile-input-ddi" defaultValue="+55" readOnly />
                        <input type="text" className="profile-input" defaultValue="(83) 99116-9082" />
                    </div>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Seu Nome*</label>
                    <input type="text" className="profile-input" defaultValue="Lucas" />
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Zona de Perigo</label>
                    <button className="profile-danger-zone">
                        <span className="text-danger">Deletar minha conta</span>
                        <MenuxLogo height={17} />
                    </button>
                </div>

                <button className="btn-save-profile">
                    Salvar ajustes
                </button>
            </div>
        </motion.div>
    );
}
