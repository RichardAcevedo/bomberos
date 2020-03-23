import employeeTrainingsApi from '../../commons/api/employeeTrainings';
import * as types from '../../commons/mutationTypes';
import employeeTrainingModel from '../../commons/models/employeeTraining';
import { downloadExcel } from '../../utils/helpers';

const get = async () => {
  try {
    const traninings = await employeeTrainingsApi.get();
    const { data } = traninings;
    const result = data.reduce((m, item) => {
      m.push(employeeTrainingModel.getViewFormat(item));
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
    const traninings = await employeeTrainingsApi.getForEmployee(payload);
    const { data } = traninings;
    const result = data.reduce((m, item) => {
      m.push(employeeTrainingModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_TRAININGS_EMPLOYEES_LIST, result);
  } catch (e) {
    // console.log(e);
  }
};

const getForId = async (params, payload) => {
  try {
    const tranining = await employeeTrainingsApi.getForId(payload);
    const { data } = tranining;
    const result = employeeTrainingModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => {
  try {
    if (payload.archivo) {
      const formData = new FormData();
      if (payload.evento) formData.append('evento', payload.evento);
      formData.append('institucion', payload.institucion);
      if (payload.horaTeorica) formData.append('horaTeorica', payload.horaTeorica);
      if (payload.horaPractica) formData.append('horaPractica', payload.horaPractica);
      formData.append('fecha', payload.fecha);
      formData.append('idEmpleado', payload.idEmpleado);
      formData.append('id', payload.id);
      formData.append('archivo', payload.archivo);
      const result = employeeTrainingsApi.store(formData, true);
      return result;
    }
    const result = await employeeTrainingsApi.store(payload, false);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const update = async (params, payload) => {
  try {
    if (payload.archivo) {
      const formData = new FormData();
      if (payload.evento) formData.append('evento', payload.evento);
      formData.append('institucion', payload.institucion);
      if (payload.horaTeorica) formData.append('horaTeorica', payload.horaTeorica);
      if (payload.horaPractica) formData.append('horaPractica', payload.horaPractica);
      formData.append('fecha', payload.fecha);
      formData.append('idEmpleado', payload.idEmpleado);
      formData.append('id', payload.id);
      formData.append('archivo', payload.archivo);
      formData.append('_method', 'PATCH'); // Por aca se pone en PATCH y el metodo se envia como POST
      const result = employeeTrainingsApi.updateWithFile(formData);
      return result;
    }
    const tranining = await employeeTrainingsApi.update(payload);
    return tranining;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await employeeTrainingsApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await employeeTrainingsApi.report();
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
