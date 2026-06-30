import type { Course } from '../models/courseModels';
import type { Course as StoreCourse } from '../../store/models/courseStoreModels';

export const mapCourseResponseToCourse = (dto: Course): StoreCourse => ({
  id: dto.id,
  name: dto.title,
  description: dto.description || '',
  enrollmentCode: dto.enrollmentCode,
  ownerId: dto.ownerId,
});

/**
 * Recibe la lista plana del backend y la separa en owned / enrolled
 * según el userId del usuario autenticado.
 */
export const partitionCourses = (
  courses: Course[],
  currentUserId: string,
): { owned: StoreCourse[]; enrolled: StoreCourse[] } => {
  const owned: StoreCourse[] = [];
  const enrolled: StoreCourse[] = [];

  for (const dto of courses) {
    const course = mapCourseResponseToCourse(dto);
    if (dto.ownerId === currentUserId) {
      owned.push(course);
    } else {
      enrolled.push(course);
    }
  }

  return { owned, enrolled };
};
