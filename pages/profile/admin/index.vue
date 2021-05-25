<template>
  <div>
    <h2 class="text-2xl mb-8">Xush kelibsiz, <strong>Admin</strong></h2>
    <v-tabs v-model="activeTab">
      <v-tab>Sohalar</v-tab>
      <!-- <v-tab>Xizmatlar</v-tab> -->
    </v-tabs>
    <v-tabs-items v-model="activeTab">
      <v-tab-item class="py-2">
        <template v-if="isCategoriesLoading">
          <v-skeleton-loader
            v-for="item in 4"
            :key="item"
            class=""
            max-width="300"
            type="list-item-avatar"
          ></v-skeleton-loader>
        </template>
        <v-card v-else flat>
          <v-expansion-panels accordion>
            <v-expansion-panel
              v-for="{ id, name, photo, items } in categories"
              :key="id"
            >
              <v-expansion-panel-header>
                <div class="flex justify-between">
                  <div>
                    <span class="mr-2">
                      <img
                        class="inline-block"
                        :src="photo"
                        width="30"
                        alt=""
                      />
                    </span>
                    <span>
                      {{ name }}
                    </span>
                  </div>
                  <div>
                    <v-btn
                      icon
                      :loading="deletingId == id"
                      @click.stop="onAddCategoryService(id)"
                      color="green"
                    >
                      <v-icon>
                        mdi-plus
                      </v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      :loading="deletingId == id"
                      @click="handleDeleteService(id)"
                      color="error"
                    >
                      <v-icon>
                        mdi-trash-can-outline
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div v-for="({ id, name, photo }, i) in items" :key="id">
                  <v-list-item>
                    <v-list-item-title>
                      <!-- <span class="mr-2">
                        <img
                          class="inline-block"
                          :src="photo"
                          width="30"
                          alt=""
                        />
                      </span> -->
                      <span>
                        {{ name }}
                      </span>
                    </v-list-item-title>
                    <v-list-item-actions>
                      <v-btn
                        icon
                        :loading="deletingId == id"
                        @click="handleDeleteCategory(id)"
                        color="error"
                      >
                        <v-icon>
                          mdi-trash-can-outline
                        </v-icon>
                      </v-btn>
                    </v-list-item-actions>
                  </v-list-item>
                  <v-divider v-if="i != items.length - 1"></v-divider>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-tab-item>
      <!-- <v-tab-item>
        <template v-if="isServicesLoading">
          <v-skeleton-loader
            v-for="item in 4"
            :key="item"
            class=""
            max-width="300"
            type="list-item-avatar"
          ></v-skeleton-loader>
        </template>
        <v-card v-else flat>
          <div v-for="{ id, name, photo } in services" :key="id">
            <v-list-item>
              <v-list-item-title>
                <span class="mr-2">
                  <img class="inline-block" :src="photo" width="30" alt="" />
                </span>
                <span>
                  {{ name }}
                </span>
              </v-list-item-title>
              <v-list-item-actions>
                <v-btn
                  icon
                  :loading="deletingId == id"
                  @click="handleDeleteService(id)"
                  color="error"
                >
                  <v-icon>
                    mdi-trash-can-outline
                  </v-icon>
                </v-btn>
              </v-list-item-actions>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        </v-card>
      </v-tab-item> -->
    </v-tabs-items>
    <v-dialog v-model="categoryDialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Soha qo'shish
        </v-btn>
      </template>

      <v-card class="p-4">
        <v-form>
          <h3 class="text-2xl font-semibold">Yangi soha qo'shish</h3>

          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="category.name"
                  label="Sohaning nomi"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Rasmni tanlang"
                  v-model="category.photo"
                  counter
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="categoryDialog = false">
            Yopish
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="handleCreateCategory"
            :loading="loading"
          >
            Qo'sish
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="servicesDialog" persistent max-width="600px">
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Xizmat qo'shish
        </v-btn>
      </template> -->

      <v-card class="p-4">
        <v-form>
          <h3 class="text-2xl font-semibold">
            <!-- {{ selectedCategory && categoryOptions[selectedCategory].label }}ga -->
            Xizmat qo'shish
          </h3>

          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedCategory"
                  :items="categoryOptions"
                  item-text="label"
                  label="Sohani tanlang"
                ></v-select>
                <v-text-field
                  v-model="service.name"
                  label="Xizmatning nomi"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <span class="text-gray-500">To'lov summasi (so'm):</span>
                {{ service.range[0].toLocaleString() }} dan -
                {{ service.range[1].toLocaleString() }} gacha
                <v-range-slider
                  label="To'lov intervali"
                  v-model="service.range"
                  :max="1000000"
                  :step="1000"
                  :min="10000"
                  class="align-center"
                >
                </v-range-slider>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Rasmni tanlang"
                  v-model="service.photo"
                  counter
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="servicesDialog = false">
            Yopish
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="handleCreateService"
            :loading="loading"
          >
            Qo'sish
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

const DEFAULT_SERVICE_VALUES = {
  name: "",
  photo: "",
  range: [0, 500000]
};

const DEFAULT_CATEGORY_VALUES = {
  name: "",
  photo: null
};

export default {
  data() {
    return {
      deletingId: null,
      categories: [],
      services: [],
      isCategoriesLoading: false,
      isServicesLoading: false,
      loading: false,
      activeTab: 0,
      categoryDialog: false,
      servicesDialog: false,
      category: DEFAULT_CATEGORY_VALUES,
      selectedCategory: null,
      service: DEFAULT_SERVICE_VALUES
    };
  },

  computed: {
    categoryOptions() {
      return this.categories.map(el => ({
        value: el.id,
        label: el.name
      }));
    }
  },

  methods: {
    ...mapActions({
      createCategory: "categories/createCategory",
      createCategoryService: "categories/createCategoryService",
      deleteCategory: "categories/deleteCategory",
      fetchCategories: "categories/fetchCategories",
      fetchServices: "services/fetchServices",
      deleteService: "services/deleteService"
    }),

    async getAllCategories() {
      try {
        this.isCategoriesLoading = true;
        const { data } = await this.fetchCategories();

        this.categories = data.data;
      } catch (err) {
        this.$toast.error("Sohalarni yuklashda xatolik ro'y berdi");
      } finally {
        this.isCategoriesLoading = false;
      }
    },

    async getCategoryServices() {
      try {
        this.loading = true;
        const { data } = await this.fetchServices();

        this.categories = data.data;
      } catch (err) {
        this.$toast.error("Sohalarni yuklashda xatolik ro'y berdi");
      } finally {
        this.loading = false;
      }
    },

    async getAllServices() {
      try {
        this.isServicesLoading = true;
        const { data } = await this.fetchServices();

        this.services = data.data;
      } catch (err) {
        this.$toast.error("Xizmatlarni yuklashda xatolik ro'y berdi");
      } finally {
        this.isServicesLoading = false;
      }
    },

    async handleCreateCategory() {
      try {
        this.loading = true;
        const { data } = await this.createCategory({ ...this.category });
        this.$toast.success("Soha qo'shildi");
        this.category = DEFAULT_CATEGORY_VALUES;
        this.categories.push(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async handleCreateService() {
      try {
        this.loading = true;
        const { data } = await this.createCategoryService({
          name: this.service.name,
          photo: this.service.photo,
          id: this.selectedCategory,
          min: this.service.range[0],
          max: this.service.range[1]
        });

        this.$toast.success("Xizmat qo'shildi");
        this.services.push(data.data);

        this.service = DEFAULT_SERVICE_VALUES;
        this.selectedCategory = null;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async handleDeleteCategory(id) {
      try {
        this.deletingId = id;

        const response = await this.deleteCategory({ id });

        this.$toast.success("Soha o'chirildi");
        this.categories = this.categories.filter(t => t.id !== id);
      } catch (err) {
        this.$toast.error("Sohani o'chirishda xatolik ro'y berdi");
      } finally {
        this.deletingId = null;
      }
    },
    async handleDeleteService(id) {
      try {
        this.deletingId = id;

        const response = await this.deleteService({ id });

        this.$toast.success("Xizmat o'chirildi");
        this.services = this.services.filter(t => t.id !== id);
      } catch (err) {
        this.$toast.error("Xizmat o'chirishda xatolik ro'y berdi");
      } finally {
        this.deletingId = null;
      }
    },
    onAddCategoryService(categoryId) {
      this.servicesDialog = true;
      this.selectedCategory = categoryId;
    }
  },
  mounted() {
    this.getAllCategories();
  },
  watch: {
    activeTab: {
      handler(value) {
        if (value === 1 && this.services.length === 0) {
          this.getAllServices();
        }

        if (value === 0 && this.categories.length === 0) {
          this.getAllCategories();
        }
      }
    }
  }
};
</script>

<style></style>
