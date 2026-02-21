import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cxpcqspccnafqgflrwvr.supabase.co';
const supabaseKey = 'sb_publishable_dhHlnEf87JCiZJhonajJ6A_JbXtK6rz';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateVerboToBeLesson() {
    console.log('🔍 Buscando aula "Verbo To be"...');

    // Buscar a aula
    const { data: lessons, error: searchError } = await supabase
        .from('lessons')
        .select('*')
        .ilike('title', '%Verbo To be%');

    if (searchError) {
        console.error('❌ Erro ao buscar aula:', searchError);
        return;
    }

    if (!lessons || lessons.length === 0) {
        console.log('⚠️ Aula "Verbo To be" não encontrada no banco');
        return;
    }

    console.log(`✅ Encontrada ${lessons.length} aula(s):`);
    lessons.forEach(lesson => {
        console.log(`   - ID: ${lesson.id}, Título: ${lesson.title}`);
        console.log(`   - URL atual: ${lesson.video_url || 'null'}`);
    });

    // Atualizar cada aula encontrada
    for (const lesson of lessons) {
        const correctVideoUrl = 'https://iframe.mediadelivery.net/embed/588018/a56abdb1-c8f0-42e3-8c75-147ba1ad9029?autoplay=false';

        console.log(`\n🔧 Atualizando aula ID: ${lesson.id}...`);

        const { error } = await supabase
            .from('lessons')
            .update({
                video_url: correctVideoUrl
            })
            .eq('id', lesson.id)
            .select();

        if (error) {
            console.error(`❌ Erro ao atualizar aula ${lesson.id}:`, error);
        } else {
            console.log(`✅ Aula ${lesson.id} atualizada com sucesso!`);
            console.log(`   Nova URL: ${correctVideoUrl}`);
        }
    }

    console.log('\n🎉 Processo concluído!');
}

updateVerboToBeLesson();
