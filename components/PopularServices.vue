<template>
  <div>
    <v-card class="mx-auto" max-width="100%" tile>
      <v-list-item-group v-for="category in categories" :key="category.id">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-semibold">
              <img width="30" class="inline-block" :src="category.photo" />
              <span class="ml-2">
                {{ category.name }}
              </span>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn-group>
              <v-btn
                elevation="0"
                class="text-xs  bg-gray-900 text-white font-semibold "
                :to="`/balance/${category.id}`"
              >
                Balansni tekshirish
              </v-btn>
              <v-btn
                elevation="0"
                class="text-xs bg-green-500 text-white font-semibold "
                :to="`/payment/${category.id}`"
              >
                To'lash
              </v-btn>
            </v-btn-group>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
      </v-list-item-group>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <nuxt-link to="/categories/"
              >Barcha xizmatlar
              <v-icon>
                mdi-open-in-new
              </v-icon>
            </nuxt-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <!-- <v-row>
      <v-col></v-col>
    </v-row> -->
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false,
      categories: []
    };
  },
  methods: {
    ...mapActions({
      fetchCategories: "categories/fetchCategories"
    })
  },
  async mounted() {
    try {
      this.loading = true;
      const { data } = await this.fetchCategories();

      this.categories = data.data;
    } catch (err) {
      this.$toast.error("Sohalarni yuklashda xatolik ro'y berdi");
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style></style>
