import styles from "@app/js/components/questionForm/languagesField/languagesField.module.css";
import { getLanguageFullText } from "@shared/common/Languages.ts";
import React from "react";
import { DropDownAddButton } from "@components/questionForm";

interface LanguagesFieldProps {
    isEditMode: boolean;
    languages: string[];
    selectedLanguage: string;
    selectLanguage: (language: string) => void;
    addNewLanguage: (language: string) => void;
}

const LanguagesField: React.FC<LanguagesFieldProps> = ({ isEditMode, languages, selectedLanguage, selectLanguage, addNewLanguage }) => {
    return (
        <div className={styles.languageGroup}>
            {languages.map((language, index) => {
                return (
                    <button
                        type="button"
                        className={language === selectedLanguage ? styles.languageSelectedButton : styles.languageButton}
                        key={index} onClick={() => selectLanguage(language)}>
                        {getLanguageFullText(language)}
                    </button>
                )
            })}
            {isEditMode && (
                <DropDownAddButton languages={languages} addNewLanguage={addNewLanguage} />
            )}
        </div>
    )
}

export default LanguagesField;