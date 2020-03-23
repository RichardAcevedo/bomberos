import personsApi from '../../commons/api/persons';
import * as types from '../../commons/mutationTypes';
import personModel from '../../commons/models/person';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const persons = await personsApi.get();
    const { data } = persons;
    const result = data.reduce((m, item) => {
      m.push(personModel.getViewFormatSimple(item));
      return m;
    }, []);
    commit(types.SET_PERSONS_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getNotEmployees = async () => {
  try {
    const persons = await personsApi.getNotEmployees();
    const { data } = persons;
    const result = data.reduce((m, item) => {
      m.push(personModel.getViewFormatSimple(item));
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const person = await personsApi.getForId(payload);
    const { data } = person;
    const result = personModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => personsApi.store(payload);

const update = async (params, payload) => {
  try {
    const person = await personsApi.update(payload);
    return person;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await personsApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await personsApi.report();
    downloadExcel(file.data, payload);
  } catch (e) {
    // console.log(e);
  }
};

export default {
  get,
  getNotEmployees,
  getForId,
  store,
  update,
  remove,
  report,
};
