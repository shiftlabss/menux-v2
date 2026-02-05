import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Onboarding from './components/Onboarding'
import Login from './components/Login'
import Register from './components/Register'
import Verification from './components/Verification'
import MenuHub from './components/MenuHub'
import StudioView from './components/StudioView'
import DesignSystemView from './components/DesignSystemView'
import './index.css'

function AppContent() {
  const [step, setStep] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'design') return 'design-system';

    // Always start at onboarding - require authentication every time
    return 'onboarding';
  })

  const [phone, setPhone] = useState(() => localStorage.getItem('menux_phone') || '')
  const [userName, setUserName] = useState(() => localStorage.getItem('menux_user') || '')
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem('menux_avatar') || null)
  const [isReturningUser, setIsReturningUser] = useState(() => {
    return localStorage.getItem('menux_is_returning') === 'true';
  })

  // Update storage manually only when needed
  const persistUser = (name, phoneVal, avatar, returning) => {
    if (phoneVal) localStorage.setItem('menux_phone', phoneVal);
    if (name) localStorage.setItem('menux_user', name);
    if (avatar) localStorage.setItem('menux_avatar', avatar);
    localStorage.setItem('menux_is_returning', returning ? 'true' : 'false');
  }

  // Reset state to storage when returning to onboarding (discarding partial flow data)
  // Note: Only depends on [step] intentionally — adding state vars would cause infinite loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (step === 'onboarding') {
      const storedPhone = localStorage.getItem('menux_phone') || '';
      const storedUser = localStorage.getItem('menux_user') || '';
      const storedAvatar = localStorage.getItem('menux_avatar') || null;
      const storedReturning = localStorage.getItem('menux_is_returning') === 'true';

      setPhone(storedPhone);
      setUserName(storedUser);
      setUserAvatar(storedAvatar);
      setIsReturningUser(storedReturning);
    }
  }, [step]);

  return (
    <main className="app-container" style={step === 'design-system' ? { maxWidth: '100%', height: 'auto', borderRadius: 0, boxShadow: 'none' } : {}}>
      <AnimatePresence mode="wait">
        {step === 'onboarding' && (
          <Onboarding
            key="onboarding"
            savedUser={userName} // Pass saved name for welcome back message if needed
            userAvatar={userAvatar}
            onStart={(target) => {
              if (target === 'auth') setStep('login')
              else if (target === 'direct-access' || target === 'menu') setStep('hub')
            }}
          />
        )}

        {step === 'hub' && (
          <MenuHub
            key="hub"
            onOpenStudio={() => setStep('studio')}
            userName={userName}
            phone={phone}
            userAvatar={userAvatar}
            onUpdateAvatar={(newAvatar) => {
              setUserAvatar(newAvatar);
              localStorage.setItem('menux_avatar', newAvatar);
            }}
            onAuth={() => setStep('login')}
            onUpdateProfile={(newName, newPhone) => {
              setUserName(newName);
              setPhone(newPhone);
              localStorage.setItem('menux_user', newName);
              localStorage.setItem('menux_phone', newPhone);
            }}
            onLogout={() => {
              setUserName('');
              setPhone('');
              setUserAvatar(null);
              setIsReturningUser(false);
              // Clear user identity
              localStorage.removeItem('menux_phone');
              localStorage.removeItem('menux_user');
              localStorage.removeItem('menux_avatar');
              localStorage.removeItem('menux_is_returning');
              // Clear cart, orders and Maestro data
              localStorage.removeItem('menux_cart');
              localStorage.removeItem('menux_active_order');
              localStorage.removeItem('menux_active_items');
              localStorage.removeItem('menux_order_history');
              localStorage.removeItem('maestro_messages');
              localStorage.removeItem('maestro_current_view');
              localStorage.removeItem('maestro_last_activity');
              localStorage.removeItem('menux_user_id');
              setStep('onboarding');
            }}
          />
        )}

        {step === 'studio' && (
          <StudioView
            key="studio"
            onClose={() => setStep('hub')}
          />
        )}

        {step === 'login' && (
          <Login
            key="login"
            onBack={() => setStep('onboarding')}
            checkUser={(phoneValue) => phoneValue === '(11) 99999-9999'}
            savedName={userName} // Pass saved name to allow auto-OTP for new users
            onNext={(phoneValue) => {
              setPhone(phoneValue)

              // SIMULAÇÃO: Se o número for (11) 99999-9999, tratamos como usuário antigo
              if (phoneValue === '(11) 99999-9999') {
                setIsReturningUser(true)
                setStep('verification')
              } else {
                setIsReturningUser(false)

                // Logic updated: Login.jsx now sends OTP if savedName is present.
                // So if we have a name, we can go straight to verification.
                if (userName && userName.trim() !== '') {
                  setStep('verification')
                } else {
                  setStep('register')
                }
              }
            }}
          />
        )}

        {step === 'register' && (
          <Register
            key="register"
            phone={phone}
            initialName={userName}
            onBack={() => setStep('login')}
            onNext={(nameValue) => {
              setUserName(nameValue)
              setStep('verification')
            }}
          />
        )}

        {step === 'verification' && (
          <Verification
            key="verification"
            phone={phone}
            isReturningUser={isReturningUser}
            onBack={() => isReturningUser ? setStep('login') : setStep('register')}
            onChangePhone={() => {
              // Keep userName, clear phone, go to login. 
              // Login will see the name and trigger auto-OTP if the new number is valid.
              setPhone('');
              setStep('login');
            }}
            onFinish={() => {
              // Simulate Auth Success (usually save token)
              let finalName = userName;
              if (isReturningUser) {
                finalName = "Usuário Retorno"; // Simulated name fetch
                setUserName(finalName);
              }

              // SALVAR NO LOCALSTORAGE APENAS AQUI
              persistUser(finalName, phone, userAvatar, true);
              setIsReturningUser(true);

              setStep('hub');
            }}
          />
        )}
        {step === 'design-system' && (
          <DesignSystemView />
        )}
      </AnimatePresence>
    </main>
  )
}

import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}

export default App
