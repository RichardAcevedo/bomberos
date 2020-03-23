import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import employeeModel from './employee';
import companyTypeModel from './companyType';

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
    address: path('direccion', dataApi),
    neighborhood: path('barrio', dataApi),
    cameraRegistration: path('registro_camara', dataApi), // nulo
    phone: path('telefono', dataApi),
    registerDate: dateToViewFormat(path('fecha_registro', dataApi)),
    representative: path('representante', dataApi),
    mobile: path('celular', dataApi), // nulo
    identificationCard: path('cedula', dataApi), // nulo
    nit: path('nit', dataApi), // nulo
    observation: path('observacion', dataApi), // nulo
    sn: path('sn', dataApi), // nulo
    quantity: path('cantidad', dataApi), // nulo
    area: path('area', dataApi), // nulo
    category: path('categoria', dataApi), // nulo
    level: path('nivel', dataApi), // nulo
    supervisor: path('supervisor.persona.nombre', dataApi),
    companyType: path('tipo_empresa.nombre', dataApi),
  }
);

const getViewFormatComplete = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
    address: path('direccion', dataApi),
    neighborhood: path('barrio', dataApi),
    cameraRegistration: path('registro_camara', dataApi), // nulo
    phone: path('telefono', dataApi),
    registerDate: dateToViewFormat(path('fecha_registro', dataApi)),
    representative: path('representante', dataApi),
    mobile: path('celular', dataApi), // nulo
    identificationCard: path('cedula', dataApi), // nulo
    nit: path('nit', dataApi), // nulo
    observation: path('observacion', dataApi), // nulo
    sn: path('sn', dataApi), // nulo
    quantity: path('cantidad', dataApi), // nulo
    area: path('area', dataApi), // nulo
    category: path('categoria', dataApi), // nulo
    level: path('nivel', dataApi), // nulo
    supervisor: employeeModel.getViewFormatSimple(path('supervisor', dataApi)),
    companyType: companyTypeModel.getViewFormat(path('tipo_empresa', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    nombre: path('name', dataView),
    direccion: path('address', dataView),
    barrio: path('neighborhood', dataView),
    registroCamara: path('cameraRegistration', dataView),
    telefono: path('phone', dataView),
    fechaRegistro: dateToApiFormat(path('registerDate', dataView)),
    representante: path('representative', dataView),
    celular: path('mobile', dataView),
    cedula: path('identificationCard', dataView),
    nit: path('nit', dataView),
    observacion: path('observation', dataView),
    sn: path('sn', dataView),
    cantidad: path('quantity', dataView),
    area: path('area', dataView),
    categoria: path('category', dataView),
    nivel: path('level', dataView),
    idInspector: path('supervisor.id', dataView),
    idTipoEmpresa: path('companyType.id', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormatSimple,
  getViewFormatComplete,
  getApiFormat,
};
