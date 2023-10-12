export default {
    coaches(state) {
        return state.coaches;
    },
    hasCoaches(state) {
        let coaches = state.coaches;
        return coaches && coaches.length > 0;
    },
    isCoach(_, getters, _2, rootGetters) {
        const coaches = getters.coaches,
            userId = rootGetters.userId;
        
        return coaches.some(coach => coach.id === userId);
    },
    shouldUpdate(state) {
        const lastFetch = state.lastFetch;
        if (!lastFetch) {
            return true;
        }
        const currentTimeStamp = new Date().getTime();
        return (currentTimeStamp - lastFetch) / 1000 > 60;
    }
}