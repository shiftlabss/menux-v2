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

  // Update storage when state changes
  useEffect(() => {
    if (phone) localStorage.setItem('menux_phone', phone);
    if (userName) localStorage.setItem('menux_user', userName);
    if (userAvatar) localStorage.setItem('menux_avatar', userAvatar);
    localStorage.setItem('menux_is_returning', isReturningUser);
  }, [phone, userName, userAvatar, isReturningUser]);

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
            onUpdateAvatar={setUserAvatar}
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
              localStorage.removeItem('menux_phone');
              localStorage.removeItem('menux_user');
              localStorage.removeItem('menux_avatar');
              localStorage.removeItem('menux_is_returning');
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
            onNext={(phoneValue) => {
              setPhone(phoneValue)

              // SIMULAÇÃO: Se o número for (11) 99999-9999, tratamos como usuário antigo
              if (phoneValue === '(11) 99999-9999') {
                setIsReturningUser(true)
                setStep('verification')
              } else {
                setIsReturningUser(false)
                if (userName && userName !== '') {
                  // If name exists (from storage), verify
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
            onChangePhone={() => setStep('login')}
            onFinish={() => {
              // Simulate Auth Success (usually save token)
              if (isReturningUser) {
                setUserName("Usuário Retorno"); // Simulated name fetch
              }
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
