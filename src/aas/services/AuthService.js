import axios from 'axios';
import { TOKEN_TYPE_VERIFY_EMAIL } from 'aas/common/constant';
import { ClearLocalData } from 'common/functions';
import { API_URL } from "config"

const BASE_URL = API_URL.AAS_URL;

const headers = {
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Headers': "Origin, Content-Type, Accept",
    // 'Content-Type': 'application/json',
    // 'Accept': 'application/json, text/plain, */*'
};

// No Query Required ------------------------------------------

class AuthService {
    async login(email, password, rememberMe = false) {
        var request = {
            "email": email,
            "password": password,
            "rememberMe": rememberMe,
        }

        return axios.post(BASE_URL + 'aas/login', request, { headers: headers });
    }

    async refreshToken(token) {
        const Headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        return axios.post(BASE_URL + 'aas/refreshToken', { "token": token }, { headers: Headers });
    }

    async signUp(email, firstName, lastName, password, token) {
        var request = {
            "email": email,
            "password": password,
            "firstName": firstName,
            "lastName": lastName
        }

        var params = { invitationtoken: token }

        return axios.post(BASE_URL + 'aas/sign-up', request, { headers: headers, params: params });
    }

    async verifyEmail(token) {
        var request = {
            "token": token,
            "type": TOKEN_TYPE_VERIFY_EMAIL
        }
        return axios.post(BASE_URL + 'aas/verifyemail', request, { headers: headers });
    }

    async forgotPassword(email) {
        var params = { email: email }
        return axios.post(BASE_URL + 'aas/forgotpassword', null, { headers: headers, params: params });
    }

    async resetPassword(email, token, password) {
        var request = {
            "email": email,
            "token": token,
            "password": password
        }
        return axios.post(BASE_URL + 'aas/resetpassword', request, { headers: headers });
    }

    async acceptTenantInvitation(token) {
        var params = { token: token }
        return axios.post(BASE_URL + 'aas/accepttenantinvite', null, { headers: headers, params: params });
    }

    async logout() {
        ClearLocalData();
    }

    //google
    async googleSignUp(code) {
        var params = { "code": code }
        let googleHeaders = { 'Content-Type': 'application/json' };
        return axios.post(BASE_URL + 'aas/googlesignup', params, { headers: googleHeaders });
    }

    async googleLogin(code, rememberMe = true) {
        let googleHeaders = { 'Content-Type': 'application/json' };
        var params = {
            code: code,
            rememberMe: rememberMe
        }
        return axios.post(BASE_URL + 'aas/googlelogin', params, { headers: googleHeaders });
    }
}

export default AuthService;
