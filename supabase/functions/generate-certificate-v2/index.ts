import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1?dts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { certificate_id } = await req.json()

        if (!certificate_id) {
            throw new Error('Certificate ID is required')
        }

        // 1. Fetch certificate details
        const { data: cert, error: certError } = await supabaseClient
            .from('certificates')
            .select(`
        *,
        student_profiles (full_name),
        courses (name, workload, cert_template_url, cert_signature_url, cert_professor_name)
      `)
            .eq('id', certificate_id)
            .single()

        if (certError || !cert) {
            throw new Error(`Certificate not found: ${certError?.message}`)
        }

        const studentName = cert.student_profiles.full_name
        const courseName = cert.courses.name
        const workload = cert.courses.workload
        const issueDate = new Date(cert.issue_date).toLocaleDateString('pt-BR')
        const templatePath = cert.courses.cert_template_url
        const signaturePath = cert.courses.cert_signature_url
        const professorName = cert.courses.cert_professor_name

        // 2. Load Template
        const templateResponse = await fetch(templatePath)
        if (!templateResponse.ok) throw new Error('Failed to download template')
        const templateBytes = await templateResponse.arrayBuffer()

        // 3. Create PDF
        const pdfDoc = await PDFDocument.create()
        const templateImage = await pdfDoc.embedJpg(templateBytes) // Assuming JPG for now, can be PNG
        const page = pdfDoc.addPage([templateImage.width, templateImage.height])

        page.drawImage(templateImage, {
            x: 0,
            y: 0,
            width: templateImage.width,
            height: templateImage.height,
        })

        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)

        // Helper to center text
        const drawCenteredText = (text: string, y: number, size: number, font: any, color = rgb(0, 0, 0)) => {
            const textWidth = font.widthOfTextAtSize(text, size)
            page.drawText(text, {
                x: (page.getWidth() - textWidth) / 2,
                y: y,
                size: size,
                font: font,
                color: color,
            })
        }

        // Adjust these Y-coordinates based on common certificate templates (may need refinement)
        // STUDENT NAME
        drawCenteredText(studentName.toUpperCase(), page.getHeight() * 0.55, 40, fontBold, rgb(0.1, 0.2, 0.4))

        // COURSE NAME
        drawCenteredText(`concluiu com êxito o curso de ${courseName}`, page.getHeight() * 0.45, 18, fontRegular)

        // WORKLOAD & DATE
        drawCenteredText(`com carga horária de ${workload}, em ${issueDate}.`, page.getHeight() * 0.40, 14, fontRegular)

        // SIGNATURE
        if (signaturePath) {
            const signatureResponse = await fetch(signaturePath)
            if (signatureResponse.ok) {
                const signatureBytes = await signatureResponse.arrayBuffer()
                const signatureImage = await pdfDoc.embedPng(signatureBytes)
                const sigWidth = 150
                const sigHeight = (signatureImage.height / signatureImage.width) * sigWidth

                page.drawImage(signatureImage, {
                    x: (page.getWidth() - sigWidth) / 2,
                    y: page.getHeight() * 0.2,
                    width: sigWidth,
                    height: sigHeight,
                })

                if (professorName) {
                    drawCenteredText(professorName, page.getHeight() * 0.18, 12, fontBold)
                    drawCenteredText("Coordenador Pedagógico", page.getHeight() * 0.15, 10, fontRegular, rgb(0.5, 0.5, 0.5))
                }
            }
        }

        const pdfBytes = await pdfDoc.save()

        // 4. Upload to Storage
        const storagePath = `issued/${cert.student_id}/${certificate_id}.pdf`
        const { error: uploadError } = await supabaseClient.storage
            .from('certificates')
            .upload(storagePath, pdfBytes, {
                contentType: 'application/pdf',
                upsert: true
            })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabaseClient.storage
            .from('certificates')
            .getPublicUrl(storagePath)

        // 5. Update DB
        await supabaseClient
            .from('certificates')
            .update({
                certificate_url: publicUrl,
                storage_path: storagePath
            })
            .eq('id', certificate_id)

        return new Response(JSON.stringify({ success: true, url: publicUrl }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
