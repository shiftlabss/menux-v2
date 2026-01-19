import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Onboarding from './components/Onboarding'
import Login from './components/Login'
import Register from './components/Register'
import Verification from './components/Verification'
import MenuHub from './components/MenuHub'
import StudioView from './components/StudioView'
import DesignSystemView from './components/DesignSystemView'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './context/ToastContext'
import { UserProvider, useUser } from './context/UserContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

function AppContent() {
  const [step, setStep] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'design') return 'design-system';
    return 'onboarding';
  })

  const {
    phone, setPhone,
    userName, setUserName,
    userAvatar,
    isReturningUser, setIsReturningUser,
    persistUser,
    logout,
    deleteAccount,
    reloadFromStorage,
  } = useUser();

  useEffect(() => {
    if (step === 'onboarding') {
      reloadFromStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <main className="app-container" style={step === 'design-system' ? { maxWidth: '100%', height: 'auto', borderRadius: 0, boxShadow: 'none' } : {}}>
      <AnimatePresence mode="wait">
        {step === 'onboarding' && (
          <Onboarding
            key="onboarding"
            savedUser={userName}
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
            onAuth={() => setStep('login')}
            onLogout={() => { logout(); setStep('onboarding'); }}
            onDeleteAccount={() => { deleteAccount(); setStep('onboarding'); }}
            onLogout={() => {
              setUserName('');
              setPhone('');
              localStorage.removeItem('menux_customer_id');
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
            savedName={userName}
            onNext={(phoneValue) => {
              setPhone(phoneValue)

              if (phoneValue === '(11) 99999-9999') {
                setIsReturningUser(true)
                setStep('verification')
              } else {
                setIsReturningUser(false)
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
            userName={userName}
            isReturningUser={isReturningUser}
            onBack={() => isReturningUser ? setStep('login') : setStep('register')}
            onChangePhone={() => {
              setPhone('');
              setStep('login');
            }}
            onFinish={() => {
              let finalName = userName;
              if (isReturningUser) {
                finalName = "Usuário Retorno";
                setUserName(finalName);
              }
              persistUser(finalName, phone, userAvatar, true);
              setIsReturningUser(true);
              // Simulate Auth Success (usually save token)
              // For simulation, we generate a stable ID for the "User" or random.
              // To make "history" work meaningfully in mock, let's persist one if returning.
              let userId = generateUUID();

              if (isReturningUser) {
                setUserName("Usuário Retorno"); // Simulated name fetch
                // Simulate a fixed ID for the returning user so we can see history if we had backend
                // userId = "fixed-returning-user-id"; 
              }

              localStorage.setItem('menux_customer_id', userId);

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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <UserProvider>
            <AppContent />
          </UserProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
