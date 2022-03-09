import "reflect-metadata";
import { getConnectionManager } from "typeorm";

// @ts-ignore
import databaseService from './service/database.service';
import appStatusService from './statusApp';

import Classroom from "../models/classroom.model";
import Department from "../models/department.model";
import Faculty from "../models/faculty.model";
import Group from "../models/group.model";
import Lesson from "../models/lesson.model";
import LessonType from "../models/lessonType.model";
import Teacher from "../models/teacher.model";
import Time from "../models/time.model";
import User from "../models/user.model";
import Weekday from "../models/weekday.model";
import WeekType from "../models/weekType.model";

import groupService from "../service/GroupService";
import { ParserData } from "../types/parser";

const connectionManager = getConnectionManager();
export const connection = connectionManager.create({
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST || '',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  entities: [
    Classroom, Department, Faculty, Group, Lesson, LessonType, Teacher, Time, User, Weekday, WeekType
  ],
  logging: false
});

export const dbDisconnect = async () => {
  await connection.close();
}

export const saveParseData = async (data: ParserData) => {
  appStatusService.emit('start_saving_data');
  await groupService.clear();
  await groupService.saveArray(data.groups);
  appStatusService.emit('end_saving_data');
}