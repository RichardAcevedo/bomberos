import promotionsApi from '../../commons/api/promotions';
import * as types from '../../commons/mutationTypes';
import promotionModel from '../../commons/models/promotion';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const promotions = await promotionsApi.get();
    const { data } = promotions;
    const result = data.reduce((m, item) => {
      m.push(promotionModel.getViewFormatSimple(item));
      return m;
    }, []);
    commit(types.SET_PROMOTIONS_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const promotion = await promotionsApi.getForId(payload);
    const { data } = promotion;
    const result = promotionModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

// const store = async (params, payload) => promotionsApi.store(payload);
const store = async (params, payload) => {
  try {
    if (payload.archivo) {
      const formData = new FormData();
      formData.append('fechaActa', payload.fechaActa);
      formData.append('fechaResolucion', payload.fechaResolucion);
      formData.append('codigoActa', payload.codigoActa);
      formData.append('codigoResolucion', payload.codigoResolucion);
      if (payload.descripcion) formData.append('descripcion', payload.descripcion);
      formData.append('activo', payload.activo);
      if (payload.fechaDesactivacion) formData.append('fechaDesactivacion', payload.fechaDesactivacion);
      formData.append('idEmpleado', payload.idEmpleado);
      formData.append('idRango', payload.idRango);
      formData.append('id', payload.id);
      formData.append('archivo', payload.archivo);
      const result = promotionsApi.store(formData, true);
      return result;
    }
    const result = await promotionsApi.store(payload, false);
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
      formData.append('fechaActa', payload.fechaActa);
      formData.append('fechaResolucion', payload.fechaResolucion);
      formData.append('codigoActa', payload.codigoActa);
      formData.append('codigoResolucion', payload.codigoResolucion);
      if (payload.descripcion) formData.append('descripcion', payload.descripcion);
      formData.append('activo', payload.activo);
      if (payload.fechaDesactivacion) formData.append('fechaDesactivacion', payload.fechaDesactivacion);
      formData.append('idEmpleado', payload.idEmpleado);
      formData.append('idRango', payload.idRango);
      formData.append('id', payload.id);
      formData.append('archivo', payload.archivo);
      formData.append('_method', 'PATCH'); // Por aca se pone en PATCH y el metodo se envia como POST
      const result = promotionsApi.updateWithFile(formData);
      return result;
    }
    const result = await promotionsApi.update(payload);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await promotionsApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await promotionsApi.report();
    downloadExcel(file.data, payload);
  } catch (e) {
    // console.log(e);
  }
};

export default {
  get,
  getForId,
  store,
  update,
  remove,
  report,
};
