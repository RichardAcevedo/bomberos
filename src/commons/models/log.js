import { path, dateToViewFormat } from '../../utils/helpers';

const getTableName = data => data.split('App\\Models\\')[1];
const splitData = (data, to) => {
  const parts = data.split(' ');
  return to === 'date' ? parts[0] : parts[1];
};

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    event: path('event', dataApi),
    affected: getTableName(path('auditable_type', dataApi)),
    idAffected: path('auditable_id', dataApi),
    oldValues: path('old_values', dataApi) ? JSON.stringify(path('old_values', dataApi)) : path('old_values', dataApi),
    newValues: path('new_values', dataApi) ? JSON.stringify(path('new_values', dataApi)) : path('new_values', dataApi),
    url: path('url', dataApi),
    ip: path('ip_address', dataApi),
    from: path('user_agent', dataApi),
    date: dateToViewFormat(splitData(path('created_at', dataApi), 'date')),
    hour: splitData(path('created_at', dataApi), 'hour'),
  }
);

export default {
  getViewFormat,
};
