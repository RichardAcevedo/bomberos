import appointmentsApi from '../../commons/api/appointments';
import * as types from '../../commons/mutationTypes';
import appointmentModel from '../../commons/models/appointment';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const appointments = await appointmentsApi.get();
    const { data } = appointments;
    const result = data.reduce((m, item) => {
      m.push(appointmentModel.getViewFormatSimple(item));
      return m;
    }, []);
    commit(types.SET_APPOINTMENTS_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const appointment = await appointmentsApi.getForId(payload);
    const { data } = appointment;
    const result = appointmentModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => appointmentsApi.store(payload);

const update = async (params, payload) => {
  try {
    const appointment = await appointmentsApi.update(payload);
    return appointment;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await appointmentsApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await appointmentsApi.report();
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
