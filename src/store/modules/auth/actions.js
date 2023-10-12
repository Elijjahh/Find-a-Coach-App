let timer;

export default {
    async auth(context, payload) {
        const urls = {
            'signup': 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAnxe0vzrjwjDi2ulc8gpiMyerZLqswyaA',
            'login': 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAnxe0vzrjwjDi2ulc8gpiMyerZLqswyaA'
        }

        const response = await fetch(urls[payload.mode], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to authenticate');
        }

        const expiresIn = +responseData.expiresIn * 1000;
        const expirationDate = new Date().getTime() + expiresIn;

        localStorage.setItem('token', responseData.idToken);
        localStorage.setItem('userId', responseData.localId);
        localStorage.setItem('tokenExpiration', expirationDate);

        timer = setTimeout(() => {
            context.dispatch('autoLogout');
        }, expiresIn);

        context.commit('setUser', {
            token: responseData.idToken,
            userId: responseData.localId,
        });
    },
    tryLogin(context) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        const expiresIn = +tokenExpiration - new Date().getTime();

        if ( expiresIn < 0) {
            return;
        }

        timer = setTimeout(() => {
            context.dispatch('autoLogout');
        }, expiresIn);

        if (token && userId) {
            context.commit('setUser', {
                token: token,
                userId: userId,
            });
        }
    },
    logout(context) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiration');

        clearTimeout(timer);

        context.commit('setUser', {
            userId: null,
            token: null,
        });
    },
    autoLogout(context) {
        context.dispatch('logout');
        context.commit('setAutoLogout')
    }
}