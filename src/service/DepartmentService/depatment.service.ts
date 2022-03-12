import { DeleteResult, getConnection, getRepository, InsertResult, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import Department from "../../models/department.model";
import Faculty from "../../models/faculty.model";
import facultyService from "../FacultyService";
import _ from 'lodash';

export class DepartmentService {

  public normalization(number: string) {
    return number.trim();
  }

  async find(number: string): Promise<Department | undefined> {
    const department = await getRepository(Department).findOne({ number });
    return department;
  }

  async clear(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Department)
      .execute();
    await facultyService.clear();
  }

  async getAll(): Promise<Department[]> {
    return await getConnection()
      .getRepository(Department)
      .createQueryBuilder('department')
      .getMany();
  }

  async saveArray(
    departmentsArray: Array<string>,
    faculties: Array<Faculty>
  ): Promise<InsertResult> {
    const departments: QueryDeepPartialEntity<Department>[] = _.compact(
      departmentsArray.map((depart: string): QueryDeepPartialEntity<Department> | undefined => {
        const department = this.normalization(depart);
        const faculty = faculties.find(faculty => department.indexOf(faculty.title) === 0);
        return faculty ? ({
          number: department,
          faculty
        }) : undefined;
      })
    );
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Department)
      .values(departments)
      .execute();
  }
}