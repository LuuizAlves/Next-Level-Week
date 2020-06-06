import React from 'react'

interface HeaderProps{
    title?: String;
}

//COMPONENTES DEVEM SER EM FORMATOS DE CONSTANTE E COMEÇAR COM LETRA MAIÚSCULA
//REACT.FC É UM GENÊRICO QUE PERMITE CRIAR PROPRIEDADE
const Header:React.FC<HeaderProps> = (props) => {
    return (
        <header>
            <h1> {props.title} </h1>
        </header>
    )
}

export default Header;