import userTypesApi from '../../commons/api/userTypes';
import bloodTypeApi from '../../commons/api/bloodTypes';
import citiesApi from '../../commons/api/cities';
import professionsApi from '../../commons/api/professions';
import licenseCategoriesApi from '../../commons/api/licenseCategories';
import languagesApi from '../../commons/api/languages';
import eventsApi from '../../commons/api/events';
import noveltyTypesApi from '../../commons/api/noveltyTypes';
import reportTypesApi from '../../commons/api/reportTypes';
import fingerprintesApi from '../../commons/api/fingerprintes';

import userTypeModel from '../../commons/models/userType';
import bloodTypeModel from '../../commons/models/bloodType';
import cityModel from '../../commons/models/city';
import professionModel from '../../commons/models/profession';
import licenseCategoryModel from '../../commons/models/licenseCategory';
import languageModel from '../../commons/models/language';
import eventModel from '../../commons/models/event';
import noveltyTypeModel from '../../commons/models/noveltyType';
import reportTypeModel from '../../commons/models/reportType';

const getUserTypes = async () => {
  try {
    const userTypes = await userTypesApi.get();
    const { data } = userTypes;
    const result = data.reduce((m, item) => {
      if (item.nombre !== 'Normal') {
        m.push(userTypeModel.getViewFormat(item));
      }
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getBloodTypes = async () => {
  try {
    const bloodTypes = await bloodTypeApi.get();
    const { data } = bloodTypes;
    const result = data.reduce((m, item) => {
      m.push(bloodTypeModel.getViewFormat(item));
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getCities = async () => {
  try {
    const cities = await citiesApi.get();
    const { data } = cities;
    const result = data.reduce((m, item) => {
      m.push(cityModel.getViewFormat(item));
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getProfessions = async () => {
  try {
    const professions = await professionsApi.get();
    const { data } = professions;
    const result = data.reduce((m, item) => {
      m.push(professionModel.getViewFormat(item));
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getNoveltyTypes = async () => {
  try {
    const noveltyTypes = await noveltyTypesApi.get();
    const { data } = noveltyTypes;
    const result = data.reduce((m, item) => {
      m.push(noveltyTypeModel.getViewFormat(item));
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getReportTypes = async () => {
  try {
    const reportTypes = await reportTypesApi.get();
    const { data } = reportTypes;
    const result = data.reduce((m, item) => {
      m.push(reportTypeModel.getViewFormat(item));
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getLicenseCategories = async () => {
  try {
    const licenseCategories = await licenseCategoriesApi.get();
    const { data } = licenseCategories;
    const result = data.reduce((m, item) => {
      m.push(licenseCategoryModel.getViewFormat(item));
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getLanguages = async () => {
  try {
    const languages = await languagesApi.get();
    const { data } = languages;
    const result = data.reduce((m, item) => {
      m.push(languageModel.getViewFormat(item));
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getEvents = async () => {
  try {
    const events = await eventsApi.get();
    const { data } = events;
    const result = data.reduce((m, item) => {
      m.push(eventModel.getViewFormat(item));
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const removeFingerprintForEmployee = async (params, id) => {
  try {
    const employee = await fingerprintesApi.removeForEmployee(id);
    return employee;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

export default {
  getUserTypes,
  getBloodTypes,
  getCities,
  getProfessions,
  getLicenseCategories,
  getLanguages,
  getEvents,
  getNoveltyTypes,
  getReportTypes,
  removeFingerprintForEmployee,
};
