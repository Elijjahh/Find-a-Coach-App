<template>
    <main>
        <base-dialog :show="!!error" title="An error occured!" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <coach-filter @change-filter="setFilter"></coach-filter>
        </section>
        <section>
            <base-card>
                <div class="controls">
                    <base-button mode="outline" @click="loadCoaches(true)">Refresh</base-button>
                    <base-button v-if="!isLoggedIn" link to="/auth?redirect=register">Login to register as a coach</base-button>
                    <base-button v-if="isLoggedIn && !isLoading && !isCoach" link to="/register">Register as a coach</base-button>
                </div>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <ul v-else-if="!isLoading && hasCoaches">
                    <coach-item v-for="coach in filteredCoaches" :key="coach.id" :id="coach.id" :firstName="coach.firstName"
                        :lastName="coach.lastName" :rate="coach.hourlyRate" :areas="coach.areas"></coach-item>
                </ul>
                <h3 v-else>No coaches found</h3>
            </base-card>
        </section>
    </main>
</template>

<script>
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';

export default {
    components: {
        CoachItem,
        CoachFilter,
    },
    data() {
        return {
            error: null,
            isLoading: false,
            filters: null
        }
    },
    methods: {
        setFilter(updatedFilters) {
            this.filters = updatedFilters;
        },
        async loadCoaches(refresh = false) {
            this.isLoading = true;
            try {
                await this.$store.dispatch('coaches/loadCoaches', { forceRefresh: refresh });
            } catch (error) {
                this.error = error.message || 'Something went wrong!';
            }
            this.isLoading = false;
        },
        handleError() {
            this.error = null;
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.getters.isAuthenticated;
        },
        isCoach() {
            return this.$store.getters['coaches/isCoach'];
        },
        filteredCoaches() {
            const coaches = this.$store.getters['coaches/coaches'];

            if (this.filters === null) {
                return coaches;
            }
            return coaches.filter(coach => {
                const frontendPass = this.filters.frontend && coach.areas.includes('frontend'),
                    backendPass = this.filters.backend && coach.areas.includes('backend'),
                    careerPass = this.filters.career && coach.areas.includes('career');
                if (frontendPass || backendPass || careerPass) {
                    return true;
                }
                return false;
            });
        },
        hasCoaches() {
            return this.$store.getters['coaches/hasCoaches']
        }
    },
    created() {
        this.loadCoaches();
    }
}
</script>

<style scoped>
ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.controls {
    display: flex;
    justify-content: space-between;
}
</style>