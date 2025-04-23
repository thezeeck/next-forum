'use client'

import Form from 'next/form';
import { saveInitialConfiguration } from './actions'; 
import { useActionState } from 'react';
import styles from './styles.module.css';

export const SetInitialConfiguration = () => {
	const [state, action, pending] = useActionState(saveInitialConfiguration, undefined);

	return (
		<main className={styles.initial_config}>
			<section className={styles.initial_config__container}>
				<h1>Welcome to Next forum</h1>
				<p>We need some information about your project before start.</p>
				<Form action={action}>
					<label htmlFor="name">Forum name:</label>
					<input type="text" name="name" id="name" required />
					{state?.errors?.name && (
						<span>{state.errors.name}</span>
					)}

					<label htmlFor="description">Forum name:</label>
					<textarea name="description" id="description" required></textarea>
					{state?.errors?.description && (
						<span>{state.errors.description}</span>
					)}

					<label htmlFor="admin_email">Administration email:</label>
					<input type="email" name="admin_email" id="admin_email" required />
					{state?.errors?.admin_email && (
						<span>{state.errors.admin_email}</span>
					)}
					
					<label htmlFor="lang">Default language</label>
					<select name="lang"  defaultValue='en' id="lang">
						<option value="en">English</option>
						<option value="es">Español</option>
					</select>
					{state?.errors?.lang && (
						<span>{state.errors.lang}</span>
					)}
					
					<label htmlFor="theme">Default theme</label>
					<select name="theme" id="theme" defaultValue='zeeck'>
						<option value="zeeck">Zeeck</option>
					</select>
					{state?.errors?.theme && (
						<span>{state.errors.theme}</span>
					)}

					<button type="reset" aria-disabled={pending}>
						{pending ? 'Please wait...' : 'Reset'}
					</button>
					<button type="submit" aria-disabled={pending}>
						{pending ? 'Saving...' : 'Save'}
					</button>
				</Form>
			</section>
		</main>
	)
}