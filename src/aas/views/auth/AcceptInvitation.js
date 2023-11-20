
import { useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from "react-router-dom";

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
import { useState } from 'react';



// ================================|| AUTH3 - LOGIN ||================================ //

const AcceptInvitation = () => {
  // const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [message, setMessage] = useState();

  useEffect(() => {
    var flag = searchParams.get('n')
    var token = searchParams.get('t')

    // You now became member of the company. Please continue to login.
    if (flag !== null && token !== null && flag.toUpperCase() === 'N') {
      new AuthService().acceptTenantInvitation(token).then(
        async (response) => {
          if (response.status === 200 && response.data.code === "SUCCESS") {
            setMessage('You now became member of the company. Please continue to login.')
          } else {
            setMessage('Your invitation link is expired, please request another invitation from your company admin.')
          }
        }, error => {
          setMessage('Your invitation link is expired, please request another invitation from your company admin.')
        })
    } else if (flag !== null && token !== null && flag.toUpperCase() === 'Y') {
      navigate("../register?t=" + token)
    } else {
      setMessage('Your invitation link is expired, please request another invitation from your company admin.')
    }
  }, [setMessage, navigate, searchParams]);

  return (
    <BlueBgWrapper>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: "100vh" }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "calc(100vh - 68px)" }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <MainCard>
                <SubCard sx={{ border: 0 }} >
                  <Grid item xs={12} sx={{ my: 2 }} container alignItems="center" justifyContent="center">
                    <Typography variant="h2">{message}</Typography>
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

export default AcceptInvitation;
