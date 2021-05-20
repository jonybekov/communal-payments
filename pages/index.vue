<template>
  <v-container class="block">
    <div>
      <h1 class="text-4xl font-bold mb-4">
        Onlayn to'lovlar
      </h1>
      <div>
        <v-autocomplete
          placeholder="Xizmat nomini kiriting"
          auto-select-first
          clearable
          filled
          solo
        ></v-autocomplete>
        <!-- <v-btn class="text-white bg-green-500">
          Qidirish
        </v-btn> -->
      </div>
    </div>
    <div>
      <div class="flex mb-4">
        <span class="mr-4">
          <img width="40" height="40" src="/images/home.webp" alt="" />
        </span>
        <h3 class="text-3xl  font-bold">
          Kommunal xizmatlar
        </h3>
      </div>
      <Services />
    </div>
  </v-container>
</template>

<script>
export default {};
</script>

<style></style>
