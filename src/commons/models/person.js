import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import bloodTypeModel from './bloodType';
import cityModel from './city';
import professionModel from './profession';

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    neighborhood: path('barrio', dataApi),
    address: path('direccion', dataApi),
    mobile: path('celular', dataApi),
    civilStatus: path('estado_civil', dataApi),
    birthDate: dateToViewFormat(path('fecha_nacimiento', dataApi)),
    photo: path('fotografia', dataApi),
    name: path('nombre', dataApi),
    sex: path('sexo', dataApi),
    phone: path('telefono', dataApi),
    live: path('vive', dataApi),
    document: path('documento', dataApi),
    height: path('estatura', dataApi),
    weight: path('peso', dataApi),
    email: path('email', dataApi),
    bloodType: path('tipo_sangre.nombre', dataApi), // tabla tipo_sangre
    birthCity: path('ciudad_nacimiento.nombre', dataApi), // tabla ciudad_nacimiento
    profession: path('profesion.nombre', dataApi), // tabla profesion
  }
);

const getViewFormatComplete = dataApi => (
  {
    id: path('id', dataApi),
    neighborhood: path('barrio', dataApi),
    address: path('direccion', dataApi),
    mobile: path('celular', dataApi),
    civilStatus: path('estado_civil', dataApi),
    birthDate: dateToViewFormat(path('fecha_nacimiento', dataApi)),
    photo: path('fotografia', dataApi),
    name: path('nombre', dataApi),
    sex: path('sexo', dataApi) === 'M' ? 'Masculino' : 'Femenino',
    phone: path('telefono', dataApi),
    live: path('vive', dataApi) === 'Si',
    document: path('documento', dataApi),
    height: path('estatura', dataApi),
    weight: path('peso', dataApi),
    email: path('email', dataApi),
    bloodType: bloodTypeModel.getViewFormat(path('tipo_sangre', dataApi)), // tabla tipo_sangre
    birthCity: cityModel.getViewFormat(path('ciudad_nacimiento', dataApi)), // tabla ciudad_nacimiento
    profession: professionModel.getViewFormat(path('profesion', dataApi)), // tabla profesion
  }
);

const getApiFormat = (dataView) => {
  const result = {
    barrio: path('neighborhood', dataView),
    direccion: path('address', dataView),
    celular: path('mobile', dataView),
    estadoCivil: path('civilStatus', dataView),
    fechaNacimiento: dateToApiFormat(path('birthDate', dataView)),
    fotografia: path('photo', dataView),
    nombre: path('name', dataView),
    sexo: path('sex', dataView) === 'Masculino' ? 'M' : 'F',
    telefono: path('phone', dataView),
    vive: path('live', dataView) === true ? 'Si' : 'No',
    documento: path('document', dataView),
    estatura: path('height', dataView),
    peso: path('weight', dataView),
    email: path('email', dataView),
    idTipoSangre: path('bloodType.id', dataView),
    idCiudadNacimiento: path('birthCity.id', dataView),
    idProfesion: path('profession.id', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormatSimple,
  getViewFormatComplete,
  getApiFormat,
};
