
import { useEffect } from 'react';
import { Link, useSearchParams } from "react-router-dom";

// material-ui
// import { styled } from '@mui/material/styles';
// import { useTheme } from "@mui/material/styles";
import {
  Grid, Typography
} from "@mui/material";


// project imports
import MainCard from "ui-component/cards/MainCard";
import SubCard from 'ui-component/cards/SubCard'



// assets
import AuthService from "aas/services/AuthService";
import BlueBgWrapper from "base/layout/BlueBgWrapper";


// ================================|| AUTH3 - LOGIN ||================================ //

const VerifyEmail = () => {
  // const theme = useTheme();
  // const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const authService = new AuthService();

  useEffect(() => {
    var token = searchParams.get('t')
    authService.verifyEmail(token).then(
      async (response) => {
        console.log(response)
        if (response.status === 200 && response.data.code === "SUCCESS") {
          console.log("Login Success")
        } else {
          console.log(response.data)
          // setErrorMsg(response.data)
        }
      }, error => {
        console.log(error.response.data)
        // setErrorMsg("user name / password incorrect")
      })

  });

  return (
    <BlueBgWrapper>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: "100vh" }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "calc(100vh - 68px)" }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <MainCard>
                <SubCard sx={{ border: 0 }} >
                  <Grid item xs={12} sx={{ my: 2 }} container alignItems="center" justifyContent="center">
                    <Typography variant="h2">Your Email Has Been Verifed</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography component={Link} to="/login" variant="h3" color="primary" sx={{ textDecoration: "none" }}>
                        Back to Login
                      </Typography>
                    </Grid>
                  </Grid>
                </SubCard>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </BlueBgWrapper>
  );
};

export default VerifyEmail;
