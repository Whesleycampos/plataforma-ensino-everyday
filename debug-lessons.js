import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://cxpcqspccnafqgflrwvr.supabase.co',
    'sb_publishable_dhHlnEf87JCiZJhonajJ6A_JbXtK6rz'
);

async function debugLessons() {
    console.log('🔍 Verificando lessons no Supabase...\n');

    // 1. Buscar todos os cursos
    const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*');

    if (coursesError) {
        console.error('❌ Erro ao buscar cursos:', coursesError);
        return;
    }

    console.log(`✅ ${courses.length} curso(s) encontrado(s):\n`);
    courses.forEach(course => {
        console.log(`  - ${course.title} (ID: ${course.id})`);
    });

    // 2. Buscar lessons do primeiro curso
    if (courses.length > 0) {
        const courseId = courses[0].id;
        console.log(`\n🔍 Buscando lessons do curso "${courses[0].title}" (ID: ${courseId})...\n`);

        const { data: lessons, error: lessonsError } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('position', { ascending: true });

        if (lessonsError) {
            console.error('❌ Erro ao buscar lessons:', lessonsError);
            return;
        }

        console.log(`✅ ${lessons.length} lesson(s) encontrada(s):\n`);

        if (lessons.length === 0) {
            console.log('⚠️  BANCO VAZIO! Nenhuma lesson cadastrada no Supabase.');
            console.log('   O sistema vai usar apenas o courseCurriculum do arquivo local.\n');
        } else {
            lessons.slice(0, 10).forEach((lesson, idx) => {
                console.log(`${idx + 1}. ${lesson.title}`);
                console.log(`   - Posição: ${lesson.position}`);
                console.log(`   - Duração: ${lesson.duration}`);
                console.log(`   - Video URL: ${lesson.video_url ? '✅ TEM URL' : '❌ SEM URL'}`);
                console.log(`   - Tipo: ${lesson.type || 'video'}`);
                console.log('');
            });

            if (lessons.length > 10) {
                console.log(`... e mais ${lessons.length - 10} lessons\n`);
            }
        }
    }
}

debugLessons();
