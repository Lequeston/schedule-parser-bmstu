import { DeleteResult, getConnection, getRepository, InsertResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { deleteFalseValuesFilter } from "../../libs/project/array";
import Department from "../../models/department.model";
import Group from "../../models/group.model";
import departmentService from "../DepartmentService";
import facultyService from "../FacultyService";

export class GroupService {
  public normalization(title: string) {
    return title.trim();
  }

  parseGroupName(title: string): {
    faculty: string,
    department: string,
    group: string
  } {
    const group = title.trim();
    const department = group.split('-')[0];
    const faculty = department.replace(/[^А-Яа-яЁё]/g, '');
    return {
      faculty,
      department,
      group
    }
  }

  async find(title: string): Promise<Group | undefined> {
    const group = await getRepository(Group).findOne({ title });
    return group;
  }

  async clear(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Group)
      .execute();
    await departmentService.clear();
  }

  async getAll(): Promise<Group[]> {
    return getConnection()
      .getRepository(Group)
      .createQueryBuilder('group')
      .getMany();
  }

  private async saveFaculties(groupsArray: Array<string>) {
    const setFaculties = groupsArray.reduce(
      (acc, value) => acc.add(this.parseGroupName(value).faculty),
      new Set<string>()
    );
    await facultyService.saveArray(Array.from(setFaculties));
    return await facultyService.getAll();
  }

  private async saveDepartment(groupsArray: Array<string>) {
    const faculties = await this.saveFaculties(groupsArray);
    const setDepartments = groupsArray.reduce(
      (acc, value) => acc.add(this.parseGroupName(value).department),
      new Set<string>()
    );
    await departmentService.saveArray(Array.from(setDepartments), faculties);
    return await departmentService.getAll();
  }


  async saveArray(
    groupsArray: Array<string>
  ): Promise<InsertResult> {
    const departments = await this.saveDepartment(groupsArray);
    const groups: QueryDeepPartialEntity<Group>[] = groupsArray
      .map((groupValue: string): QueryDeepPartialEntity<Group> | undefined => {
        const group = this.normalization(groupValue);
        const department = departments.find(department => group.indexOf(department.number) === 0);
        return department ? ({
          title: group,
          department
        }) : undefined;
      })
      .filter(deleteFalseValuesFilter);
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Group)
      .values(groups)
      .execute();
  }
}