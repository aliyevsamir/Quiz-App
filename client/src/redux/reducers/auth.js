import { USER_LOADED, REGISTER_USER_SUCCESS } from '../types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload.data
            };

        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                token: payload.data.token,
                isAuthenticated: true,
                loading: false,
                user: payload.data.user
            };
        default:
            return state;
    }
}
