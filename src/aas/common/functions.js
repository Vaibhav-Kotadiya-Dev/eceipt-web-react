import { LsUserToken, LsUserTenant, LsTokenExpire, LsUserRefreshToken, LsUserRememberMe } from 'aas/common/constant';
import AuthService from "aas/services/AuthService";

export function GetAuthHeader() {
    return {
        'Authorization': `Bearer ${localStorage.getItem(LsUserToken)}`,
        'tenantId': localStorage.getItem(LsUserTenant),
        // 'Access-Control-Allow-Origin': "*",
        // 'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept",
        // 'Content-Type': 'application/json',
        // 'Accept': 'application/json, text/plain, */*'
    }
}

export function GetTenantId() {
    return localStorage.getItem(LsUserTenant)
}


export function ResizeBase64(base64, maxWidth, maxHeight) {
    // Max size for thumbnail
    if (typeof (maxWidth) === 'undefined') maxWidth = 500;
    if (typeof (maxHeight) === 'undefined') maxHeight = 500;

    // Create and initialize two canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var canvasCopy = document.createElement("canvas");
    var copyContext = canvasCopy.getContext("2d");

    // Create original image
    var img = new Image();
    img.src = base64;

    new Promise((resolve, reject) => {
        img.onload = () => {
            resolve({ width: img.width, height: img.height })
        }
    }).then((e) => {
        var ratio = 1;
        if (img.width > maxWidth)
            ratio = maxWidth / img.width;
        else if (img.height > maxHeight)
            ratio = maxHeight / img.height;

        // Draw original image in second canvas
        canvasCopy.width = img.width;
        canvasCopy.height = img.height;
        copyContext.drawImage(img, 0, 0, img.width, img.height);

        // Copy and resize second canvas to first canvas
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL()
    })
}


export function ErrorTranslator(error) {
    if (error.includes('Duplicate entry') && error.includes('for key \'users.')) {
        return "Email already taken, please choose another email address."
    }

    return error;

}

export function throttled(fn, delay) {
    let canRun = true;
    return function () {
        if (!canRun) return;
        canRun = false;
        setTimeout(() => {
            fn.apply(this, arguments);
            canRun = true;
        }, delay);
    };
}
export function RefreshTokenIfNeed() {
    var fc = async () => {
        var expirationTime = localStorage.getItem(LsTokenExpire);
        var refreshToken = localStorage.getItem(LsUserRefreshToken);
        var rememberMe = localStorage.getItem(LsUserRememberMe);
        //token有效不到30分钟时自动刷新token
        var expiring = expirationTime - (30 * 60 * 1000) < new Date().getTime()
        if (Boolean(rememberMe) && refreshToken && expiring) {
            var service = new AuthService()
            var response = await service.refreshToken(refreshToken)
            if (response.status === 200 && response.data.code === "SUCCESS") {
                localStorage.setItem(LsUserToken, response.data.data.token);
                localStorage.setItem(LsTokenExpire, response.data.data.expiration_time);
                return Promise.resolve(response.data.data)
            }
        }
        return Promise.resolve(null);
    };
    return fc()
    // throttled(fc, 500)();
}

