import React, { ReactNode, useImperativeHandle, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import styles from "./extendedForm.module.css";
import { Select } from "@mantine/core";

type DropdownOption = {
	value: string;
	label: string;
	disabled?: boolean;
}

export type ExtendedFormField = {
	fieldName: string; // Field name to be used in onChange callback
	id?: string;
	label: string;
	value: string;
	type: "text" | "number" | "dropdown" | "textarea";
	required?: boolean;
	disabled?: boolean;
	placeholder?: string;
	className?: any;

	// Dropdown options
	options?: DropdownOption[];
};

interface ExtendedFormProps {
	mode: "add" | "edit";
	fields: ExtendedFormField[];
	renderField?: (field: ExtendedFormField, onChange: (value: string) => void) => ReactNode;

	// Header content and basic info
	title: string;
	subtitle?: string;

	// Control props
	isInitiallyExpanded?: boolean;
	isCompleted?: boolean;
	
	// Callbacks
	onEdit?: () => void;
	onAdd?: () => void;
	onCancel?: () => void;
	onChange: (fieldId: string, value: string) => void;
	onToggle?: (isExpanded: boolean) => void;
	
	// Action buttons
	actions?: ReactNode;
	
	// Styling
	className?: string;
	headerClassName?: string;
	contentClassName?: string;
	labelClassName?: string;
}

export type ExtendedFormRef = {
	toggleExtended: () => void;
	closeExtended: () => void;
	openExtended: () => void;
}

const ExtendedForm: React.ForwardRefRenderFunction<ExtendedFormRef, ExtendedFormProps> = ({
	mode,
	fields,
	renderField,
	title,
	subtitle,
	isInitiallyExpanded = false,
	isCompleted = false,
	onEdit,
	onAdd,
	onCancel,
	onChange,
	onToggle,
	actions,
	className = "",
	headerClassName = "",
	contentClassName = "",
	labelClassName = "",
}, ref) => {
	const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

	useImperativeHandle(ref, () => ({
		toggleExtended: handleToggle,
		closeExtended: closeExtended,
		openExtended: openExtended,
	}), [isExpanded]);

	const handleToggle = () => {
		// Only allow toggling if completed or if it's already expanded
		const newExpandedState = !isExpanded;
		setIsExpanded(newExpandedState);
		onToggle?.(newExpandedState);
	};

	const closeExtended = () => {
		setIsExpanded(false);
		onToggle?.(false);
	}

	const openExtended = () => {
		setIsExpanded(true);
		onToggle?.(true);
	}

	const handleAdd = () => {
		setIsExpanded(false);
		onAdd?.();
	};

	const handleEdit = () => {
		setIsExpanded(false);
		onEdit?.();
	};

	const handleCancel = () => {
		setIsExpanded(false);
		onCancel?.();
	};

	const handleFieldChange = (fieldId: string, value: string) => {
		onChange(fieldId, value);
	};

	const renderDefaultField = (field: ExtendedFormField) => {
		const handleChange = (value: string) => {
			handleFieldChange(field.fieldName, value);
		};

		if (field.type == "dropdown" && !field.options) {
			throw new Error("Dropdown field must have options");
		}

		switch (field.type) {
			case "dropdown":
				return (
					<Select classNames={field.className} id={field.id}
						data={field.options} placeholder={field.placeholder}
						value={field.value} onChange={handleChange}
						disabled={field.disabled} required={field.required} searchable
						comboboxProps={{ shadow: 'md' }}
					/>
				);
			case "textarea":
				return (
					<textarea placeholder={field.placeholder} rows={5} className={field.className} id={field.id}
						value={field.value} onChange={(e) => handleChange(e.target.value)}
						required={field.required} disabled={field.disabled}
					/>
				);
			case "number":
				return (
					<input className={field.className} id={field.id}
						type="number" placeholder={field.placeholder} required={field.required} disabled={field.disabled}
						value={field.value} onChange={(e) => handleChange(e.target.value)}
					/>
				);
			case "text":
			default:
				return (
					<input className={field.className} id={field.id}
						type="text" required={field.required} disabled={field.disabled} placeholder={field.placeholder}
						value={field.value} onChange={(e) => handleChange(e.target.value)}
					/>
				);
		}
	};

	return (
		<div className={`${styles.extendedForm} ${className} ${isExpanded ? styles.expanded : ''}`}>
			<button className={`${styles.extendedFormHeader} button-reset ${headerClassName} ${isCompleted ? styles.completed : ''}`} 
				onClick={handleToggle} type="button"
			>
				<div className={styles.headerContent}>
					<h3 className={styles.title}>{title}</h3>
					{subtitle && <p className={styles.subtitle}>{subtitle}</p>}
				</div>
				<div className={styles.headerChevron}>
					{isExpanded ? <FiChevronUp /> : <FiChevronDown />}
				</div>
			</button>

			<div className={`${styles.extendedFormContent} ${contentClassName}`}>
				<div className={styles.formFields}>
					{fields.map((field) => (
						<div key={field.fieldName} className={`${styles.formField}`}>
							<label htmlFor={field.id} className={`${styles.fieldLabel} ${labelClassName}`}>
								{field.label}
								{/* {field.required && <span className={styles.requiredAsterisk}>*</span>} */}
							</label>
							{renderField 
								? renderField(field, (value) => handleFieldChange(field.id, value))
								: renderDefaultField(field)
							}
						</div>
					))}
				</div>
				<div className={styles.formActions}>
					{actions || (
						<>
							{
								mode === "add" ? 
								( 	<button type="button" className={styles.addButton} onClick={handleAdd}>
										Add
									</button>	
								) 
								: ( <button type="button" className={styles.addButton} onClick={handleEdit}>
										Edit
									</button>
								)
							}	
							<button type="button" className={styles.cancelButton} onClick={handleCancel}>
								Delete
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default React.forwardRef(ExtendedForm);