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
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    }
  }

  const response = await setForumConfig(validationResult.data as InitialFormData);



  console.log('response', response);
  
  // const data = {
  //   name: na
  // }

  redirect(`/`)
}