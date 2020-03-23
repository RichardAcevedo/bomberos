import { Notify } from 'quasar';

export default {
  components: {
    Notify,
  },
  methods: {
    createNotification({
      message,
      timeout = 3000,
      icon = 'warning',
      color = 'white',
      textColor = 'black',
      position = 'top',
      closeBtn = false,
    }) {
      Notify.create({
        timeout,
        icon,
        color,
        textColor,
        message,
        position,
        closeBtn,
      });
    },
  },
};
