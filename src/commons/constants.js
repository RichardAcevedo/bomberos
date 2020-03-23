
import { dateToApiFormat } from '../utils/helpers';

export const NATIVE_URL = 'http://localhost:8000';
// export const NATIVE_URL = 'https://bomberos-api.herokuapp.com';

export const API_URL = 'http://localhost:8000/api';
// export const API_URL = 'https://bomberos-api.herokuapp.com/api';

export const LS_USER_INFO = 'LS_USER_INFO';
export const LS_CREATING_CURRICULUM = 'LS_CREATING_CURRICULUM';
export const LS_CREATING_PERSONS = 'LS_CREATING_PERSONS';
export const LS_CREATING_PROMOTIONS = 'LS_CREATING_PROMOTIONS';
export const LS_CREATING_AWARDS = 'LS_CREATING_AWARDS';
export const LS_CREATING_AWARD_TYPES = 'LS_CREATING_AWARD_TYPES';
export const LS_CREATING_APPOINTMENTS = 'LS_CREATING_APPOINTMENTS';
export const LS_CREATING_SANCTIONS = 'LS_CREATING_SANCTIONS';
export const LS_CREATING_VEHICLES = 'LS_CREATING_VEHICLES';
export const LS_CREATING_RADIOS = 'LS_CREATING_RADIOS';
export const LS_CREATING_COMPANIES = 'LS_CREATING_COMPANIES';
export const LS_CREATING_EXTINGUISHERS = 'LS_CREATING_EXTINGUISHERS';
export const LS_CREATING_BILLS = 'LS_CREATING_BILLS';
export const LS_CREATING_EMERGENCYS = 'LS_CREATING_EMERGENCYS';

export const ERROR_NOTIFICATION = {
  icon: 'error',
  color: 'white',
  textColor: 'negative',
  position: 'top',
};

export const WARNING_NOTIFICATION = {
  icon: 'notification_important',
  color: 'warning',
  textColor: 'white',
  position: 'top',
};

export const SUCCESS_NOTIFICATION = {
  icon: 'sentiment_very_satisfied',
  color: 'positive',
  textColor: 'white',
  position: 'top',
};

export const ROUTES = {
  personal: {
    curriculum: '/hojas-vida',
    alterCurriculum: '/modificar-hojas-vida',
    alterOwnCurriculum: '/hoja-vida-propia',
    persons: '/personas',
    alterPersons: '/modificar-personas',
    promotions: '/ascensos',
    alterPromotions: '/modificar-ascensos',
    awards: '/condecoraciones',
    alterAwards: '/modificar-condecoraciones',
    awardTypes: '/tipos-condecoraciones',
    appointments: '/nombramientos',
    alterAppointments: '/modificar-nombramientos',
    sanctions: '/sanciones',
    alterSanctions: '/modificar-sanciones',
    ranks: '/rangos',
    rankCategories: '/categoria-rangos',
    positions: '/cargos',
    logs: '/logs',
  },
  bills: {
    bills: '/minutas',
    emergency: '/emergencias',
    alterBills: '/modificar-minutas',
    issueTypes: '/tipos-asuntos',
    directory: '/directorio-telefonico',
    emergencyNumbers: '/telefonos-emergencia',
  },
  vehicles: {
    vehicles: '/vehiculos',
    alterVehicles: '/modificar-vehiculos',
    vehicleTypes: '/tipos-vehiculos',
    elements: '/elementos',
    radios: '/radios',
    alterRadios: '/modificar-radios',
  },
  preventionAndSecurity: {
    companies: '/empresas',
    alterCompanies: '/modificar-empresas',
    companiesTypes: '/tipos-empresas',
    certificates: '/certificados',
  },
  extinguishers: {
    extinguishers: '/extintores',
    alterExtinguishers: '/modificar-extintores',
    extinguisherTypes: '/tipos-extintores',
    customers: '/clientes',
  },
  reports: {
    curriculumReports: '/hojas-vida-reportes',
    billReports: '/minutas-reportes',
    specificReports: '/reportes-especificos',
  },
};

export const MENU = [
  {
    label: 'Personal',
    rol: 'personal',
    icon: 'people_alt',
    options: [
      {
        name: 'Hojas de vida',
        link: ROUTES.personal.curriculum,
      },
      {
        name: 'Personas',
        link: ROUTES.personal.persons,
      },
      {
        name: 'Ascensos',
        link: ROUTES.personal.promotions,
      },
      {
        name: 'Condecoraciones',
        link: ROUTES.personal.awards,
      },
      {
        name: 'Tipos de condecoraciones',
        link: ROUTES.personal.awardTypes,
      },
      {
        name: 'Nombramientos',
        link: ROUTES.personal.appointments,
      },
      {
        name: 'Sanciones',
        link: ROUTES.personal.sanctions,
      },
      {
        name: 'Rangos',
        link: ROUTES.personal.ranks,
      },
      {
        name: 'Categoria de rangos',
        link: ROUTES.personal.rankCategories,
      },
      {
        name: 'Cargos',
        link: ROUTES.personal.positions,
      },
      {
        name: 'Logs SQL',
        link: ROUTES.personal.logs,
      },
    ],
  },
  {
    label: 'Minuta',
    rol: 'minuta',
    icon: 'assignment',
    options: [
      {
        name: 'Minuta',
        link: ROUTES.bills.bills,
      },
      {
        name: 'Ver Emergencias',
        link: ROUTES.bills.emergency,
      },
      {
        name: 'Tipos de asuntos',
        link: ROUTES.bills.issueTypes,
      },
      {
        name: 'Directorio telefónico',
        link: ROUTES.bills.directory,
      },
      {
        name: 'Teléfonos de emergencia',
        link: ROUTES.bills.emergencyNumbers,
      },
    ],
  },
  {
    label: 'Vehiculos',
    rol: 'maquinista',
    icon: 'directions_car',
    options: [
      {
        name: 'Vehiculos',
        link: ROUTES.vehicles.vehicles,
      },
      {
        name: 'Tipos de Vehiculos',
        link: ROUTES.vehicles.vehicleTypes,
      },
      {
        name: 'Elementos',
        link: ROUTES.vehicles.elements,
      },
      {
        name: 'Radios',
        link: ROUTES.vehicles.radios,
      },
    ],
  },
  {
    label: 'Prevención y seguridad',
    rol: 'prevencion-y-seguridad',
    icon: 'warning',
    options: [
      {
        name: 'Empresas',
        link: ROUTES.preventionAndSecurity.companies,
      },
      {
        name: 'Tipos de Empresas',
        link: ROUTES.preventionAndSecurity.companiesTypes,
      },
      {
        name: 'Certificados',
        link: ROUTES.preventionAndSecurity.certificates,
      },
    ],
  },
  {
    label: 'Extintores',
    rol: 'extintores',
    icon: 'fireplace',
    options: [
      {
        name: 'Extintores',
        link: ROUTES.extinguishers.extinguishers,
      },
      {
        name: 'Tipos de Extintores',
        link: ROUTES.extinguishers.extinguisherTypes,
      },
      {
        name: 'Clientes',
        link: ROUTES.extinguishers.customers,
      },
    ],
  },
  {
    label: 'Reportes',
    rol: 'reportes',
    icon: 'print',
    options: [
      {
        name: 'Reporte de hojas de vida',
        link: ROUTES.reports.curriculumReports,
      },
      {
        name: 'Reporte de minutas',
        link: ROUTES.reports.billReports,
      },
      {
        name: 'Reporte especifico',
        link: ROUTES.reports.specificReports,
      },
    ],
  },
];
export const getMenu = (type) => {
  if (type === 'administrador-general' || type === 'supervisor') {
    return MENU;
  }
  if (type === 'minuta') {
    return [MENU.find(section => section.rol === type)];
  }
  return [MENU.find(section => section.rol === type), MENU.find(section => section.rol === 'minuta')];
};

export const getKeyEnglish = (type) => {
  let result = null;
  if (type === 'personal') result = { ...ROUTES.personal, ...ROUTES.bills };
  if (type === 'minuta') result = ROUTES.bills;
  if (type === 'maquinista') result = { ...ROUTES.vehicles, ...ROUTES.bills };
  if (type === 'prevencion-y-seguridad') result = { ...ROUTES.preventionAndSecurity, ...ROUTES.bills };
  if (type === 'extintores') result = { ...ROUTES.extinguishers, ...ROUTES.bills };
  if (type === 'administrador-general' || type === 'supervisor') result = ROUTES;
  return result;
};

export const getPossibleRoutes = (type) => {
  const options = Object.values(getKeyEnglish(type));
  return type === 'administrador-general' || type === 'supervisor'
    ? options.reduce((m, item) => {
      m.push(...Object.values(item));
      return m;
    }, []) : options;
};

export const generateLabel = (text, bank) => {
  const search = bank.find(el => el.en === text);
  return search ? search.es : null;
};

export const TABLESFORREPORT = [
  {
    id: 1,
    name: 'Nombramientos',
    method: 'appointments',
  },
  {
    id: 2,
    name: 'Condecoraciones',
    method: 'awards',
  },
  {
    id: 3,
    name: 'Tipos de condecoraciones',
    method: 'awardTypes',
  },
  {
    id: 4,
    name: 'Minuta',
    method: 'bills',
  },
  {
    id: 5,
    name: 'Certificados',
    method: 'certificates',
  },
  {
    id: 6,
    name: 'Empresas',
    method: 'companies',
  },
  {
    id: 7,
    name: 'Tipos de empresas',
    method: 'companyTypes',
  },
  {
    id: 8,
    name: 'Clientes',
    method: 'customers',
  },
  {
    id: 9,
    name: 'Directorio',
    method: 'directory',
  },
  {
    id: 10,
    name: 'Elementos',
    method: 'elements',
  },
  {
    id: 11,
    name: 'Numeros de emergencia',
    method: 'emergencyNumbers',
  },
  {
    id: 12,
    name: 'Cursos Bomberiles(Empleados)',
    method: 'employeeCourses',
  },
  {
    id: 13,
    name: 'Educaciones(Empleados)',
    method: 'employeeEducations',
  },
  {
    id: 14,
    name: 'Experiencias(Empleados)',
    method: 'employeeExperiences',
  },
  {
    id: 15,
    name: 'Informaciones(Empleados)',
    method: 'employeeInformations',
  },
  {
    id: 16,
    name: 'Empleados',
    method: 'employees',
  },
  {
    id: 17,
    name: 'Capacitaciones(Empleado)',
    method: 'employeeTrainings',
  },
  {
    id: 18,
    name: 'Extintores',
    method: 'extinguishers',
  },
  {
    id: 19,
    name: 'Tipos de extintores',
    method: 'extinguisherTypes',
  },
  {
    id: 20,
    name: 'Tipos de asuntos',
    method: 'issueTypes',
  },
  {
    id: 21,
    name: 'Logs',
    method: 'logs',
  },
  {
    id: 31,
    name: 'Logs2',
    method: 'logs2',
  },
  {
    id: 22,
    name: 'Personas',
    method: 'persons',
  },
  {
    id: 23,
    name: 'Cargos',
    method: 'positions',
  },
  {
    id: 24,
    name: 'Ascensos',
    method: 'promotions',
  },
  {
    id: 25,
    name: 'Radios',
    method: 'radios',
  },
  {
    id: 26,
    name: 'Categoria de rangos',
    method: 'rankCategories',
  },
  {
    id: 27,
    name: 'Rangos',
    method: 'ranks',
  },
  {
    id: 28,
    name: 'Sanciones',
    method: 'sanctions',
  },
  {
    id: 29,
    name: 'Vehiculos',
    method: 'vehicles',
  },
  {
    id: 30,
    name: 'Tipos de vehiculos',
    method: 'vehicleTypes',
  },
];

export const getColumnsForTable = (data, bank, statics) => {
  const fields = data.length ? Object.keys(data[0]) : [];
  return fields.length ? fields.reduce((m, item) => {
    const labelValid = generateLabel(item, bank);
    if (labelValid) {
      if (labelValid.includes('FECHA')) {
        m.push({
          name: item,
          required: statics.find(val => (item === val)) ? true : !true,
          label: labelValid,
          align: 'left',
          field: item,
          sortable: true,
          sort: (a, b) => new Date(dateToApiFormat(a)) - new Date(dateToApiFormat(b)),
        });
      } else {
        m.push({
          name: item,
          required: statics.find(val => (item === val)) ? true : !true,
          label: labelValid,
          align: 'left',
          field: item,
          sortable: true,
        });
      }
    }
    return m;
  }, []) : [];
};
