'use client';

import { useState } from 'react';

interface UseFormOptions<T> {
	initialValues: T;
	validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export function useForm<T extends Record<string, any>>({
	initialValues,
	validate,
}: UseFormOptions<T>) {
	const [values, setValues] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
	const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const setValue = (name: keyof T, value: any) => {
		setValues((prev) => ({ ...prev, [name]: value }));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const setFieldTouched = (name: keyof T, isTouched: boolean = true) => {
		setTouched((prev) => ({ ...prev, [name]: isTouched }));
	};

	const validateForm = (): boolean => {
		if (!validate) return true;

		const validationErrors = validate(values);
		setErrors(validationErrors);

		return Object.keys(validationErrors).length === 0;
	};

	const handleSubmit = (onSubmit: (values: T) => void | Promise<void>) => {
		return async (e: React.FormEvent) => {
			e.preventDefault();
			setIsSubmitting(true);

			// Mark all fields as touched
			const allTouched = Object.keys(values).reduce(
				(acc, key) => ({ ...acc, [key]: true }),
				{}
			);
			setTouched(allTouched);

			if (validateForm()) {
				try {
					await onSubmit(values);
				} catch (error) {
					console.error('Form submission error:', error);
				}
			}

			setIsSubmitting(false);
		};
	};

	const resetForm = () => {
		setValues(initialValues);
		setErrors({});
		setTouched({});
		setIsSubmitting(false);
	};

	return {
		values,
		errors,
		touched,
		isSubmitting,
		setValue,
		setFieldTouched,
		validateForm,
		handleSubmit,
		resetForm,
	};
}
