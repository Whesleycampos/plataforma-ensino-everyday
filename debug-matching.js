import { createClient } from '@supabase/supabase-js';
import { courseCurriculum } from './src/lib/courseContent.js';

const supabaseUrl = 'https://cxpcqspccnafqgflrwvr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cGNxc3BjY25hZnFnZmxyd3ZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzI2MjU5NiwiZXhwIjoyMDgyODM4NTk2fQ.LWXzqf_0X-JFduhqx433QHLerwwcFYP5UxxeVSjaNXA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Função de normalização (igual ao CoursePlayer.jsx)
const normalizeTitle = (title) => title.toLowerCase().trim().replace(/\s+/g, ' ');

async function debugMatching() {
    console.log('🔍 DEBUG: Verificando matching entre Supabase e courseContent.js\n');

    // Buscar aulas do Supabase
    const { data: lessonsDB, error } = await supabase
        .from('lessons')
        .select('*')
        .order('position', { ascending: true });

    if (error) {
        console.error('❌ Erro ao buscar aulas:', error);
        return;
    }

    console.log(`📊 Total de aulas no Supabase: ${lessonsDB.length}\n`);

    // Para cada aula do Supabase, tentar fazer match
    let matchedCount = 0;
    let unmatchedCount = 0;

    for (const dbLesson of lessonsDB) {
        const dbNormalized = normalizeTitle(dbLesson.title);
        let foundMatch = false;

        // Buscar no courseContent.js
        for (const module of courseCurriculum) {
            for (const lesson of module.lessons) {
                if (typeof lesson !== 'object') continue;

                const contentNormalized = normalizeTitle(lesson.title);

                // Lógica de matching (igual ao CoursePlayer.jsx)
                const isMatch = dbNormalized === contentNormalized ||
                    dbNormalized.includes(contentNormalized) ||
                    contentNormalized.includes(dbNormalized);

                if (isMatch) {
                    foundMatch = true;

                    if (lesson.activity_links && lesson.activity_links.length > 0) {
                        console.log(`✅ MATCH COM LINKS (${lesson.activity_links.length} links)`);
                        console.log(`   Supabase: "${dbLesson.title}"`);
                        console.log(`   Content:  "${lesson.title}"`);
                        console.log(`   Links: ${lesson.activity_links.map(l => l.title).join(', ')}`);
                        console.log('');
                        matchedCount++;
                    } else {
                        console.log(`⚠️  MATCH SEM LINKS`);
                        console.log(`   Supabase: "${dbLesson.title}"`);
                        console.log(`   Content:  "${lesson.title}"`);
                        console.log('');
                    }
                    break;
                }
            }
            if (foundMatch) break;
        }

        if (!foundMatch) {
            console.log(`❌ SEM MATCH`);
            console.log(`   Supabase: "${dbLesson.title}"`);
            console.log(`   Normalizado: "${dbNormalized}"`);
            console.log('');
            unmatchedCount++;
        }
    }

    console.log('\n📈 RESUMO:');
    console.log(`   ✅ Aulas com match e links: ${matchedCount}`);
    console.log(`   ❌ Aulas sem match: ${unmatchedCount}`);
    console.log(`   📊 Total no Supabase: ${lessonsDB.length}`);
}

debugMatching();
