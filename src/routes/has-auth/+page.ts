
import type { PageLoad } from './$types'
import { createBrowserClient, isBrowser, parse } from '@supabase/ssr'

const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseKEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const load: PageLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth')

    const supabase = createBrowserClient(supabaseURL, supabaseKEY, {
        global: {
        fetch,
        },
        cookies: {
            get(key) {
            
                return JSON.stringify(data.session)
                
            },
        },
    })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    return { supabase, session }
}