export interface Course {
  id: string;
  name: string;
  description: string;
  enrollmentCode: string;
  isOwner: boolean;
}

export interface CourseStoreInterface {
  ownedCourses: Course[];
  enrolledCourses: Course[];
  setCourses: (owned: Course[], enrolled: Course[]) => void;
  createCourse: (course: Course) => Promise<void>;
  updateCourse: (courseId: string, course: Course) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  enrollInCourse: (course: Course) => Promise<void>;
}
