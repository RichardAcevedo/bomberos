import dayjs from 'dayjs';
import 'dayjs/locale/es';

export const path = (ss, o) => (typeof ss === 'string' ? ss.split('.') : ss)
  .reduce((m, s) => (m && (s in m) ? m[s] : undefined), o);

export const numberWithCommas = (x) => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const formatDate = (date, format) => dayjs(date).format(format);

export const getCapitalize = (text) => {
  const newText = text.toLowerCase();
  return newText.replace(/^\w/, c => c.toUpperCase());
};

export const getError = (error) => {
  if (error.response) {
    const { data } = error.response;
    if (data.includes('(SQL:')) {
      const firstPart = data.message.split(' (SQL:');
      const finalPart = firstPart[0].split(']: ');
      return finalPart[1];
    }
    return data;
  }
  return 'An error has been ocurred. Please try again.';
};

export const orderObject = (data, field) => {
  if (field === 'person') {
    return data.sort((a, b) => {
      if (a.person > b.person) {
        return 1;
      }
      if (a.person < b.person) {
        return -1;
      }
      return 0;
    });
  }
  if (field === 'name') {
    return data.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  }
  return null;
};

export const dateToApiFormat = date => date.split('/').reverse().join('-');
export const dateToViewFormat = date => date.split('-').reverse().join('/');

export const downloadExcel = (data, name) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${name}.xlsx`); // or any other extension
  document.body.appendChild(link);
  link.click();
};

export default {};
