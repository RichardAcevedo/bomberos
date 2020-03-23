import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import employees from './employees';
import employeeCourses from './employeeCourses';
import employeeEducations from './employeeEducations';
import employeeExperiences from './employeeExperiences';
import employeeInformations from './employeeInformations';
import employeeTrainings from './employeeTrainings';
import persons from './persons';
import promotions from './promotions';
import ranks from './ranks';
import rankCategories from './rankCategories';
import awards from './awards';
import awardTypes from './awardTypes';
import appointments from './appointments';
import positions from './positions';
import sanctions from './sanctions';
import logs from './logs';
import logs2 from './logs2';
import vehicleTypes from './vehicleTypes';
import issueTypes from './issueTypes';
import elements from './elements';
import vehicles from './vehicles';
import radios from './radios';
import directory from './directory';
import emergencyNumbers from './emergencyNumbers';
import companyTypes from './companyTypes';
import extinguisherTypes from './extinguisherTypes';
import customers from './customers';
import companies from './companies';
import certificates from './certificates';
import extinguishers from './extinguishers';
import bills from './bills';
import ui from './ui';

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      employees,
      persons,
      ui,
      employeeCourses,
      employeeEducations,
      employeeExperiences,
      employeeInformations,
      employeeTrainings,
      promotions,
      ranks,
      rankCategories,
      awards,
      awardTypes,
      appointments,
      positions,
      sanctions,
      logs,
      logs2,
      vehicleTypes,
      issueTypes,
      elements,
      vehicles,
      radios,
      directory,
      emergencyNumbers,
      companyTypes,
      extinguisherTypes,
      customers,
      companies,
      certificates,
      extinguishers,
      bills,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV,
  });

  return Store;
}
