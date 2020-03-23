import { path } from '../../utils/helpers';

// const generateFormatActive = data => (data === 'Si');

// const generatePossibleAvatar = data => (!data ? 'https://cdn.quasar.dev/img/boy-avatar.png' : data);

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    // avatar: generatePossibleAvatar(path('avatar', dataApi)),
    avatar: path('avatar', dataApi),
    code: path('codigo', dataApi),
    name: path('nombre', dataApi),
    type: path('tipo', dataApi),
    active: path('activo', dataApi) === 'Si',
  }
);

const getApiFormat = dataView => (
  {
    codigo: path('code', dataView),
    password: path('password', dataView),
    tipo: path('type.id', dataView),
  }
);

const getFingerPrintFormat = code => (
  {
    codigo: code,
  }
);

export default {
  getViewFormat,
  getApiFormat,
  getFingerPrintFormat,
};
