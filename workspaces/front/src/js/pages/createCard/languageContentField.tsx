import React, { useRef } from "react";
import ExtendedForm, { ExtendedFormField, ExtendedFormRef } from "@app/components/form/extendedField/extendedForm";
import { ACTOR_VALUES, LANGUAGES_STRING_MAP } from "@app/js/constants/card";
import { LANGUAGES } from "@app/js/constants/lang";
import { Language } from "@shared/common/Languages";
import { useImperativeHandle, useState } from "react";
import styles from "./languageContentField.module.css";
import { IoAddCircleOutline } from "react-icons/io5";
import { Actor } from "@shared/common/Cards";

interface LanguageContent {
    language: Language;
    actor: string;
    title: string;
    description: string;
}

export type LanguageContentFieldRef = {
    languageContents: () => {language: Language, actorType: Actor, actorName: string, title: string, description: string}[];
    resetLanguageContent: () => void;
}

interface LanguageContentFieldProps {}


const LanguageContentField : React.ForwardRefRenderFunction<LanguageContentFieldRef, LanguageContentFieldProps> = (props, ref) => {
    
    // Language-specific contents
    const [languageContents, setLanguageContents] = useState<LanguageContent[]>([]);
    useImperativeHandle(ref, () => {
        return {
            languageContents: () => getLanguageContents(languageContents),
            resetLanguageContent,
        };
    }, [languageContents]);

    const getLanguageContents = (languageContents: LanguageContent[]) => {
        return languageContents.map((content) => ({
            language: content.language,
            actorType: content.actor as Actor,
            actorName: ACTOR_VALUES[content.language][content.actor],
            title: content.title,
            description: content.description,
        }));
    }
    
    const getAvailableLanguages = () => {
        const usedLanguages = languageContents.map((content) => content.language);
        return LANGUAGES.filter((lang) => usedLanguages.indexOf(lang) === -1);
    }

    const getFields = (content: LanguageContent) : ExtendedFormField[] => {
        return [
            {
                fieldName: "language",
                label: "Language",
                type: "dropdown",
                options: LANGUAGES.map((lang) => ({
                    value: lang, label: LANGUAGES_STRING_MAP[lang], disabled: getAvailableLanguages().indexOf(lang) === -1
                })),
                value: content.language,
                className: {
                    wrapper: `${styles.selectWrapper}`,
                    input: `${styles.select}`,
                    dropdown: `${styles.dropdown}`
                },
                required: true,
            },
            {
                fieldName: "actor",
                label: "Actor",
                type: "dropdown",
                options: Object.entries(ACTOR_VALUES[content.language]).map(([actorKey, actorLabel]) => ({
                    value: actorKey, label: actorLabel
                })),
                value: content.actor,
                className: {
                    wrapper: `${styles.selectWrapper}`,
                    input: `${styles.select}`,
                    dropdown: `${styles.dropdown}`
                },
                required: true,
            },
            {
                fieldName: "title",
                label: "Title",
                type: "text",
                value: content.title,
                className: `${styles.input}`,
                required: true,
            },
            {
                fieldName: "description",
                label: "Descriptions",
                type: "textarea",
                value: content.description,
                className: `${styles.textarea}`,
                required: true,
            },
        ]
    }

    const addLanguageContent = () => {
        const availableLanguages = getAvailableLanguages();

        const newContent: LanguageContent = {
            language: availableLanguages[0],
            actor: "",
            title: "",
            description: "",
        }

        setLanguageContents([...languageContents, newContent]);
    }

    const removeLanguageContent = (index: number) => {
        const updatedContents = [...languageContents];
        updatedContents.splice(index, 1);
        setLanguageContents(updatedContents);
    }

    const resetLanguageContent = () => {
        setLanguageContents([]);
    }

    const getTitle = (lang: Language) => {
        switch (lang) {
            case Language.ENGLISH:
                return "English Content";
            case Language.FRENCH:
                return "Contenu en français";
            case Language.SPANISH:
                return "Contenido en español";
            case Language.GERMAN:
                return "Inhalt auf Deutsch";
            default:
                return `Content in ${LANGUAGES_STRING_MAP[lang]}`;
        }
    }

    return (
    <>
        <div className={`${styles.listLangContainer}`}>
            {languageContents.map((content, index) => 
                <ExtendedForm
                    key={index}
                    fields={getFields(content)}
                    title={getTitle(content.language)}
                    onChange={(fieldName, value) => {
                        const updatedContents = [...languageContents];
                        updatedContents[index] = { ...updatedContents[index], [fieldName]: value };
                        setLanguageContents(updatedContents);
                    }}
                    labelClassName={`${styles.label}`}
                    onCancel={() => removeLanguageContent(index)}
                />
            )}
        </div>

        {
            languageContents.length < LANGUAGES.length && (
                <button type="button" onClick={addLanguageContent} className={`${styles.addButton}`}>
                    <IoAddCircleOutline />
                    Add Language Content
                </button>
            )
        }
    </>
    )
}

export default React.forwardRef(LanguageContentField);