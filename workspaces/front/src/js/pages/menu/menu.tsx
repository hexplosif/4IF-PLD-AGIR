import MenuComponent from "@app/js/components/MenuComponent/MenuComponent";
import Header from "@app/js/components/header/Header";
import styles from './menu.module.css';
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";



function Menu() {
    return (
        <div className={styles.menuPage}>
            <Header />
            <MenuComponent />
            <BackgroundImg/>
        </div>
    );
}

export default Menu;
