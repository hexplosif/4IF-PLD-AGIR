import image from '@app/assets/images/background-image.jpg';
import styles from './BackgroundImg.module.css'

function BackgroundImg () {
    return <img src={image} alt="Image de la tonne de bonnes pratiques" className={`${styles.bgImage}`} />
}

export default BackgroundImg;