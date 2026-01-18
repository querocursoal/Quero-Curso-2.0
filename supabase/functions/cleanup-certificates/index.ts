import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

serve(async (req) => {
    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Fetch expired certificates
        const { data: expiredCerts, error: fetchError } = await supabaseClient
            .from('certificates')
            .select('id, storage_path')
            .lt('expires_at', new Date().toISOString())

        if (fetchError) throw fetchError

        if (!expiredCerts || expiredCerts.length === 0) {
            return new Response(JSON.stringify({ message: 'No expired certificates found' }), {
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // 2. Delete files from Storage
        const storagePaths = expiredCerts
            .map(c => c.storage_path)
            .filter(path => path !== null)

        if (storagePaths.length > 0) {
            const { error: storageError } = await supabaseClient.storage
                .from('certificates')
                .remove(storagePaths)

            if (storageError) console.error('Error deleting from storage:', storageError)
        }

        // 3. Delete records from DB
        const certIds = expiredCerts.map(c => c.id)
        const { error: deleteError } = await supabaseClient
            .from('certificates')
            .delete()
            .in('id', certIds)

        if (deleteError) throw deleteError

        return new Response(JSON.stringify({
            success: true,
            deletedCount: expiredCerts.length
        }), {
            headers: { 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }
})
