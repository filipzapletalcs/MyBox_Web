import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'http://127.0.0.1:54321'
// Use the JWT from local dev - this is the default local anon key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseKey)

const accessoriesDir = './public/images/accessories'
const bucket = 'product-images'

async function uploadAccessories() {
  const folders = fs.readdirSync(accessoriesDir)

  for (const folder of folders) {
    const folderPath = path.join(accessoriesDir, folder)
    if (!fs.statSync(folderPath).isDirectory()) continue

    const files = fs.readdirSync(folderPath)

    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const storagePath = `accessories/${folder}/${file}`

      const fileBuffer = fs.readFileSync(filePath)
      const contentType = file.endsWith('.png') ? 'image/png' : 'image/jpeg'

      console.log(`Uploading ${storagePath}...`)

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, fileBuffer, {
          contentType,
          upsert: true
        })

      if (error) {
        console.error(`  Error: ${error.message}`)
      } else {
        console.log(`  Success: ${data.path}`)
      }
    }
  }

  console.log('\nDone!')
}

uploadAccessories()
