import React, { useEffect, useRef, useState } from "react";
import styles from "@components/questionForm/dropDownAddButton/dropDownAddButton.module.css";
import { FiPlus } from "react-icons/fi";
import { LANGUAGES_INFO } from "@app/js/constants/lang.ts";
import { Language } from "@shared/common/Languages.ts";

interface DropDownAddButtonProps {
    languages: string[];
    addNewLanguage: (language: string) => void;
}

const DropDownAddButton: React.FC<DropDownAddButtonProps> = ({ languages, addNewLanguage }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOptionClick = (option: string) => {
        addNewLanguage(option.toLowerCase().trim());
        setOpen(false);
    };

    const allLanguagesAdded = Object.values(LANGUAGES_INFO).every(lang =>
        languages.includes(lang.code.toLowerCase().trim())
    );

    return (
        <div ref={dropdownRef} style={{position: 'relative', display: 'inline-block'}}>
            {!allLanguagesAdded && (
                <>
                    <button
                        type="button"
                        className={styles.languageButton}
                        onClick={() => setOpen(!open)}>
                        <FiPlus style={{marginTop: "0.5rem"}}/>
                    </button>
                    {open && !allLanguagesAdded && (
                        <div className={styles.dropContainer}>
                            {Object.keys(LANGUAGES_INFO).map((lang) => {
                                const langueInfo = LANGUAGES_INFO[lang as Language];
                                if (langueInfo && !(languages.includes(langueInfo.code.toLowerCase().trim()))) {
                                    return (
                                        <div key={langueInfo.code} className={styles.dropItem} onClick={() => handleOptionClick(langueInfo.code)} >
                                            {`${langueInfo.name} (${langueInfo.code})`}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default DropDownAddButton;