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
					<ul className={styles.initial_config_list}>
						<li>
							<label htmlFor="name">Forum name:</label>
							<input type="text" name="name" id="name" required />
							{state?.errors?.name && (
								<span>{state.errors.name}</span>
							)}
						</li>
						<li>
							<label htmlFor="description">Forum name:</label>
							<textarea name="description" id="description" required></textarea>
							{state?.errors?.description && (
								<span>{state.errors.description}</span>
							)}
						</li>
						<li>
							<label htmlFor="admin_email">Administration email:</label>
							<input type="email" name="admin_email" id="admin_email" required />
							{state?.errors?.admin_email && (
								<span>{state.errors.admin_email}</span>
							)}
						</li>
						<li>
							<label htmlFor="lang">Default language</label>
							<select name="lang"  defaultValue='en' id="lang">
								<option value="en">English</option>
								<option value="es">Español</option>
							</select>
							{state?.errors?.lang && (
								<span>{state.errors.lang}</span>
							)}
						</li>
						<li>
							<label htmlFor="theme">Default theme</label>
							<select name="theme" id="theme" defaultValue='zeeck'>
								<option value="zeeck">Zeeck</option>
							</select>
							{state?.errors?.theme && (
								<span>{state.errors.theme}</span>
							)}
						</li>
					</ul>
					<hr />
					<h2>Admin user</h2>
					<p>Register the <strong>Admin user</strong>, you can register more <strong>admin users</strong> later.</p>
					<ul className={styles.initial_config_list}>
						<li>
							<label htmlFor="name">User name:</label>
							<input type="text" name="user_name" id="user_name" required />
							{state?.errors?.user_name && (
								<span>{state.errors.user_name}</span>
							)}
						</li>
						<li>
							<label htmlFor="name">User email:</label>
							<input type="email" name="user_email" id="user_email" required />
							{state?.errors?.user_email && (
								<span>{state.errors.user_email}</span>
							)}
						</li>
						<li>
							<label htmlFor="name">User password:</label>
							<input type="email" name="user_password" id="user_password" required />
							{state?.errors?.user_password && (
								<span>{state.errors.user_password}</span>
							)}
						</li>
						<li>
							<label htmlFor="name">Confirm password:</label>
							<input type="email" name="user_password_confirmation" id="user_password_confirmation" required />
							{state?.errors?.user_password_confirmation && (
								<span>{state.errors.user_password_confirmation}</span>
							)}
						</li>
						<li className={styles.initial_config_buttons}>
							<button type="reset" aria-disabled={pending}>
								{pending ? 'Please wait...' : 'Reset'}
							</button>
							<button type="submit" aria-disabled={pending} className='button_primary'>
								{pending ? 'Saving...' : 'Save'}
							</button>
						</li>
					</ul>
				</Form>
			</section>
		</main>
	)
}