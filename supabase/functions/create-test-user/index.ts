import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Test user credentials
    const testUserEmail = 'test@example.com'
    const testUserPassword = 'test123456'
    
    // Cashier user credentials
    const cashierEmail = 'cashier@example.com'
    const cashierPassword = 'cashier123456'

    // First check if test user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const testUserExists = existingUsers?.users?.some(u => u.email === testUserEmail)
    const cashierExists = existingUsers?.users?.some(u => u.email === cashierEmail)

    let testUserId = null
    let cashierUserId = null

    // Create test user if not exists
    if (!testUserExists) {
      console.log('Creating test user...')
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email: testUserEmail,
        password: testUserPassword,
        email_confirm: true,
        user_metadata: { full_name: 'Test User' }
      })

      if (createError) {
        console.log('Error creating test user:', createError.message)
      } else {
        testUserId = userData.user.id
        console.log('Test user created:', testUserId)
        
        // Assign user role
        await supabase.from('user_roles').insert({ user_id: testUserId, role: 'user' })
        
        // Add some initial points
        await supabase.from('profiles').update({ points_balance: 2500, must_change_password: false }).eq('user_id', testUserId)
      }
    } else {
      const existingUser = existingUsers?.users?.find(u => u.email === testUserEmail)
      testUserId = existingUser?.id
      console.log('Test user already exists:', testUserId)
    }

    // Create cashier if not exists
    if (!cashierExists) {
      console.log('Creating cashier user...')
      const { data: cashierData, error: cashierError } = await supabase.auth.admin.createUser({
        email: cashierEmail,
        password: cashierPassword,
        email_confirm: true,
        user_metadata: { full_name: 'Cashier User' }
      })

      if (cashierError) {
        console.log('Error creating cashier:', cashierError.message)
      } else {
        cashierUserId = cashierData.user.id
        console.log('Cashier created:', cashierUserId)
        
        // Assign cashier role
        await supabase.from('user_roles').insert({ user_id: cashierUserId, role: 'cashier' })
        
        // Mark password as not needing change
        await supabase.from('profiles').update({ must_change_password: false }).eq('user_id', cashierUserId)
      }
    } else {
      const existingCashier = existingUsers?.users?.find(u => u.email === cashierEmail)
      cashierUserId = existingCashier?.id
      console.log('Cashier already exists:', cashierUserId)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Test users ready',
        testUser: { email: testUserEmail, password: testUserPassword },
        cashier: { email: cashierEmail, password: cashierPassword }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error('Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
