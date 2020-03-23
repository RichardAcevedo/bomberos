import { path } from '../../utils/helpers';
import vehicleModel from './vehicle';

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    serial: path('serial', dataApi),
    mark: path('marca', dataApi),
    state: path('estado', dataApi),
    signal: path('señal', dataApi),
    type: path('tipo', dataApi),
    vehicle: path('vehiculo.nombre', dataApi),
  }
);

const getViewFormatComplete = dataApi => (
  {
    id: path('id', dataApi),
    serial: path('serial', dataApi),
    mark: path('marca', dataApi),
    state: path('estado', dataApi),
    signal: path('señal', dataApi),
    type: path('tipo', dataApi),
    vehicle: vehicleModel.getViewFormatComplete(path('vehiculo', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    serial: path('serial', dataView),
    marca: path('mark', dataView),
    estado: path('state', dataView),
    señal: path('signal', dataView),
    tipo: path('type', dataView),
    idVehiculo: path('vehicle.id', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormatSimple,
  getViewFormatComplete,
  getApiFormat,
};
