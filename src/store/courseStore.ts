import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CourseStoreInterface } from './models/courseStoreModels';

export const useCourseStore = create<CourseStoreInterface>()(persist(
  (set) => ({
    ownedCourses: [],
    enrolledCourses: [],
    setCourses: (owned, enrolled) => {
      set({ ownedCourses: owned, enrolledCourses: enrolled });
    },
    createCourse: async (course) => {
      set((state) => ({ ownedCourses: [...state.ownedCourses, course] }));
    },
    updateCourse: async (courseId, course) => {
      set((state) => ({
        ownedCourses: state.ownedCourses.map((c) => (c.id === courseId ? course : c))
      }));
    },
    deleteCourse: async (courseId) => {
      set((state) => ({
        ownedCourses: state.ownedCourses.filter((c) => c.id !== courseId)
      }));
      set((state) => ({
        enrolledCourses: state.enrolledCourses.filter((c) => c.id !== courseId)
      }));
    },
    enrollInCourse: async (course) => {
      set((state) => ({ enrolledCourses: [...state.enrolledCourses, course] }));
    }
  }),
  { name: "courses" }
));
