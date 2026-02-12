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
import { onMessageListener, requestForToken } from './services/firebaseConfig'
import { useToast } from './context/ToastContext'
import otpService from './services/otpService'

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
  const { showToast } = useToast();

  useEffect(() => {
    if (step === 'onboarding') {
      reloadFromStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    // requestForToken(); // Removed: Token is now requested on login
    onMessageListener().then(payload => {
      console.log('Message received. ', payload);
      if (payload && payload.notification) {
        showToast(`${payload.notification.title}: ${payload.notification.body}`);
      }
    }).catch(err => console.log('failed: ', err));
  }, []);

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
            // onLogout={() => { logout(); setStep('onboarding'); }}
            // onLogout={() => { logout(); setStep('onboarding'); }}
            onDeleteAccount={() => { deleteAccount(); setStep('onboarding'); }}
            onLogout={() => {
              logout();
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
            // onNext={(phoneValue) => {
            //   setPhone(phoneValue)

            //   if (phoneValue === '(11) 99999-9999') {
            onNext={(phoneValue, customer) => {
              setPhone(phoneValue)

              if (customer && customer.name) {
                setUserName(customer.name)
                setIsReturningUser(true)
              } else {
                setIsReturningUser(false)
                setUserName('')
              }
              // Always go to register step to confirm name and trigger OTP flow
              setStep('register')
            }}
          />
        )}

        {step === 'register' && (
          <Register
            key="register"
            phone={phone}
            initialName={userName}
            onBack={() => setStep('login')}
            onNext={async (nameValue) => {
              setUserName(nameValue)
              // Authentication happens in Verification step
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
            onFinish={async () => {
              try {
                const { authService } = await import('./services/authService');
                const restaurantId = import.meta.env.VITE_RESTAURANT_ID || "UUID_DO_RESTAURANTE";
                await authService.loginOrRegister({
                  phone,
                  restaurantId,
                  name: userName
                });

                let finalName = userName;
                if (isReturningUser) {
                  finalName = "Usuário Retorno"; // Or keep existing name if available
                  // Actually userName should be set from Login for returning users
                }

                // Persist user context
                persistUser(userName, phone, userAvatar, true);
                setIsReturningUser(true);

                setStep('hub');
              } catch (e) {
                console.error("Auth failed after verification", e);
                showToast("Erro na autenticação. Tente novamente.", 'error');
              }
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
