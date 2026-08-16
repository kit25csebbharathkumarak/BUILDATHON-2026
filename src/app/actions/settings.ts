'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function savePreferences(prevState: any, formData: FormData) {
  try {
    const preferences = {
      emailNotifications: formData.get('emailNotifications') === 'on',
      smsNotifications: formData.get('smsNotifications') === 'on',
      darkMode: formData.get('darkMode') === 'on',
      highContrast: formData.get('highContrast') === 'on'
    }

    const cookieStore = await cookies()
    cookieStore.set('user-preferences', JSON.stringify(preferences), { maxAge: 60 * 60 * 24 * 365 })

    revalidatePath('/dashboard/settings')
    return { success: 'Preferences saved successfully' }
  } catch (error) {
    return { error: 'Failed to save preferences' }
  }
}
