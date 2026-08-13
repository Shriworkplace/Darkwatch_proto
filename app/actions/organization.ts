'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addOrganization(formData: FormData) {
  const supabase = await createClient()
  
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) return { success: false, error: 'Not authenticated' }

  const name = formData.get('name') as string
  const domain = formData.get('domain') as string

  if (!name || !domain) {
    return { success: false, error: 'Name and domain are required' }
  }

  const { error } = await supabase.from('organizations').insert({
    user_id: user.id,
    name,
    domain
  })

  if (error) {
    console.error(error)
    return { success: false, error: 'Failed to add organization.' }
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}
