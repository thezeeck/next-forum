'use server'
import { redirect } from 'next/navigation';
import { InitialConfigurationFormState, InitialConfigurationSchema, InitialFormData } from './schema';
import { setForumConfig } from '@/lib/getConfig';
 
export async function saveInitialConfiguration(state: InitialConfigurationFormState, formData: FormData): Promise<InitialConfigurationFormState> {
  const validationResult = InitialConfigurationSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    admin_email: formData.get('admin_email'),
    lang: formData.get('lang'),
    theme: formData.get('theme'),
    logo: formData.get('logo'),
  });

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;

    if (!errors.logo) errors.logo = undefined;

    return {
      errors,
    }
  }

  await setForumConfig(validationResult.data as InitialFormData);

  redirect(`/`);
}