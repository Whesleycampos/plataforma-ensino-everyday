import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cxpcqspccnafqgflrwvr.supabase.co';
const supabaseKey = 'sb_publishable_dhHlnEf87JCiZJhonajJ6A_JbXtK6rz';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllLessons() {
    console.log('🔍 Verificando TODAS as aulas no Supabase...\n');

    // Buscar todas as aulas
    const { data: lessons, error } = await supabase
        .from('lessons')
        .select('*')
        .order('position', { ascending: true });

    if (error) {
        console.error('❌ Erro ao buscar aulas:', error);
        return;
    }

    console.log(`✅ Total de aulas no banco: ${lessons.length}\n`);

    // Mostrar primeiras 10 aulas
    console.log('📋 Primeiras 10 aulas:\n');
    lessons.slice(0, 10).forEach((lesson, index) => {
        console.log(`${index + 1}. ID: ${lesson.id}`);
        console.log(`   Título: ${lesson.title}`);
        console.log(`   Video URL: ${lesson.video_url || 'null'}`);
        console.log(`   Course ID: ${lesson.course_id}`);
        console.log(`   Position: ${lesson.position}`);
        console.log('');
    });

    // Buscar especificamente "Verbo To be"
    console.log('\n🎯 Buscando especificamente "Verbo To be":\n');
    const verboToBe = lessons.filter(l =>
        l.title.toLowerCase().includes('verbo') &&
        l.title.toLowerCase().includes('be')
    );

    verboToBe.forEach(lesson => {
        console.log(`ID: ${lesson.id}`);
        console.log(`Título: ${lesson.title}`);
        console.log(`Video URL: ${lesson.video_url}`);
        console.log(`Course ID: ${lesson.course_id}`);
        console.log('');
    });

    // Verificar qual course_id está sendo usado
    console.log('\n📊 Distribuição por course_id:\n');
    const courseCounts = {};
    lessons.forEach(lesson => {
        courseCounts[lesson.course_id] = (courseCounts[lesson.course_id] || 0) + 1;
    });
    Object.entries(courseCounts).forEach(([courseId, count]) => {
        console.log(`Course ID ${courseId}: ${count} aulas`);
    });
}

checkAllLessons();
