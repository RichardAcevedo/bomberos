import employeesApi from '../../commons/api/employees';
import * as types from '../../commons/mutationTypes';
import employeeModel from '../../commons/models/employee';
import { orderObject, downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const employees = await employeesApi.get();
    const { data } = employees;
    const result = data.reduce((m, item) => {
      m.push(employeeModel.getViewFormatSimple(item));
      return m;
    }, []);
    const resultOrder = orderObject(result, 'person');
    commit(types.SET_EMPLOYEES_LIST, resultOrder);
    return resultOrder;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getCurriculumPersonal = async (params, payload) => {
  try {
    const curriculum = await employeesApi.getCurriculumPersonal(payload);
    const { data } = curriculum;
    // const result = data.reduce((m, item) => {
    //   m.push(employeeModel.getViewFormatSimple(item));
    //   return m;
    // }, []);
    return data;
    // return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getEmployeeWithoutAppointment = async () => {
  try {
    const employees = await employeesApi.getEmployeeWithoutAppointment();
    const { data } = employees;
    const result = data.reduce((m, item) => {
      m.push(employeeModel.getViewFormatSimple(item));
      return m;
    }, []);
    const resultOrder = orderObject(result, 'person');
    return resultOrder;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const employee = await employeesApi.getForId(payload);
    const { data } = employee;
    const result = employeeModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForIdWithPassword = async (params, payload) => {
  try {
    const employee = await employeesApi.getForId(payload);
    const { data } = employee;
    const result = employeeModel.getViewFormatComplete({ ...data, withPassword: true });
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => employeesApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await employeesApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const employee = await employeesApi.update(payload);
    return employee;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getInspectors = async () => {
  try {
    const supervisors = await employeesApi.getInspectors();
    const { data } = supervisors;
    const result = data.reduce((m, item) => {
      m.push(employeeModel.getViewFormatSimple(item));
      return m;
    }, []);
    const resultOrder = orderObject(result, 'person');
    return resultOrder;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const cancelFingerPrint = () => employeesApi.cancelFingerPrint();

const withFingerPrint = async (params, payload) => {
  try {
    const employee = await employeesApi.withFingerPrint(payload);
    const { data } = employee;
    return data;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await employeesApi.report();
    downloadExcel(file.data, payload);
  } catch (e) {
    // console.log(e);
  }
};

export default {
  get,
  getCurriculumPersonal,
  getEmployeeWithoutAppointment,
  getForId,
  getForIdWithPassword,
  store,
  remove,
  update,
  getInspectors,
  cancelFingerPrint,
  withFingerPrint,
  report,
};
