import React from 'react';
import styles from './PopUp.module.css';

interface ExportPopupProps {
  onClose: () => void;
  onSubmit: (filename: string, format: string) => void;
  userId: string | null; 
}


const ExportPopup: React.FC<ExportPopupProps> = ({ onClose, onSubmit, userId }) => {


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('[Popup] Form data:', formData.get('filename'), formData.get('format'), 'UserId:', userId);
    onSubmit(formData.get('filename') as string, formData.get('format') as string);
    onClose(); // Close the popup after submission
  };
    //TODO: faire en sorte que tant que pop up ouvert, ne peut pas interragir avec le reste de la page/tableau derrière
    // et que cliquer hors du pop le ferme 
  
    return (
      <div className={styles.popup}>
        <form onSubmit={handleSubmit}>
          <input type="text" name="filename" placeholder="Nom du fichier exporter" required />

          <select name="format">
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
          </select>
          <button className={styles.popupButton} type="submit">Export</button>
        </form>
      </div>
    );
  };
  
  export default ExportPopup;