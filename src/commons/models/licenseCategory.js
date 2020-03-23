import { path } from '../../utils/helpers';

const getApiFormat = dataView => (
  {
    id: path('id', dataView),
    nombre: path('name', dataView),
    claseVehiculo: path('vehicleClass', dataView),
    servicio: path('service', dataView),
  }
);

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
    vehicleClass: path('clase_vehiculo', dataApi),
    service: path('servicio', dataApi),
  }
);

export default {
  getApiFormat,
  getViewFormat,
};
