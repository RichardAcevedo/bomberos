import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import cityModel from './city';
import personModel from './person';
import userTypeModel from './userType';
import languagesModel from './language';
import militaryCardModel from './militaryCard';
import licenseModel from './license';

const booleanToString = boolean => (boolean ? 'Si' : 'No');
const stringToBoolean = string => (string === 'Si');

const multipleLanguages = languages => languages.reduce((m, item) => {
  m.push(languagesModel.getViewFormat(item));
  return m;
}, []);

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    code: path('codigo', dataApi),
    person: path('persona.nombre', dataApi), // tabla persona
    userType: path('tipo_usuario.nombre', dataApi), // tabla tipo_usuario
    npib: path('codigo_sistema_nacional_npib', dataApi),
    dateIn: dateToViewFormat(path('fecha_ingreso', dataApi)),
    active: path('activo', dataApi),
    filing: path('radicacion', dataApi),
    passport: path('pasaporte', dataApi),
    sure: path('seguro', dataApi),
    houseType: path('tipo_casa', dataApi),
    dependents: path('personas_a_cargo', dataApi),
    activity: path('actividad', dataApi),
    work: path('labor', dataApi),
    machine: path('maquina', dataApi),
    computer: path('computador', dataApi),
    hobi: path('hobi', dataApi),
    position: path('cargo', dataApi) ? path('cargo.nombre', dataApi) : '',
    city: path('ciudad.nombre', dataApi), // tabla ciudad
  }
);

const getViewFormatComplete = (dataApi) => {
  const result = {
    id: path('id', dataApi),
    code: path('codigo', dataApi),
    person: personModel.getViewFormatComplete(path('persona', dataApi)),
    userType: userTypeModel.getViewFormat(path('tipo_usuario', dataApi)), // tabla tipo_usuario
    npib: path('codigo_sistema_nacional_npib', dataApi),
    dateIn: dateToViewFormat(path('fecha_ingreso', dataApi)),
    active: stringToBoolean(path('activo', dataApi)),
    filing: path('radicacion', dataApi),
    passport: path('pasaporte', dataApi),
    sure: path('seguro', dataApi),
    houseType: path('tipo_casa', dataApi),
    dependents: path('personas_a_cargo', dataApi),
    activity: path('actividad', dataApi),
    work: path('labor', dataApi),
    machine: path('maquina', dataApi),
    computer: stringToBoolean(path('computador', dataApi)),
    hobi: path('hobi', dataApi),
    city: cityModel.getViewFormat(path('ciudad', dataApi)),
    position: path('cargo', dataApi) ? path('cargo.nombre', dataApi) : '',
    languages: multipleLanguages(path('idiomas', dataApi)),
    militaryCard: path('libreta', dataApi) ? militaryCardModel.getViewFormat(path('libreta', dataApi)) : null,
    license: path('licencia', dataApi) ? licenseModel.getViewFormat(path('licencia', dataApi)) : null,
  };
  if (path('withPassword', dataApi)) result.password = path('password', dataApi);
  return result;
};

const getApiFormat = (dataView) => {
  if (dataView.license) {
    dataView.license.expeditionDate = dateToApiFormat(dataView.license.expeditionDate);
    dataView.license.effectiveDate = dateToApiFormat(dataView.license.effectiveDate);
  }
  return {
    id: path('id', dataView),
    codigoSistemaNacionalNpib: path('npib', dataView),
    codigo: path('code', dataView),
    password: path('password', dataView),
    fechaIngreso: dateToApiFormat(path('dateIn', dataView)),
    activo: booleanToString(path('active', dataView)),
    radicacion: path('filing', dataView),
    pasaporte: path('passport', dataView),
    seguro: path('sure', dataView),
    tipoCasa: path('houseType', dataView),
    personasACargo: path('dependents', dataView),
    actividad: path('activity', dataView),
    labor: path('work', dataView),
    maquina: path('machine', dataView),
    computador: booleanToString(path('computer', dataView)),
    hobi: path('hobi', dataView),
    idTipoUsuario: path('userType.id', dataView),
    idCiudad: path('city.id', dataView),
    idPersona: path('person.id', dataView),
    libreta: path('militaryCard', dataView) ? militaryCardModel.getApiFormat(path('militaryCard', dataView)) : null,
    licencia: path('license', dataView) ? licenseModel.getApiFormat(path('license', dataView)) : null,
    idiomas: path('languages', dataView),
  };
};

export default {
  getViewFormatSimple,
  getViewFormatComplete,
  getApiFormat,
};
