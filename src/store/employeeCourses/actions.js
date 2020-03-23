import employeeCoursesApi from '../../commons/api/employeeCourses';
import * as types from '../../commons/mutationTypes';
import employeeCourseModel from '../../commons/models/employeeCourse';
import { downloadExcel } from '../../utils/helpers';

const get = async () => {
  try {
    const courses = await employeeCoursesApi.get();
    const { data } = courses;
    const result = data.reduce((m, item) => {
      m.push(employeeCourseModel.getViewFormat(item));
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForEmployee = async ({ commit }, payload) => {
  try {
    const courses = await employeeCoursesApi.getForEmployee(payload);
    const { data } = courses;
    const result = data.reduce((m, item) => {
      m.push(employeeCourseModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_COURSES_EMPLOYEES_LIST, result);
  } catch (e) {
    // console.log(e);
  }
};

const getForId = async (params, payload) => {
  try {
    const course = await employeeCoursesApi.getForId(payload);
    const { data } = course;
    const result = employeeCourseModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => employeeCoursesApi.store(payload);

const update = async (params, payload) => {
  try {
    const course = await employeeCoursesApi.update(payload);
    return course;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await employeeCoursesApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await employeeCoursesApi.report();
    downloadExcel(file.data, payload);
  } catch (e) {
    // console.log(e);
  }
};

export default {
  get,
  getForEmployee,
  getForId,
  store,
  update,
  remove,
  report,
};
