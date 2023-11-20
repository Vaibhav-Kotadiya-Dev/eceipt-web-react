
import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import validator from 'validator';
// material-ui
// import { styled } from '@mui/material/styles';
// import { useTheme } from "@mui/material/styles";
import {
  Divider, Grid, Stack, Typography, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, FormHelperText
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// project imports
import MainCard from "ui-component/cards/MainCard";
import SubCard from 'ui-component/cards/SubCard'

// project imports
import { gridSpacing } from 'common/constant';
import AnimateButton from 'ui-component/common/AnimateButton';

// assets
import AuthService from "aas/services/AuthService";
import BlueBgWrapper from "base/layout/BlueBgWrapper";
import { strengthIndicator } from 'aas/common/FieldValidator';


// ================================|| AUTH3 - LOGIN ||================================ //

const ResendVerification = () => {
  // const theme = useTheme();
  const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();
  const [searchParams] = useSearchParams();

  const authService = new AuthService();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [token, setToken] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const isValid = () => {
    if (!emailValid) {
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
    setToken(token)
  }, [setToken, searchParams]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      return
    }
    authService.resetPassword(email, token, password).then(
      async (response) => {
        // console.log(response)
        if (response.status === 200 && response.data.code === "SUCCESS") {
          setErrorMsg(response.data)
          navigate("../login")
        } else {
          setErrorMsg(response.data)
        }
      }, error => {
        setErrorMsg("user name / password incorrect")
      })
  }


  return (
    <BlueBgWrapper>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: "100vh" }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "calc(100vh - 68px)" }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <MainCard
                sx={{
                  width: { xs: 370, lg: 475 },
                  margin: { xs: 2.5, md: 3 },
                  "& > *": { flexGrow: 1, flexBasis: "50%", },
                }} content={false}>

                <SubCard sx={{ border: 0 }} >
                  <Grid item xs={12} sx={{ my: 2 }} container alignItems="center" justifyContent="center">
                    <Typography variant="subtitle1">Password Reset</Typography>
                  </Grid>

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          required
                          label="Email Address"
                          value={email ?? ""}
                          error={!emailValid}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setEmailValid(validator.isEmail(e.target.value))
                          }}
                          helperText={!emailValid ? 'Invalid Email Format.' : ''}
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

                          {/* <Typography color="error" sx={{ textDecoration: "none" }} >
                            {errorMsg}
                          </Typography> */}
                        </Grid></> : null}

                      <Grid item xs={12}>
                        <AnimateButton>
                          <Button disableElevation disabled={false} fullWidth size="large" type="submit" variant="contained" color="primary"                              >
                            Reset
                          </Button>
                        </AnimateButton>
                      </Grid>
                    </Grid>
                  </form>
                </SubCard>

                <SubCard sx={{ border: 0 }} >
                  <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid item container direction="column" alignItems="center" xs={12}>
                        <Typography component={Link} to="/login" variant="subtitle1" sx={{ textDecoration: "none" }}>
                          Back to Login
                        </Typography>
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
    </BlueBgWrapper>
  );
};

export default ResendVerification;
