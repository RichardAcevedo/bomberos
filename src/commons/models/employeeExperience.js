import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    company: path('empresa', dataApi),
    position: path('cargo', dataApi),
    address: path('direccion', dataApi) ? path('direccion', dataApi) : null,
    phone: path('telefono', dataApi),
    boss: path('jefe', dataApi),
    labors: path('labores', dataApi),
    dateIn: dateToViewFormat(path('fecha_ingreso', dataApi)),
    dateOut: path('fecha_retiro', dataApi) ? dateToViewFormat(path('fecha_retiro', dataApi)) : null,
    reason: path('motivo', dataApi) ? path('motivo', dataApi) : null,
    check: path('verificacion', dataApi),
    idEmployee: path('id_empleado', dataApi),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    empresa: path('company', dataView),
    cargo: path('position', dataView),
    direccion: path('address', dataView) ? path('address', dataView) : null,
    telefono: path('phone', dataView),
    jefe: path('boss', dataView),
    labores: path('labors', dataView),
    fechaIngreso: dateToApiFormat(path('dateIn', dataView)),
    fechaRetiro: path('dateOut', dataView) ? dateToApiFormat(path('dateOut', dataView)) : null,
    motivo: path('reason', dataView) ? path('reason', dataView) : null,
    verificacion: path('check', dataView),
    idEmpleado: path('idEmployee', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormat,
  getApiFormat,
};
