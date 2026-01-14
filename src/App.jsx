import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Onboarding from './components/Onboarding'
import Login from './components/Login'
import Register from './components/Register'
import Verification from './components/Verification'
import MenuHub from './components/MenuHub'
import StudioView from './components/StudioView'
import './index.css'

function AppContent() {
  const [step, setStep] = useState('onboarding')
  const [phone, setPhone] = useState('')
  const [userName, setUserName] = useState('')
  const [isReturningUser, setIsReturningUser] = useState(false)

  return (
    <main className="app-container">
      <AnimatePresence mode="wait">
        {step === 'onboarding' && (
          <Onboarding
            key="onboarding"
            savedUser={userName}
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
            onAuth={() => setStep('login')}
            onLogout={() => {
              setUserName('');
              setPhone('');
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
            onNext={(phoneValue) => {
              setPhone(phoneValue)

              // SIMULAÇÃO: Se o número for (11) 99999-9999, tratamos como usuário antigo
              if (phoneValue === '(11) 99999-9999') {
                setIsReturningUser(true)
                setStep('verification')
              } else {
                setIsReturningUser(false)
                if (userName) {
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
      </AnimatePresence>
    </main>
  )
}

function App() {
  return (
    <AppContent />
  )
}

export default App
