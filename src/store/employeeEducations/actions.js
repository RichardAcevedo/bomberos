import employeeEducationsApi from '../../commons/api/employeeEducations';
import * as types from '../../commons/mutationTypes';
import employeeEducationModel from '../../commons/models/employeeEducation';
import { downloadExcel } from '../../utils/helpers';

const get = async () => {
  try {
    const educations = await employeeEducationsApi.get();
    const { data } = educations;
    const result = data.reduce((m, item) => {
      m.push(employeeEducationModel.getViewFormat(item));
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
    const educations = await employeeEducationsApi.getForEmployee(payload);
    const { data } = educations;
    const result = data.reduce((m, item) => {
      m.push(employeeEducationModel.getViewFormat(item, true));
      return m;
    }, []);
    commit(types.SET_EDUCATIONS_EMPLOYEES_LIST, result);
  } catch (e) {
    // console.log(e);
  }
};

const getForId = async (params, payload) => {
  try {
    const educations = await employeeEducationsApi.getForId(payload);
    const { data } = educations;
    const result = employeeEducationModel.getViewFormat(data, false);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => employeeEducationsApi.store(payload);

const update = async (params, payload) => {
  try {
    const course = await employeeEducationsApi.update(payload);
    return course;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await employeeEducationsApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await employeeEducationsApi.report();
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
