import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import validator from 'validator';
// material-ui
// import { useTheme } from '@mui/material/styles';
import {
    Box, Divider, Grid, Typography, Button, Checkbox, FormControl, FormControlLabel,
    IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, FormHelperText
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// project imports
import { gridSpacing } from 'common/constant';
import BlueBgWrapper from 'base/layout/BlueBgWrapper';
import AnimateButton from 'ui-component/common/AnimateButton';
import AuthFooter from 'ui-component/AuthFooter';
import MainCard from "ui-component/cards/MainCard";
import SubCard from 'ui-component/cards/SubCard'
import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';
import ZBackdrop from 'ui-component/ZBackdrop';

import AuthService from "aas/services/AuthService";
import { useGoogleLogin } from '@react-oauth/google';
import { ErrorTranslator } from 'aas/common/functions';

// assets
import Google from 'aas/assets/social-google.svg';
import Logo from 'ui-component/common/Logo';
import { toast } from 'react-toastify';
import { strengthIndicator } from 'aas/common/FieldValidator';

// ===============================|| AUTH3 - REGISTER ||=============================== //
const Register = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [isLoading, setLoading] = useState(false);

    const [confirm, setConfirm] = useState(false);
    const [confirmMsg, setConfirmMsg] = useState(false);

    const [token, setToken] = useState(null);

    const authService = new AuthService();

    const [username, setUsername] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(true);

    const [usernameValid, setUsernameValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const isValid = () => {
        if (!usernameValid) {
            setErrorMsg('Please enter correct email address.')
            return false
        }
        if (!passwordValid) {
            setErrorMsg('Password strength too low.')
            return false
        }
        setErrorMsg('')
        return true
    }


    useEffect(() => {
        var token = searchParams.get('t')
        if (token !== null) {
            setToken(token)
        }
    }, [setToken, searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid()) {
            return
        }
        setLoading(true)
        authService.signUp(username, firstName, lastName, password, token).then(
            async (response) => {
                console.log(response)
                if (response.status === 200 && response.data.code === "SUCCESS") {
                    setTimeout(() => {
                        setLoading(false)
                        setConfirmMsg('An email has been sent to your email address, please check your email to activate the account.')
                        setConfirm(true)
                    }, 500);
                } else {
                    setErrorMsg(ErrorTranslator(response.data.message))
                    setLoading(false)
                }
            }, error => {
                setErrorMsg(error.response.data)
                setLoading(false)
            })
    }

    const handlePressGoogleRegistration = useGoogleLogin({
        onSuccess: response => {
            setLoading(true)
            authService.googleSignUp(response.code).then(
                async (response) => {
                    // console.log(response)
                    if (response.status === 200 && response.data.code === "SUCCESS") {
                        setTimeout(() => {
                            setConfirmMsg('Your account is registered, please proceed to login.')
                            setConfirm(true)
                            setLoading(false)
                        }, 500);
                    } else {
                        toast.error(ErrorTranslator(response.data.message));
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
            <ZPromptConfirmation open={confirm}
                fullWidth
                title={"Please confirm"}
                text={confirmMsg}
                confirmButtonText={'Ok'}
                onClickConfirm={() => { setConfirm(false); navigate("../login") }}
            />
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ position: 'absolute', left: { lg: '40px', md: '15px' }, top: { lg: '40px', md: '15px' }, display: { md: 'block', xs: 'none' } }}>
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <Typography color={'white'} variant='h1' sx={{ fontFamily: 'Montserrat' }}>Ecepit</Typography>
                                    <Typography color={'white'} variant='subtitle1' sx={{ fontFamily: 'Montserrat' }}>Manage your business with just a few clicks</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0, pl: { lg: 80, md: 0 } }} >
                            <MainCard sx={{
                                maxWidth: { xs: 400, lg: 475 },
                                margin: { xs: 2.5, md: 3 },
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
                                        <Typography variant="subtitle1">Sign Up with Email</Typography>
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
                                                <TextField
                                                    fullWidth
                                                    required
                                                    label="First Name"
                                                    value={firstName ?? ""}
                                                    onChange={(e) => { setFirstName(e.target.value) }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    required
                                                    label="Last Name"
                                                    value={lastName ?? ""}
                                                    onChange={(e) => { setLastName(e.target.value) }}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormControl variant="outlined" sx={{ width: '100%' }}>
                                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                                    <OutlinedInput
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password ?? ""}
                                                        onChange={(e) => {
                                                            setPassword(e.target.value)
                                                            setPasswordValid(strengthIndicator(e.target.value) === 5)
                                                        }}
                                                        required
                                                        error={!passwordValid}
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
                                                    {!passwordValid && (
                                                        <FormHelperText error >{'Invalid password format.(Minimum 8 characters, with mix of Numbers/Upper/Lower/Special character)'}</FormHelperText>)}
                                                </FormControl>
                                            </Grid>


                                            {errorMsg !== null && errorMsg.length > 0 ? <>
                                                <Grid item xs={12} >
                                                    <FormHelperText error>{errorMsg}</FormHelperText>
                                                </Grid></> : null}

                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                                                    }
                                                    label={
                                                        <Typography variant="subtitle1">
                                                            Agree with &nbsp;
                                                            <Typography variant="subtitle1" component={Link} to="#">
                                                                Terms & Condition.
                                                            </Typography>
                                                        </Typography>
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <AnimateButton>
                                                    <Button disableElevation disabled={false} fullWidth size="large" type="submit" variant="contained" color="primary"                              >
                                                        Sign Up
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
                                        <Grid item xs={12}>
                                            <AnimateButton>
                                                <Button disableElevation fullWidth size="large" variant="outlined" onClick={handlePressGoogleRegistration}
                                                    sx={{ color: 'grey.700', backgroundColor: theme.palette.grey[50], borderColor: theme.palette.primary }}>
                                                    <img src={Google} alt="google" width={16} height={16} style={{ marginRight: 10 }} />
                                                    Sign Up with Google
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
                                                    <Typography component={Link} to="/login" variant="subtitle1" sx={{ textDecoration: "none" }}>
                                                        Already have an account?
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
                    <AuthFooter />
                </Grid>
            </Grid>
        </BlueBgWrapper>
    );
};

export default Register;
