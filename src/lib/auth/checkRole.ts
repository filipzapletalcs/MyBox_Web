import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

type UserRole = Database['public']['Enums']['user_role']

/**
 * Check if user has required role for authorization
 * @param supabase - Supabase client instance
 * @param userId - User ID from auth
 * @param requiredRoles - Array of allowed roles (default: admin, editor)
 * @returns Object with hasRole boolean and user's role
 */
export async function checkUserRole(
  supabase: SupabaseClient<Database>,
  userId: string,
  requiredRoles: UserRole[] = ['admin', 'editor']
): Promise<{ hasRole: boolean; role: UserRole | null }> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !profile?.role) {
    return { hasRole: false, role: null }
  }

  return {
    hasRole: requiredRoles.includes(profile.role),
    role: profile.role
  }
}

/**
 * Shorthand to check if user is admin
 */
export async function isAdmin(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<boolean> {
  const { hasRole } = await checkUserRole(supabase, userId, ['admin'])
  return hasRole
}

/**
 * Shorthand to check if user is editor or admin
 */
export async function isEditorOrAdmin(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<boolean> {
  const { hasRole } = await checkUserRole(supabase, userId, ['admin', 'editor'])
  return hasRole
}
