import axios from 'axios';
import {
    USER_LOADED,
    AUTH_ERROR,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOGIN_ADMIN,
    LOGOUT_ADMIN,
    SET_ERRORS,
    CLEAR_ERRORS
} from '../types';
import setAuthToken from '../../utils/setAuthToken';

export const loadUser = () => async dispatch => {
    try {
        const res = await axios.get('/api/v1/users/me');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        });

        return res;
    } catch (err) {
        console.error(JSON.stringify(err.response.data));

        localStorage.removeItem('token')

        dispatch({
            type: AUTH_ERROR
        });
    }
};

export const register = userData => async dispatch => {
    try {
        const res = await axios.post('/api/v1/users', userData);

        const { token } = res.data.data;
        setAuthToken(token);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        console.error(JSON.stringify(err.response.data));

        dispatch({
            type: REGISTER_USER_FAIL
        });
    }
};

export const adminLogin = loginData => async dispatch => {
    try {
        const res = await axios.post('/api/v1/users/login/admin', loginData);

        const { token } = res.data.data;
        setAuthToken(token);

        dispatch({
            type: CLEAR_ERRORS,
            payload: {}
        });

        dispatch({
            type: LOGIN_ADMIN,
            payload: res.data
        });
    } catch (err) {
        console.error(JSON.stringify(err.response.data));

        dispatch({
            type: SET_ERRORS,
            payload: err
        });
    }
};

export const registerAdmin = registerData => async dispatch => {
    try {
        const res = await axios.post(
            'api/v1/users/register/admin',
            registerData
        );

        dispatch({
            type: CLEAR_ERRORS,
            payload: {}
        });

        return res.data;
    } catch (err) {
        console.error(JSON.stringify(err.response.data));

        dispatch({
            type: SET_ERRORS,
            payload: err
        });
        return err.response.data;
    }
};

export const adminLogout = () => dispatch => {
    setAuthToken(null);
    dispatch({ type: LOGOUT_ADMIN });
};
