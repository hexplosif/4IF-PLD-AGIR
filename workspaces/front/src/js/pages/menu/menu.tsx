import MenuComponent from "@app/js/components/MenuComponent/MenuComponent";
import Header from "@app/js/components/header/Header";
import styles from './menu.module.css';
import image from '../../../icons/Welcome_Photo.webp';



function Menu() {
    return (
        <div className={styles.menuPage}>
            <Header />
            <MenuComponent />
            <img src={image} alt="Image de la tonne de bonnes pratiques" className={styles.bgImage} />
        </div>
    );
}

export default Menu;
