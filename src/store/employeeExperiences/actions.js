import employeeExperiencesApi from '../../commons/api/employeeExperiences';
import * as types from '../../commons/mutationTypes';
import employeeExperienceModel from '../../commons/models/employeeExperience';
import { downloadExcel } from '../../utils/helpers';

const get = async () => {
  try {
    const experiences = await employeeExperiencesApi.get();
    const { data } = experiences;
    const result = data.reduce((m, item) => {
      m.push(employeeExperienceModel.getViewFormat(item));
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
    const experiences = await employeeExperiencesApi.getForEmployee(payload);
    const { data } = experiences;
    const result = data.reduce((m, item) => {
      m.push(employeeExperienceModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_EXPERIENCES_EMPLOYEES_LIST, result);
  } catch (e) {
    // console.log(e);
  }
};

const getForId = async (params, payload) => {
  try {
    const experience = await employeeExperiencesApi.getForId(payload);
    const { data } = experience;
    const result = employeeExperienceModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => employeeExperiencesApi.store(payload);

const update = async (params, payload) => {
  try {
    const experience = await employeeExperiencesApi.update(payload);
    return experience;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await employeeExperiencesApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await employeeExperiencesApi.report();
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
