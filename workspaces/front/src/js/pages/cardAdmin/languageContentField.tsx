import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
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
    resume?: string;
}

export type LanguageContentFieldRef = {
    languageContents: () => { language: Language, actorType: Actor, actorName: string, title: string, description: string, resume: string }[];
    resetLanguageContent: () => void;
    putContents: ( contents: LanguageContent[] ) => void;
}

interface LanguageContentFieldProps { 
    mode: "add" | "edit";
}


const LanguageContentField: React.ForwardRefRenderFunction<LanguageContentFieldRef, LanguageContentFieldProps> = ({
    mode
}, ref) => {
    const { t } = useTranslation("admin");

    // Language-specific contents
    const [languageContents, setLanguageContents] = useState<LanguageContent[]>([]);
    useImperativeHandle(ref, () => {
        return {
            languageContents: () => getLanguageContents(languageContents),
            resetLanguageContent,
            putContents,
        };
    }, [languageContents]);

    const getLanguageContents = (languageContents: LanguageContent[]) => {
        return languageContents.map((content) => ({
            language: content.language,
            actorType: content.actor as Actor,
            actorName: ACTOR_VALUES[content.language][content.actor],
            title: content.title,
            description: content.description,
            resume: content.resume,
        }));
    }

    const getAvailableLanguages = () => {
        const usedLanguages = languageContents.map((content) => content.language);
        return LANGUAGES.filter((lang) => usedLanguages.indexOf(lang) === -1);
    }

    const getFields = (content: LanguageContent): ExtendedFormField[] => {
        return [
            {
                fieldName: "language",
                label: t("lang_content.language", { defaultValue: "Language" }),
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
                label: t("lang_content.actor", { defaultValue: "Actor" }),
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
                label: t("lang_content.title", { defaultValue: "Title" }),
                type: "text",
                value: content.title,
                className: `${styles.input}`,
                required: true,
            },
            {
                fieldName: "description",
                label: t("lang_content.description", { defaultValue: "Description" }),
                type: "textarea",
                value: content.description,
                className: `${styles.textarea}`,
                required: true,
            },
            {
                fieldName: "resume",
                label: t("lang_content.resume", { defaultValue: "Resume" }),
                type: "textarea",
                value: content.resume,
                className: `${styles.textarea}`,
                required: false,
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
            resume: "",
        }

        setLanguageContents([...languageContents, newContent]);
    }

    const putContents = (contents: LanguageContent[]) => {
        const updatedContents = [...languageContents];
        contents.forEach((content) => {
            if (!LANGUAGES.includes(content.language)) {
                console.error(`Language ${content.language} is not supported`);
                return;
            }
    
            const languageIndex = updatedContents.findIndex((c) => c.language === content.language);
            if (languageIndex !== -1) {
                updatedContents[languageIndex] = content;
            } else {
                updatedContents.push(content);
            }
        });
        setLanguageContents(updatedContents);
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
                return t("lang_content.en_title", { defaultValue: "English Content" });
            case Language.FRENCH:
                return t("lang_content.fr_title", { defaultValue: "Contenu en français" });
            case Language.SPANISH:
                return t("lang_content.es_title", { defaultValue: "Contenido en español" });
            case Language.GERMAN:
                return t("lang_content.de_title", { defaultValue: "Inhalt auf Deutsch" });
            case Language.PORTUGUESE:
                return t("lang_content.pt_title", { defaultValue: "Conteúdo em português" });
            default:
                return t("lang_content.generic_title", { lang: LANGUAGES_STRING_MAP[lang], defaultValue: `Content in ${LANGUAGES_STRING_MAP[lang]}` });
        }
    }

    return (
        <>
            <div className={`${styles.listLangContainer}`}>
                {languageContents.map((content, index) =>
                    <ExtendedForm
                        mode={mode}
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
                        {t("lang_content.add_button", { defaultValue: "Add Language Content" })}
                    </button>
                )
            }
        </>
    )
}

export default React.forwardRef(LanguageContentField);