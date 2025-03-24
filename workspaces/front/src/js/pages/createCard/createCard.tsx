import React, { useCallback, useRef, useState } from "react";
import { FiSave, FiX } from "react-icons/fi";

import Header from "@app/js/components/header/Header";
import { CardType, Difficulty } from "@shared/common/Cards";
import SegmentedControl from "@app/components/base/segmentedControl/segmentedControl";
import CheckboxRadioButton from "@app/components/base/checkboxRadioButton/checkboxRadioButton";

import styles from "./createCard.module.css";
import { addCard } from "./cardApi";
import AlertPopup, { PopupType } from "@app/components/base/alertPopup/alertPopup";

import { Language } from "@shared/common/Languages";
import LanguageContentField, { LanguageContentFieldRef } from "./languageContentField";
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";

interface CreateCardProps {}

const CreateCardPage : React.FC<CreateCardProps> = () => {
    // Fields for all cards
    const [cardType, setCardType] = useState<CardType>('BestPractice');
    const [id, setId] = useState<string>('');
    
    // Fields for BestPractice and BadPractice
    const [networkGain, setNetworkGain] = useState<boolean>(false);
    const [memoryGain, setMemoryGain] = useState<boolean>(false);
    const [cpuGain, setCpuGain] = useState<boolean>(false);
    const [storageGain, setStorageGain] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<Difficulty>(1);
    
    // Field for BestPractice only
    const [carbonLoss, setCarbonLoss] = useState<string>('');
    
    // Field for Formation only
    const [formationLink, setFormationLink] = useState<string>('');

    // State for new language selection
    const [selectedNewLanguage, setSelectedNewLanguage] = useState<Language | "">("");
    const [showLanguageSelector, setShowLanguageSelector] = useState<boolean>(false);

    const languageContentsRef = useRef<LanguageContentFieldRef>(null);

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertType, setAlertType] = useState<PopupType>(PopupType.ERROR);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const res = await addCard({
                id,
                cardType,
                languageContents: languageContentsRef.current?.languageContents() ?? [],
                network_gain : networkGain,
                memory_gain : memoryGain,
                cpu_gain : cpuGain,
                storage_gain : storageGain,
                difficulty,
                carbon_loss : Number.parseInt(carbonLoss),
                linkToFormation : formationLink,
            });

            console.log(res);
            
            if (res.ok) {
                setShowAlert(true);
                setAlertMessage('Card created successfully!');
                setAlertType(PopupType.SUCCESS);
                resetForm();
            } else {
                const error = await res.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error(error);
            setShowAlert(true);
            setAlertMessage(''+ (error instanceof Error ? error.message : error));
            setAlertType(PopupType.ERROR);
        }
    };

    const resetForm = useCallback(() => {
        setCardType('BestPractice');
        setId('');
        // setLanguageContents([]);
        // setAvailableLanguages(LANGUAGES);
        setNetworkGain(false);
        setMemoryGain(false);
        setCpuGain(false);
        setStorageGain(false);
        setDifficulty(1);
        setCarbonLoss('');
        setFormationLink('');
    },[]);

    return (
        <div className={styles.container}>
            <Header /> 
            <div className={styles.floatingContainer}>
                <h2 className={`${styles.title} text-reset`}>Create card</h2>
                <form className={`${styles.cardForm}`} onSubmit={handleSubmit}>
                    {/* Card Type Selector */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Card Type</label>
                        <SegmentedControl 
                            values={['Expert', 'BestPractice', 'BadPractice', 'Formation']}
                            selectedValue={cardType}
                            onSelect={(value) => setCardType(value as CardType) }
                        />
                    </div>

                    {/* Common Fields for All Card Types */}
                    <div className={styles.formGroup}>
                        <label htmlFor="id" className={styles.label}>ID</label>
                        <input id="id" type="number" className={styles.input} required
                            value={id} onChange={(e) => setId(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Language Content</label>
                        <LanguageContentField ref={languageContentsRef}/>
                    </div>

                    {/* Field for BestPractice only */}
                    {cardType === 'BestPractice' && (
                        <div className={styles.formGroup}>
                            <label htmlFor="carbonLoss" className={styles.label}>Carbon Loss</label>
                            <input id="carbonLoss" type="text" className={styles.input} required
                                value={carbonLoss} onChange={(e) => setCarbonLoss(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Field for Formation only */}
                    {cardType === 'Formation' && (
                        <div className={styles.formGroup}>
                            <label htmlFor="formationLink" className={styles.label}>Link to Formation</label>
                            <input id="formationLink" type="url" className={styles.input} required
                                value={formationLink} onChange={(e) => setFormationLink(e.target.value)}
                                placeholder="https://example.com/formation"  
                            />
                        </div>
                    )}

                    {/* BestPractice and BadPractice Fields */}
                    {(cardType === 'BestPractice' || cardType === 'BadPractice') && (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Gains</label>
                                <div className={styles.checkboxGroup}>
                                    <CheckboxRadioButton 
                                        type="checkbox" id="networkGain" label="Network Gain"
                                        checked={networkGain} onChange={setNetworkGain}
                                    />

                                    <CheckboxRadioButton 
                                        type="checkbox" id="memoryGain" label="Memory Gain"
                                        checked={memoryGain} onChange={setMemoryGain}
                                    />

                                    <CheckboxRadioButton 
                                        type="checkbox" id="cpuGain" label="CPU Gain"
                                        checked={cpuGain} onChange={setCpuGain}
                                    />
                                    <CheckboxRadioButton 
                                        type="checkbox" id="storageGain" label="Storage Gain"
                                        checked={storageGain} onChange={setStorageGain}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Difficulty Level</label>
                                <div className={styles.radioGroup}>
                                    {([1, 2, 3, 4]).map((level) => (
                                        <CheckboxRadioButton
                                            key={level} type="radio" id={`difficulty-${level}`}
                                            label={`Level ${level}`} name="difficulty"
                                            checked={difficulty === level}
                                            onChange={() => setDifficulty(level)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className={styles.formActions}>
                        <button type="button" className={styles.resetButton} onClick={resetForm}>
                            <FiX /> Reset
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            <FiSave /> Save Card
                        </button>
                    </div>
                </form>
            </div>

            <BackgroundImg/>

            <AlertPopup
                type={alertType}
                message={alertMessage}
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
            />
        </div>
    );
}

export default CreateCardPage;
