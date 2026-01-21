import { supabase } from '../supabase';

export const getCourses = async () => {
    const { data, error } = await supabase
        .from('courses')
        .select('*, lessons(count)') // Select all columns + count of lessons
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
    return data;
};

export const getCourseDetails = async (courseId) => {
    // 1. Get Course Info
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

    if (courseError) throw courseError;

    // 2. Get Lessons sorted by position
    const { data: lessons, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('position', { ascending: true });

    if (lessonError) throw lessonError;

    return { course, lessons };
};

export const getStudentProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('student_progress')
        .select('lesson_id')
        .eq('user_id', user.id);

    if (error) return [];
    return data.map(item => item.lesson_id); // Return array of completed lesson IDs
};

export const markLessonComplete = async (lessonId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
        .from('student_progress')
        .insert({ user_id: user.id, lesson_id: lessonId });

    if (error) {
        // Ignore duplicate error (already completed)
        if (error.code !== '23505') console.error('Error marking complete:', error);
    }
};
