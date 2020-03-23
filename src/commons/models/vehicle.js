import { path } from '../../utils/helpers';
import vehicleTypeModel from './vehicleType';
import elementModel from './element';

const multipleElements = elements => elements.reduce((m, item) => {
  m.push(elementModel.getViewFormat(item));
  return m;
}, []);

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
    mark: path('marca', dataApi),
    model: path('modelo', dataApi),
    licensePlate: path('placa', dataApi),
    elements: path('elementos', dataApi) ? multipleElements(path('elementos', dataApi)) : path('elementos', dataApi),
    vehicleType: path('tipo_vehiculo.nombre', dataApi),
  }
);

const getViewFormatComplete = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
    mark: path('marca', dataApi),
    model: path('modelo', dataApi),
    licensePlate: path('placa', dataApi),
    elements: path('elementos', dataApi) ? multipleElements(path('elementos', dataApi)) : path('elementos', dataApi),
    vehicleType: vehicleTypeModel.getViewFormat(path('tipo_vehiculo', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    nombre: path('name', dataView),
    marca: path('mark', dataView),
    modelo: path('model', dataView),
    placa: path('licensePlate', dataView),
    elementos: path('elements', dataView),
    idTipoVehiculo: path('vehicleType.id', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormatSimple,
  getViewFormatComplete,
  getApiFormat,
};
