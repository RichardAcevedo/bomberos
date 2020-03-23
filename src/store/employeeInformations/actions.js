import employeeInformationsApi from '../../commons/api/employeeInformations';
import * as types from '../../commons/mutationTypes';
import employeeInformationModel from '../../commons/models/employeeInformation';
import { downloadExcel } from '../../utils/helpers';

const get = async () => {
  try {
    const informations = await employeeInformationsApi.get();
    const { data } = informations;
    const result = data.reduce((m, item) => {
      m.push(employeeInformationModel.getViewFormat(item));
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
    const informations = await employeeInformationsApi.getForEmployee(payload);
    const { data } = informations;
    const result = data.reduce((m, item) => {
      m.push(employeeInformationModel.getViewFormat(item, true));
      return m;
    }, []);
    commit(types.SET_INFORMATIONS_EMPLOYEES_LIST, result);
  } catch (e) {
    // console.log(e);
  }
};

const getForId = async (params, payload) => {
  try {
    const information = await employeeInformationsApi.getForId(payload);
    const { data } = information;
    const result = employeeInformationModel.getViewFormat(data, false);
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
      formData.append('fechaInicio', payload.fechaInicio);
      if (payload.fechaBaja) formData.append('fechaBaja', payload.fechaBaja);
      formData.append('cargo', payload.cargo);
      formData.append('institucion', payload.institucion);
      if (payload.resolucion) formData.append('resolucion', payload.resolucion);
      formData.append('idEmpleado', payload.idEmpleado);
      formData.append('idRango', payload.idRango);
      formData.append('id', payload.id);
      formData.append('archivo', payload.archivo);
      const result = employeeInformationsApi.store(formData, true);
      return result;
    }
    const result = await employeeInformationsApi.store(payload, false);
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
      formData.append('fechaInicio', payload.fechaInicio);
      if (payload.fechaBaja) formData.append('fechaBaja', payload.fechaBaja);
      formData.append('cargo', payload.cargo);
      formData.append('institucion', payload.institucion);
      if (payload.resolucion) formData.append('resolucion', payload.resolucion);
      formData.append('idEmpleado', payload.idEmpleado);
      formData.append('idRango', payload.idRango);
      formData.append('id', payload.id);
      formData.append('archivo', payload.archivo);
      formData.append('_method', 'PATCH'); // Por aca se pone en PATCH y el metodo se envia como POST
      const result = employeeInformationsApi.updateWithFile(formData);
      return result;
    }
    const result = await employeeInformationsApi.update(payload);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await employeeInformationsApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await employeeInformationsApi.report();
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
