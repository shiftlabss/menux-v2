import { motion } from 'framer-motion';

const imgLogo = "/logo-menux.svg";
const imgIconLarge = "/icon-menux.svg";
const imgVerify = "/verify-icon.svg";

export default function Onboarding({ onStart, savedUser, userAvatar }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="onboarding-container"
    >
      <div className="welcome-section">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="logo-icon-card"
        >
          <img src={imgIconLarge} alt="Menux Icon" style={{ width: '37px', height: '41.39px' }} />
        </motion.div>

        <div className="logo-text-group">
          <h1 className="welcome-title">
            Bem-vindo ao Menux
            <img src={imgVerify} alt="Verificado" className="verified-icon" style={{ marginLeft: '6px' }} />
          </h1>
          <p className="welcome-subtitle">Veja o cardápio e monte seu pedido.</p>
        </div>
      </div>

      <div className="action-buttons">
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="btn-primary"
          onClick={() => onStart('menu')}
        >
          Abrir cardápio
        </motion.button>

        {!savedUser ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="btn-secondary"
            onClick={() => onStart('auth')}
          >
            Criar conta ou entrar no
            <img src={imgLogo} alt="Menux" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="btn-user-active"
            onClick={() => onStart('direct-access')}
          >
            <span className="user-login-text">Entrar como</span>
            <div className="user-badge">
              <img src={imgIconLarge} alt="Menux Icon" style={{ height: '18px' }} />
              {userAvatar ? (
                <img src={userAvatar} alt="Avatar" className="avatar-circle" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="avatar-circle"></div>
              )}
              <span className="user-name-text">{savedUser}</span>
            </div>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
