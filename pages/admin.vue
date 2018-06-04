<template>
  <v-layout>
    <v-flex text-xs-center>
      <blockquote class="blockquote">
        Bienvenido, selecciona un elemento del menu de inicio
      </blockquote>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
   middleware: 'noAuthenticated',
}
</script>

