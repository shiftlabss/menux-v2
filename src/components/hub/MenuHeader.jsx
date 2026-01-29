import React from 'react';
const imgLogo = "/logo-menux.svg";

export default function MenuHeader({ userName, userAvatar, activeOrderCode, onProfileClick, onMyOrdersClick, onAuth }) {
    return (
        <header className="menu-header">
            <img src={imgLogo} alt="Menux" style={{ height: '20px' }} />
            <div className="header-right">
                {userName && (
                    <div className="profile-trigger">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span style={{ fontSize: '12px' }}>{userName[0].toUpperCase()}</span>
                        )}
                    </div>
                )}
                {activeOrderCode && (
                    <button className="btn-my-orders-active" onClick={onMyOrdersClick}>
                        Pedidos
                    </button>
                )}
                <button className="btn-profile-short" onClick={() => userName ? onProfileClick() : onAuth()}>
                    {userName ? "Meu perfil" : "Entrar"}
                </button>
            </div>
        </header>
    );
}
