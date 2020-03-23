<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6 text-bold">Confirmar eliminación</div>
        <div class="text-subtitle2 text-grey">
          Despues de efectuada esta acción no se podra recuperar la información.
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2">Datos afectados:</div>
        <div class="q-py-sm">
          <q-list separator>
            <q-item
              :key="index"
              v-for="(item, index) in dataShow"
            >
              <q-item-section>
              <q-item-label>{{ item.principal }}</q-item-label>
              <q-item-label caption>{{ item.caption }}</q-item-label>
              </q-item-section>
              <q-item-section side>{{ item.side }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="center">
        <q-btn color="primary" flat label="Cancelar" @click="onCancelClick" :disable="loading"/>
        <q-btn color="negative" flat label="Eliminar" @click="onOKClick" :loading="loading" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'DeleteTemplate',
  data() {
    return {
      loading: false,
      dialog: false,
    };
  },
  props: {
    dataShow: {
      type: Array,
      default: () => [],
    },
    dataDelete: {
      type: Array,
      default: () => [],
    },
    deleteFunction: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onDialogHide() {
      this.$emit('hide');
    },
    async onOKClick() {
      this.loading = true;
      await this.deleteFunction(this.dataDelete);
      this.loading = false;
      this.$emit('ok');
      this.hide();
    },
    onCancelClick() {
      this.hide();
    },
  },
};
</script>
