<template>
    <v-layout>
    <v-flex text-xs-center>
      <v-card>
        <v-card-title primary-title>
            <div class="headline">Mensajes Push</div>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                 <v-text-field
      v-model="titulo"
      :rules="titleRules"
      :counter="10"
      label="Titulo"
      required
    ></v-text-field>
     <v-text-field
      v-model="body"
      :rules="bodyRules"
      :counter="10"
      label="Cuerpo del mensaje"
      required
    ></v-text-field>
     <v-btn
      :disabled="!valid"
      @click="submit"
    >
    submit
     </v-btn>
            </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
     data: () => ({
         valid: false,
      titulo: '',
      titleRules: [
        v => !!v || 'El titulo es requerido',
        v => v.length >= 6 || 'El titulo debe ser mayor a 6 caracteres'
      ],
      body: '',
      bodyRules: [
        v => !!v || 'El cuerpo es reuerido',
        v => v.length >= 6 || 'El cuerpo debe ser mayor a 10 caracteres'
      ]
    }),
    methods: {
        submit(){

        }
    }
}
</script>
