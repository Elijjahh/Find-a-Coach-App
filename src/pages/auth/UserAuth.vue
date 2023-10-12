<template>
    <main>
        <base-dialog :show="!!error" title="An error occured, try later." @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <base-dialog :show="isLoading" title="Authenticating..." fixed>
            <base-spinner></base-spinner>
        </base-dialog>
        <base-card>
            <form @submit.prevent="submitForm">
                <div class="form-control">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model.trim="email">
                </div>
                <div class="form-control">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model.trim="password">
                </div>
                <p v-if="!formIsValid">Please enter a valid email and password (must be at least 6 characters long.)</p>
                <base-button>{{ submitButtonCaption }}</base-button>
                <base-button type="button" mode="flat" @click="switchAuthMode">{{ switchModeButtonCaption }}</base-button>
            </form>
        </base-card>
    </main>
</template>

<script>

export default {
    data() {
        return {
            email: '',
            password: '',
            formIsValid: true,
            mode: 'login',
            isLoading: false,
            error: null
        }
    },
    computed: {
        submitButtonCaption() {
            const captions = {
                'login': 'Login',
                'signup': 'Signup'
            }
            return captions[this.mode];
        },
        switchModeButtonCaption() {
            const captions = {
                'login': 'Signup instead',
                'signup': 'Login instead'
            }
            return captions[this.mode];
        }
    },
    methods: {
        async submitForm() {
            this.formIsValid = true;
            if (this.email === '' || !this.email.includes('@') || this.password.length < 6) {
                this.formIsValid = false;
                return;
            }

            this.isLoading = true;

            const requestData = {
                email: this.email,
                password: this.password,
                mode: this.mode
            }

            try {
                await this.$store.dispatch('auth', requestData);

                const redirect = this.$route.query.redirect;
                const isCoach = this.$store.getters['coaches/isCoach'];
                let url = redirect;

                if ( (redirect === 'register' && isCoach) || !redirect ) {
                    url = 'coaches';
                }

                const redirectUrl = '/' + url;
                this.$router.replace(redirectUrl);
            } catch (error) {
                this.error = error.message || 'Failed to authenticate, try later.';
            }

            this.isLoading = false;
        },
        switchAuthMode() {
            if (this.mode === 'login') {
                this.mode = 'signup';
            } else {
                this.mode = 'login';
            }
        },
        handleError() {
            this.error = null;
        }
    }
}
</script>

<style scoped>
form {
    margin: 1rem;
    padding: 1rem;
}

.form-control {
    margin: 0.5rem 0;
}

label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
}

input,
textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: 1px solid #ccc;
    padding: 0.15rem;
}

input:focus,
textarea:focus {
    border-color: #3d008d;
    background-color: #faf6ff;
    outline: none;
}
</style>