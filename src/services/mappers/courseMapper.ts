import type { Course, Participant } from '../models/courseModels';
import type { Course as StoreCourse } from '../../store/models/courseStoreModels';
import type { User } from '../../store/models/authStoreModels';

export const mapCourseResponseToCourse = (dto: Course, isOwner: boolean): StoreCourse => ({
  id: dto.id,
  name: dto.title,
  description: dto.description || '',
  enrollmentCode: dto.enrollmentCode,
  isOwner,
});

const getParticipantRole = (participant: Participant) =>
  participant.ParticipantRole ?? participant.participantRole;

const getParticipantUserId = (participant: Participant) =>
  participant.userId ?? participant.id ?? participant.user?.id;

const getParticipantEmail = (participant: Participant) =>
  participant.email ?? participant.user?.email;

export const isCourseOwner = (participants: Participant[], currentUser: User): boolean => {
  const currentUserId = currentUser.id?.trim();
  const currentUserEmail = currentUser.email?.trim().toLowerCase();

  return participants.some((participant) => {
    if (getParticipantRole(participant) !== 'OWNER') return false;

    const participantUserId = getParticipantUserId(participant)?.trim();
    if (currentUserId && participantUserId && participantUserId === currentUserId) {
      return true;
    }

    const participantEmail = getParticipantEmail(participant)?.trim().toLowerCase();
    return Boolean(currentUserEmail && participantEmail && participantEmail === currentUserEmail);
  });
};

export const partitionCourses = (
  courses: Course[],
  currentUser: User,
  participants: Participant[],
): { owned: StoreCourse[]; enrolled: StoreCourse[] } => {
  const owned: StoreCourse[] = [];
  const enrolled: StoreCourse[] = [];
  console.log(`user id =${currentUser!.id}`)
  for (const dto of courses) {
    const courseParticipants = participants.filter((participant) => participant.courseId === dto.id);
    const courseIsOwner = isCourseOwner(courseParticipants, currentUser);
    const course = mapCourseResponseToCourse(dto, courseIsOwner);
    if (courseIsOwner) {
      owned.push(course);
    } else {
      enrolled.push(course);
    }
  }

  return { owned, enrolled };
};
