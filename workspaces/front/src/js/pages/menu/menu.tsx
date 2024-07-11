import React from 'react';
import MenuComponent from "@app/js/components/MenuComponent/MenuComponent";
import Header from "@app/js/components/header/Header";
import styles from './menu.module.css'; 
import image from '../../../icons/Welcome_Photo.webp';



function Menu() {
    return (
        <div className={styles.container}>
            <Header /> 
            <div className={styles.content}>
                <div className={styles.imageContainer}>
                    <img src={image} alt="Image de la tonne de bonnes pratiques" className={styles.image} />
                </div>
                <div className={styles.menuContainer}>
                    <MenuComponent />
                </div>
            </div>
        </div>
    );
}

export default Menu;
