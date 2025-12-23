import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdmin() {
  const email = 'admin@mybox.eco'
  const password = 'admin123'

  console.log('Creating admin user...')

  // Create user via Admin API
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (createError) {
    if (createError.message.includes('already been registered')) {
      console.log('User already exists, updating role...')
    } else {
      console.error('Error creating user:', createError.message)
      process.exit(1)
    }
  } else {
    console.log('User created:', user.user?.id)
  }

  // Update role to admin
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('email', email)

  if (updateError) {
    console.error('Error updating role:', updateError.message)
    process.exit(1)
  }

  console.log('Admin user ready!')
  console.log('Email:', email)
  console.log('Password:', password)
}

createAdmin()
