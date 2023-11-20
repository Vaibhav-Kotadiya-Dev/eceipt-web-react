import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { toast } from 'react-toastify';
import validator from 'validator';

// material-ui
// import { styled } from '@mui/material/styles';
// import { useTheme } from "@mui/material/styles";
import {
    Box, Divider, Grid, Stack, Typography, Button, Checkbox, FormControl, FormControlLabel,
    IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, FormHelperText
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


import MainCard from "ui-component/cards/MainCard";
import SubCard from 'ui-component/cards/SubCard'
import AnimateButton from 'ui-component/common/AnimateButton';
import BlueBgWrapper from "base/layout/BlueBgWrapper";
import ZBackdrop from 'ui-component/ZBackdrop';

// project imports
import AuthService from "aas/services/AuthService";
import UserService from 'aas/services/UserService';
import { useGoogleLogin } from '@react-oauth/google';

import { LsUserToken, LsUserTenant, LsTokenExpire, ssun, ssur, LsUserRefreshToken, LsUserRememberMe } from 'aas/common/constant';
import { ErrorTranslator } from 'aas/common/functions';
import { ClearLocalData } from 'common/functions';
import { gridSpacing } from 'common/constant';

// assets
import Google from 'aas/assets/social-google.svg';
import Logo from 'ui-component/common/Logo';



// import Logo from 'ui-component/Logo';
// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
    // console.log('Login')
    const theme = useTheme();
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(false);

    const authService = new AuthService();

    // const [username, setUsername] = useState('zhaopeng8253@gmail.com');
    // const [password, setPassword] = useState('123456');

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const [usernameValid, setUsernameValid] = useState(true);

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const [errorMsg, setErrorMsg] = useState('');

    const isValid = () => {
        if (!usernameValid) {
            setErrorMsg('Please enter correct email address.')
            return false
        }
        setErrorMsg('')
        return true
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValid()) {
            return
        }

        ClearLocalData();
        setLoading(true)
        localStorage.setItem(LsUserRememberMe, rememberMe);
        authService.login(username, password, rememberMe).then(
            async (response) => {
                if (response.status === 200 && response.data.code === "SUCCESS") {
                    toast.success('Login Success')
                    await localStorage.setItem(LsUserToken, response.data.data.token);
                    await localStorage.setItem(LsUserTenant, response.data.data.tenantId);
                    await localStorage.setItem(LsTokenExpire, response.data.data.expiration_time);
                    if (response.data.data.refreshToken) {
                        await localStorage.setItem(LsUserRefreshToken, response.data.data.refreshToken);
                    }
                    new UserService().getOwnInfo().then(
                        async (response) => {
                            if (response.status === 200 && response.data.code === "SUCCESS") {
                                localStorage.setItem(ssun, response.data.data.firstName);
                                localStorage.setItem(ssur, response.data.data.roles);
                            }
                            setTimeout(() => {
                                navigate("../home")
                            }, 500);
                        }, error => {
                            console.log(error);
                            setTimeout(() => {
                                navigate("../home")
                            }, 500);
                            //   setErrorMsg("user name / password incorrect")
                        })
                } else {
                    setLoading(false)
                    setErrorMsg("user name / password incorrect")
                }
            }, error => {
                setLoading(false)
                setErrorMsg("user name / password incorrect")
            })
    }

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: response => {
            setLoading(true)
            localStorage.setItem(LsUserRememberMe, rememberMe);
            authService.googleLogin(response.code, rememberMe).then(
                async (response) => {
                    if (response.status === 200 && response.data.code === "SUCCESS") {
                        toast.success('Login Success')
                        await localStorage.setItem(LsUserToken, response.data.data.token);
                        await localStorage.setItem(LsUserTenant, response.data.data.tenantId);
                        await localStorage.setItem(LsTokenExpire, response.data.data.expiration_time);
                        if (response.data.data.refreshToken) {
                            await localStorage.setItem(LsUserRefreshToken, response.data.data.refreshToken);
                        }
                        new UserService().getOwnInfo().then(
                            async (response) => {
                                if (response.status === 200 && response.data.code === "SUCCESS") {
                                    localStorage.setItem(ssun, response.data.data.firstName);
                                    localStorage.setItem(ssur, response.data.data.roles);
                                }
                                setTimeout(() => {
                                    navigate("../home")
                                }, 500);
                            }, error => {
                                console.log(error);
                                setTimeout(() => {
                                    navigate("../home")
                                }, 500);
                            })
                    } else {
                        toast.error(ErrorTranslator("Unable to login, Have you registered?"));
                        setLoading(false)
                    }
                }, error => {
                    toast.error(ErrorTranslator(error.message));
                    setLoading(false)
                })
        },
        onError: error => {
            toast.error(error);
            setLoading(false)
        },
        flow: 'auth-code'
    });

    return (
        <BlueBgWrapper>
            <ZBackdrop open={isLoading} />
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: "100vh", width: '100%', display: 'flex' }} >
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "calc(100vh - 68px)" }}>
                        <Grid item sx={{ position: 'absolute', left: { lg: '40px', md: '15px' }, top: { lg: '40px', md: '15px' }, display: { md: 'block', xs: 'none' } }}>
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <Typography color={'white'} variant='h1' sx={{ fontFamily: 'Montserrat' }}>Ecepit</Typography>
                                    <Typography color={'white'} variant='subtitle1' sx={{ fontFamily: 'Montserrat' }}>Manage your business with just a few clicks</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0, pl: { lg: 80, md: 0, xs: 0 } }} >
                            <MainCard
                                sx={{
                                    width: { lg: 475, xs: 370 },
                                    margin: { xs: 0, md: 3 },
                                    "& > *": { flexGrow: 1, flexBasis: "50%", },
                                }} content={false}>
                                <SubCard sx={{ border: 0 }} disableHover noPadding>
                                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                                        <Grid item>
                                            <Logo />
                                        </Grid>
                                    </Grid>
                                </SubCard>



                                <SubCard sx={{ border: 0 }} contentSX={{ pt: 1 }} disableHover>
                                    <Grid item xs={12} sx={{ mb: 2 }} container alignItems="center" justifyContent="center">
                                        <Typography variant="subtitle1">Sign in with Email</Typography>
                                    </Grid>

                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={gridSpacing}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    required
                                                    label="Email Address"
                                                    value={username ?? ""}
                                                    error={!usernameValid}
                                                    onChange={(e) => {
                                                        setUsername(e.target.value)
                                                        setUsernameValid(validator.isEmail(e.target.value))
                                                    }}
                                                    helperText={!usernameValid ? 'Invalid Email Format.' : ''}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormControl variant="outlined" sx={{ width: '100%' }}>
                                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                                    <OutlinedInput
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password ?? ""}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    onMouseDown={(event) => event.preventDefault()}
                                                                    edge="end">
                                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        label="Password"
                                                    />
                                                </FormControl>
                                            </Grid>

                                            {errorMsg !== null && errorMsg.length > 0 ? <>
                                                <Grid item xs={12} >
                                                    <FormHelperText error>{errorMsg}</FormHelperText>
                                                </Grid></> : null}

                                            <Grid item xs={12}>
                                                <Grid container spacing={gridSpacing}>
                                                    <Grid item xs={6}>
                                                        <FormControlLabel
                                                            label="Remember Me"
                                                            control={
                                                                <Checkbox
                                                                    color="primary"
                                                                    checked={rememberMe}
                                                                    label="Remember Me"
                                                                    onChange={(e) => setRememberMe(e.target.checked)} />
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                                        <Typography component={Link} to="/forgotpassword" color="primary" sx={{ textDecoration: "none" }} >
                                                            Forgot Password?
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <AnimateButton>
                                                    <Button disableElevation disabled={false} fullWidth size="large" type="submit" variant="contained" color="primary"                              >
                                                        Sign in
                                                    </Button>
                                                </AnimateButton>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </SubCard>
                                <SubCard sx={{ border: 0 }} contentSX={{ py: 0 }} disableHover noPadding>
                                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                                        <Grid item xs={12}>
                                            <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                                <Button variant="outlined" disableRipple disabled
                                                    sx={{ cursor: 'unset', m: 1, py: 0.5, px: 7, borderColor: `${theme.palette.primary.light} !important`, color: `${theme.palette.grey[900]}!important`, fontWeight: 500, borderRadius: `5px` }}>
                                                    OR
                                                </Button>
                                                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mb: 2 }}>
                                            <AnimateButton>
                                                <Button disableElevation fullWidth size="large" variant="outlined" onClick={handleGoogleLogin}
                                                    sx={{ color: 'grey.700', backgroundColor: theme.palette.grey[50], borderColor: theme.palette.primary }}>
                                                    <img src={Google} alt="google" width={16} height={16} style={{ marginRight: 10 }} />
                                                    Sign in with Google
                                                </Button>
                                            </AnimateButton>
                                        </Grid>
                                    </Grid>
                                </SubCard>

                                <SubCard sx={{ border: 0 }} disableHover>
                                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container spacing={gridSpacing}>
                                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Typography component={Link} to="/register" variant="subtitle1" sx={{ textDecoration: "none" }}>
                                                        Don&apos;t have an account?
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </SubCard>
                            </MainCard>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="subtitle2" target="_blank" underline="hover">
                            expressoom.com
                        </Typography>
                        <Typography variant="subtitle2" target="_blank" underline="hover">
                            &copy; expressoom.com
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </BlueBgWrapper >
    );
};

export default Login;
