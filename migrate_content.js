const { createClient } = require('@supabase/supabase-js');
const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
require('dotenv').config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE_DIR = path.join(__dirname, 'Curso_Clone');
const BUCKET_NAME = 'course-assets';

async function uploadFile(filePath, destinationPath) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const mimeType = mime.lookup(filePath) || 'application/octet-stream';
        
        console.log(`Subindo: ${destinationPath} (${mimeType})...`);
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(destinationPath, fileBuffer, {
                contentType: mimeType,
                upsert: true
            });

        if (error) {
             console.error(`Erro Storage: ${error.message}`);
             return null;
        }
        return data.path;
    } catch (e) {
        console.error(`Erro FileSystem: ${e.message}`);
        return null;
    }
}

async function migrate() {
    console.log('Iniciando Upload para Storage...');
    
    const modules = fs.readdirSync(BASE_DIR).filter(item => {
        return fs.statSync(path.join(BASE_DIR, item)).isDirectory();
    });

    for (const [index, moduleName] of modules.entries()) {
        console.log(`\n[Módulo] ${moduleName}`);
        
        const modulePath = path.join(BASE_DIR, moduleName);
        const lessons = fs.readdirSync(modulePath).filter(item => {
            return fs.statSync(path.join(modulePath, item)).isDirectory();
        });

        for (const [lessonIndex, lessonName] of lessons.entries()) {
            const lessonDir = path.join(modulePath, lessonName);
            const files = fs.readdirSync(lessonDir);
            
            // Procurar anexo (qualquer coisa que não seja md/json de metadata)
            const attachmentFile = files.find(f => f !== 'conteudo.md' && f !== 'metadata.json');
            
            if (attachmentFile) {
                // Sanitizar caminho para evitar caracteres inválidos no Storage
                const safeMod = moduleName.replace(/[^a-zA-Z0-9]/g, '_');
                const safeLess = lessonName.replace(/[^a-zA-Z0-9]/g, '_');
                const storagePath = `${safeMod}/${safeLess}/${attachmentFile}`;
                
                await uploadFile(path.join(lessonDir, attachmentFile), storagePath);
            }
        }
    }
    console.log('\nUpload concluído!');
}

migrate();
