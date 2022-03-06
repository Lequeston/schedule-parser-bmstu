import { Schema, model } from 'mongoose';

const LessonSchema = new Schema({
  timeId: {type: Schema.Types.ObjectId, ref: 'Time'},
  weekdayId: {type: Schema.Types.ObjectId, ref: 'Weekday'},
  teacherId: {type: Schema.Types.ObjectId, ref: 'Teacher'},
  lessonTypeId: {type: Schema.Types.ObjectId, ref: 'LessonType'},
  groupId: {type: Schema.Types.ObjectId, ref: 'Group'},
  classroomId: {type: Schema.Types.ObjectId, ref: 'Classroom'},
  weekTypeId: {type: Schema.Types.ObjectId, ref: 'WeekType'},
  title: {type: String, required: true}
});

export default model('Lesson', LessonSchema);