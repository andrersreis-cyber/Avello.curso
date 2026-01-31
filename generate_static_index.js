const fs = require('fs-extra');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'Curso_Clone');
const OUTPUT_FILE = path.join(__dirname, 'course_data.json');

// URL Base do Bucket (ajustar conforme seu projeto)
const STORAGE_URL = 'https://pgjcvdmbpluewhpephhx.supabase.co/storage/v1/object/public/course-assets';

function generateIndex() {
    console.log('Gerando índice estático do curso...');
    
    const courseData = {
        products: [
            {
                id: 'prod_01',
                name: 'Super Pack Completo',
                modules: []
            }
        ]
    };

    const modules = fs.readdirSync(BASE_DIR).filter(item => {
        return fs.statSync(path.join(BASE_DIR, item)).isDirectory();
    });

    for (const moduleName of modules) {
        const moduleObj = {
            id: `mod_${moduleName.replace(/[^a-z0-9]/gi, '_')}`,
            title: moduleName,
            lessons: []
        };

        const modulePath = path.join(BASE_DIR, moduleName);
        const lessons = fs.readdirSync(modulePath).filter(item => {
            return fs.statSync(path.join(modulePath, item)).isDirectory();
        });

        for (const lessonName of lessons) {
            const lessonDir = path.join(modulePath, lessonName);
            const files = fs.readdirSync(lessonDir);
            
            // Ler Conteúdo
            let content = '';
            if (fs.existsSync(path.join(lessonDir, 'conteudo.md'))) {
                content = fs.readFileSync(path.join(lessonDir, 'conteudo.md'), 'utf8');
            }

            // Anexo
            let attachmentUrl = null;
            const attachmentFile = files.find(f => f !== 'conteudo.md' && f !== 'metadata.json');
            
            if (attachmentFile) {
                // Caminho que usamos no upload: Module/Lesson/File
                const safeMod = moduleName.replace(/[^a-zA-Z0-9]/g, '_');
                const safeLess = lessonName.replace(/[^a-zA-Z0-9]/g, '_');
                attachmentUrl = `${STORAGE_URL}/${safeMod}/${safeLess}/${encodeURIComponent(attachmentFile)}`;
            }

            moduleObj.lessons.push({
                id: `less_${lessonName.replace(/[^a-z0-9]/gi, '_')}`,
                title: lessonName,
                content: content,
                attachment_url: attachmentUrl
            });
        }
        
        courseData.products[0].modules.push(moduleObj);
    }

    fs.writeJsonSync(OUTPUT_FILE, courseData, { spaces: 2 });
    console.log(`Índice gerado em ${OUTPUT_FILE}`);
}

generateIndex();
