import React from 'react';
const imgLogo = "/logo-menux.svg";

export default function MenuHeader({ userName, userAvatar, activeOrderCode, onProfileClick, onMyOrdersClick, onAuth }) {
    return (
        <header className="menu-header">
            <img src={imgLogo} alt="Menux" className="menu-header-logo" />
            <div className="header-right">
                {userName && (
                    <div className="profile-trigger">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt="Profile"
                                className="profile-avatar-img"
                            />
                        ) : (
                            <span className="profile-initial">{userName[0].toUpperCase()}</span>
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
