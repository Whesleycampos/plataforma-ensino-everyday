import { supabase } from '../supabase';

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

const getCurrentEmail = () => {
    return normalizeEmail(localStorage.getItem('userEmail'));
};

const getProgressStorageKey = (email) => {
    return `student_progress_${normalizeEmail(email)}`;
};

const getLocalProgressByEmail = (email) => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return [];

    try {
        const key = getProgressStorageKey(normalizedEmail);
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
};

const saveLocalProgressByEmail = (email, lessons) => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return;

    const key = getProgressStorageKey(normalizedEmail);
    const uniqueLessons = [...new Set(lessons)];
    localStorage.setItem(key, JSON.stringify(uniqueLessons));
};

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
    const localEmail = getCurrentEmail();
    const localProgress = getLocalProgressByEmail(localEmail);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return localProgress;

    const { data, error } = await supabase
        .from('student_progress')
        .select('lesson_id')
        .eq('user_id', user.id);

    if (error) return localProgress;

    const dbProgress = data.map(item => item.lesson_id);
    return [...new Set([...dbProgress, ...localProgress])];
};

export const markLessonComplete = async (lessonId) => {
    const localEmail = getCurrentEmail();
    const localProgress = getLocalProgressByEmail(localEmail);
    if (!localProgress.includes(lessonId)) {
        saveLocalProgressByEmail(localEmail, [...localProgress, lessonId]);
    }

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
