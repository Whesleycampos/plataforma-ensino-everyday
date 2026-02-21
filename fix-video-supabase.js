import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cxpcqspccnafqgflrwvr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cGNxc3BjY25hZnFnZmxyd3ZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzI2MjU5NiwiZXhwIjoyMDgyODM4NTk2fQ.LWXzqf_0X-JFduhqx433QHLerwwcFYP5UxxeVSjaNXA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixVideoUrls() {
    console.log('🔧 Corrigindo URLs dos vídeos no Supabase...\n');

    // Correções a fazer
    const fixes = [
        {
            id: 2,
            title: 'Verbo To be',
            correctUrl: 'https://iframe.mediadelivery.net/embed/588018/a56abdb1-c8f0-42e3-8c75-147ba1ad9029?autoplay=false'
        },
        {
            id: 3,
            title: 'Passado do verbo to be',
            correctUrl: 'https://iframe.mediadelivery.net/embed/588018/66066bdb-31f7-4fb8-a61b-cd589a9f58de?autoplay=false'
        }
    ];

    for (const fix of fixes) {
        console.log(`📝 Atualizando: ${fix.title} (ID: ${fix.id})`);
        console.log(`   Nova URL: ${fix.correctUrl}`);

        const { error } = await supabase
            .from('lessons')
            .update({ video_url: fix.correctUrl })
            .eq('id', fix.id)
            .select();

        if (error) {
            console.error(`   ❌ ERRO: ${error.message}`);
        } else {
            console.log(`   ✅ Atualizado com sucesso!`);
        }
        console.log('');
    }

    // Verificar as mudanças
    console.log('🔍 Verificando as atualizações...\n');

    const { data: lessons, error: fetchError } = await supabase
        .from('lessons')
        .select('*')
        .in('id', [2, 3]);

    if (fetchError) {
        console.error('❌ Erro ao buscar aulas:', fetchError);
    } else {
        lessons.forEach(lesson => {
            console.log(`ID ${lesson.id}: ${lesson.title}`);
            console.log(`URL: ${lesson.video_url}`);
            console.log('');
        });
    }

    console.log('🎉 Processo concluído!');
}

fixVideoUrls();
