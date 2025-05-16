import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import arrowBack from '@app/assets/icons/arrowBack.png';
import { useTranslation } from "react-i18next";

import Header from "@app/js/components/header/Header";
import { BaseCard, Best_Practice_Card, Card, CardType, Difficulty, Formation_Card, MultipleContentsBestPracticeCard, MultipleContentsCard, MultipleContentsFormationCard, Practice_Card } from "@shared/common/Cards";
import SegmentedControl from "@app/components/base/segmentedControl/segmentedControl";
import CheckboxRadioButton from "@app/components/base/checkboxRadioButton/checkboxRadioButton";

import styles from "./cardAdmin.module.css";
import { addCard, updateCard, getCardById } from "./cardApi";
import AlertPopup, { PopupType } from "@app/components/base/alertPopup/alertPopup";

import { Language } from "@shared/common/Languages";
import LanguageContentField, { LanguageContentFieldRef } from "./languageContentField";
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";
import { useNavigate, useSearchParams } from "react-router-dom";

interface CreateCardProps {}

const CreateCardPage : React.FC<CreateCardProps> = () => {
    const { t } = useTranslation("admin");
    const [ searchParams ] = useSearchParams();
    const navigate = useNavigate();
    const [ mode, setMode ] = useState<"add" | "edit">("add");
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

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
    const [carbonLoss, setCarbonLoss] = useState<number>(0);
    
    // Field for Formation only
    const [formationLink, setFormationLink] = useState<string>('');

    const languageContentsRef = useRef<LanguageContentFieldRef>(null);

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertType, setAlertType] = useState<PopupType>(PopupType.ERROR);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const newCard: MultipleContentsCard = {
                id,
                cardType,
                languageContents: languageContentsRef.current?.languageContents() ?? [],
                network_gain : networkGain,
                memory_gain : memoryGain,
                cpu_gain : cpuGain,
                storage_gain : storageGain,
                difficulty,
                carbon_loss : carbonLoss,
                linkToFormation : formationLink,
            }

            setIsLoading(true);
            setAlertMessage(t('saving_card', { defaultValue: 'Saving card...' }));
            const res = mode === 'add' ? await addCard(newCard) : await updateCard(newCard);
            setIsLoading(false);

            if (res.ok) {
                setShowAlert(true);
                setAlertMessage(mode === 'add' 
                    ? t('success_added', { defaultValue: 'Card added successfully!' })
                    : t('success_updated', { defaultValue: 'Card updated successfully!' }));
                setAlertType(PopupType.SUCCESS);
                resetForm();
                navigate('/admin/viewCard');
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
        setNetworkGain(false);
        setMemoryGain(false);
        setCpuGain(false);
        setStorageGain(false);
        setDifficulty(1);
        setCarbonLoss(0);
        setFormationLink('');

        setMode('add');
        searchParams.delete('id');
    },[]);

    useEffect(() => {
        const fetchCardData = async (cardId: string) => {
            setIsLoading(true);
            setAlertMessage(t('loading_card', { defaultValue: 'Loading card data...' }));
            try {
                const response = await getCardById(cardId);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || t('fetch_failed', { defaultValue: 'Failed to fetch card' }));
                }

                const cardData = await response.json() as MultipleContentsCard;
                console.log(cardData);
                    
                // Populate form fields with card data
                setCardType(cardData.cardType);
                setId(cardData.id.toString());
                
                // For BestPractice and BadPractice cards
                if (cardData.cardType === 'BestPractice' || cardData.cardType === 'BadPractice') {
                    const _cardData = cardData as MultipleContentsBestPracticeCard;
                    setNetworkGain(_cardData.network_gain || false);
                    setMemoryGain(_cardData.memory_gain || false);
                    setCpuGain(_cardData.cpu_gain || false);
                    setStorageGain(_cardData.storage_gain || false);
                    setDifficulty(_cardData.difficulty || 1);
                }
                
                // For BestPractice only
                if (cardData.cardType === 'BestPractice') {
                    const _cardData = cardData as MultipleContentsBestPracticeCard;
                    setCarbonLoss(_cardData.carbon_loss || 0);
                }
                
                // For Formation only
                if (cardData.cardType === 'Formation') {
                    const _cardData = cardData as MultipleContentsFormationCard;
                    setFormationLink(_cardData.linkToFormation || '');
                }
                
                // Set language contents
                if (languageContentsRef.current) {
                    languageContentsRef.current.putContents(
                        cardData.languageContents.map((content) => ({
                            language: content.language,
                            actor: content.actorType,
                            title: content.title,
                            description: content.description,
                        })
                    ));
                }

                setMode('edit');

            } catch (error) {
                console.error(error);
                setShowAlert(true);
                setAlertMessage(error instanceof Error ? error.message : t('fetch_failed', { defaultValue: 'Failed to fetch card' }));
                setAlertType(PopupType.ERROR);
                setMode('add');
            } finally {
                setIsLoading(false);
            }
        }

        const cardId = searchParams.get('id');
        if (cardId) {
            fetchCardData(cardId);
        }
    }, [t]);

    useEffect(() => {
        if (isLoading) {
            setShowAlert(true);
            setAlertType(PopupType.LOADING);
        } else {
            setShowAlert(false);
        }
    }, [isLoading]);

    return (
        <div className={styles.container}>
            <Header /> 
            <div className={styles.floatingContainer}>
                <div className={styles.returnToPreviousPage} onClick={() => navigate('/admin/viewCard')}>
                    <img src={arrowBack}/>
                    <span>{t('card-admin.back')}</span>
                </div>
                <h2 className={`${styles.title} text-reset`}>
                    {mode === "add" ? t('card-admin.title-create') : t('card-admin.title-update')}
                </h2>
                <form className={`${styles.cardForm}`} onSubmit={handleSubmit}>
                    {/* Card Type Selector */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('card-admin.card-type')}</label>
                        <SegmentedControl 
                            disabled={mode === 'edit'}
                            values={['Expert', 'BestPractice', 'BadPractice', 'Formation']}
                            selectedValue={cardType}
                            onSelect={(value) => setCardType(value as CardType) }
                        />
                    </div>

                    {/* Common Fields for All Card Types */}
                    <div className={styles.formGroup}>
                        <label htmlFor="id" className={styles.label}>{t('card-admin.id')}</label>
                        <input id="id" type="number" className={styles.input} required
                            value={id} onChange={(e) => setId(e.target.value)}
                            disabled={mode === 'edit'}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('card-admin.language-content')}</label>
                        <LanguageContentField mode={mode} ref={languageContentsRef}/>
                    </div>

                    {/* Field for BestPractice only */}
                    {cardType === 'BestPractice' && (
                        <div className={styles.formGroup}>
                            <label htmlFor="carbonLoss" className={styles.label}>{t('card-admin.carbon-loss')}</label>
                            <input id="carbonLoss" type="number" className={styles.input} required
                                value={carbonLoss} onChange={(e) => setCarbonLoss(Number.parseInt(e.target.value))}
                            />
                        </div>
                    )}

                    {/* Field for Formation only */}
                    {cardType === 'Formation' && (
                        <div className={styles.formGroup}>
                            <label htmlFor="formationLink" className={styles.label}>{t('card-admin.formation-link')}</label>
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
                                <label className={styles.label}>{t('card-admin.gains')}</label>
                                <div className={styles.checkboxGroup}>
                                    <CheckboxRadioButton 
                                        type="checkbox" id="networkGain" label={t('card-admin.network-gain')}
                                        checked={networkGain} onChange={setNetworkGain}
                                    />

                                    <CheckboxRadioButton 
                                        type="checkbox" id="memoryGain" label={t('card-admin.memory-gain')}
                                        checked={memoryGain} onChange={setMemoryGain}
                                    />

                                    <CheckboxRadioButton 
                                        type="checkbox" id="cpuGain" label={t('card-admin.cpu-gain')}
                                        checked={cpuGain} onChange={setCpuGain}
                                    />
                                    <CheckboxRadioButton 
                                        type="checkbox" id="storageGain" label={t('card-admin.storage-gain')}
                                        checked={storageGain} onChange={setStorageGain}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('card-admin.difficulty-level')}</label>
                                <div className={styles.radioGroup}>
                                    {([1, 2, 3, 4]).map((level) => (
                                        <CheckboxRadioButton
                                            key={level} type="radio" id={`difficulty-${level}`}
                                            label={t('card-admin.difficulty', { level })} name="difficulty"
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
                            <FiX /> {t('card-admin.buttons.reset')}
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            <FiSave /> {t('card-admin.buttons.save')}
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
