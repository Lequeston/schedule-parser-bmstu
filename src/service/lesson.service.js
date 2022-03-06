import LessonModel from '../models/lesson.model';

class LessonService {
  async removeAll() {
    await LessonModel.deleteMany({});
  }
  async addInDB(classroomId, groupId, lessonTypeId, teacherId, timeId, weekdayId, weekTypeId, title) {
    if (title && groupId && timeId && weekdayId && weekTypeId) {
      const lesson = await LessonModel.create({
        classroomId,
        groupId,
        lessonTypeId,
        teacherId,
        timeId,
        weekdayId,
        weekTypeId,
        title
      });
      return lesson;
    }
    return null;
  }
  async getAll(groupId) {
    return await LessonModel.find({ groupId });
  }
}

export default new LessonService();