import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import storage, { KEYS } from '../services/storageService';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [phone, setPhone] = useState(() => storage.get(KEYS.PHONE) || '');
    const [userName, setUserName] = useState(() => storage.get(KEYS.USER) || '');
    const [userAvatar, setUserAvatar] = useState(() => storage.get(KEYS.AVATAR) || null);
    const [isReturningUser, setIsReturningUser] = useState(() => {
        return storage.get(KEYS.IS_RETURNING) === 'true';
    });

    const persistUser = useCallback((name, phoneVal, avatar, returning) => {
        if (phoneVal) storage.set(KEYS.PHONE, phoneVal);
        if (name) storage.set(KEYS.USER, name);
        if (avatar) storage.set(KEYS.AVATAR, avatar);
        storage.set(KEYS.IS_RETURNING, returning ? 'true' : 'false');
    }, []);

    const updateProfile = useCallback((newName, newPhone) => {
        setUserName(newName);
        setPhone(newPhone);
        storage.set(KEYS.USER, newName);
        storage.set(KEYS.PHONE, newPhone);
    }, []);

    const updateAvatar = useCallback((newAvatar) => {
        setUserAvatar(newAvatar);
        storage.set(KEYS.AVATAR, newAvatar);
    }, []);

    const logout = useCallback(() => {
        setUserName('');
        setPhone('');
        setUserAvatar(null);
        setIsReturningUser(false);
        storage.clearSession();
    }, []);

    const deleteAccount = useCallback(() => {
        setUserName('');
        setPhone('');
        setUserAvatar(null);
        setIsReturningUser(false);
        storage.clearAll();
    }, []);

    const reloadFromStorage = useCallback(() => {
        setPhone(storage.get(KEYS.PHONE) || '');
        setUserName(storage.get(KEYS.USER) || '');
        setUserAvatar(storage.get(KEYS.AVATAR) || null);
        setIsReturningUser(storage.get(KEYS.IS_RETURNING) === 'true');
    }, []);

    return (
        <UserContext.Provider value={{
            phone, setPhone,
            userName, setUserName,
            userAvatar, setUserAvatar,
            isReturningUser, setIsReturningUser,
            persistUser,
            updateProfile,
            updateAvatar,
            logout,
            deleteAccount,
            reloadFromStorage,
        }}>
            {children}
        </UserContext.Provider>
    );
};
