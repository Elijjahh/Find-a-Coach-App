<template>
    <base-card>
        <h2>Find your coach</h2>
        <span class="filter-option">
            <input type="checkbox" id="frontend" checked @change="setFilter">
            <label for="frontend">Frontend</label>
        </span>
        <span class="filter-option">
            <input type="checkbox" id="backend" checked @change="setFilter">
            <label for="backend">Backend</label>
        </span>
        <span class="filter-option">
            <input type="checkbox" id="career" checked @change="setFilter">
            <label for="career">Career</label>
        </span>
    </base-card>
</template>

<script>
export default {
    emits: ['change-filter'],
    data() {
        return {
            filters: null
        }
    },
    methods: {
        setFilter(event) {
            const inputId = event.target.id,
                isActive = event.target.checked,
                updatedFilters = {
                    ...this.filters,
                    [inputId]: isActive,
                };
            this.filters = updatedFilters;
        },
    },
    watch: {
        filters(newVal) {
            this.$emit('change-filter', newVal);
        }
    },
    created() {
        this.filters = {
                frontend: true,
                backend: true,
                career: true,
            };
    }
}
</script>

<style scoped>
h2 {
  margin: 0.5rem 0;
}

.filter-option {
  margin-right: 1rem;
}

.filter-option label,
.filter-option input {
  vertical-align: middle;
}

.filter-option label {
  margin-left: 0.25rem;
}

.filter-option.active label {
  font-weight: bold;
}
</style>