import React from "react";
import { useEffect } from 'react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { useTranslation } from 'react-i18next';

// material-ui
import { Button, Grid, TextField, Divider, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard'
import { gridSpacing } from 'common/constant';
import ZBackdrop from "ui-component/ZBackdrop";
import TenantService, { useCheckTenantCode } from "aas/services/TenantAdminService";
import { toast } from "react-toastify";

import Background from 'aas/assets/create_t_bg.jpg';
import ZPromptConfirmation from "ui-component/ZPromptConfirmation";
import { GetTenantId } from "aas/common/functions";

const TenantCreate = () => {
    const navigate = useNavigate();
    const tenantService = new TenantService();
    const { t } = useTranslation();

    const [isLoading, setLoading] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const [exist, setExist] = useState(false);
    const [emailValid, setEmailValid] = useState(true);

    const [tenantInfo, setTenantInfo] = useState({
        tenantCode: null,
        tenantName: null,
        description: null,
        email: null,
        representative: null,
        contactNumber: null,
        fax: null,
        mainCurrency: null,
        brn: null,
        addr1: null,
        addr2: null,
        addr3: null,
        addr4: null,
        country: null,
        postCode: null,
        profileImage: null
    });

    useEffect(() => {
        var tid = GetTenantId()
        if (tid !== null && tid !== undefined && Number(tid) > 0) {
            navigate("../home")
        }
    });

    const { mutate: checkTenantCode } = useCheckTenantCode(
        (response) => {
            // console.log(response.data)
            if (response.data.code === "SUCCESS") {
                setExist(response.data.data)
            }
        }, () => { })

    const isValid = () => {
        if (exist) {
            toast.error(t("tenant_code_exist") + ".")
            return false
        }
        if (!emailValid) {
            return false
        }
        return true
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid()) {
            return
        }
        setLoading(true)
        tenantService.createTenant(tenantInfo).then(
            async (response) => {
                // console.log(response)
                if (response.status === 200 && response.data.code === "SUCCESS") {
                    toast.success(t("company_created"))
                    setLoading(false)
                    setOpenConfirmation(true)
                } else {
                    toast.error(t('unknow_error'))
                    setLoading(false)
                }
            }, error => {
                toast.error(t('unknow_error'))
                setLoading(false)
            })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTenantInfo({
            ...tenantInfo,
            [name]: value,
        });
    };

    const handleClickConfirm = () => {
        setOpenConfirmation(false)
        navigate("../login")
    };

    return (
        <>
            <ZBackdrop open={isLoading} />
            <ZPromptConfirmation open={openConfirmation}
                fullWidth
                title={t('company_created')}
                text={t('company_created_prompt')}
                confirmButtonText={t('ok')}
                onClickConfirm={handleClickConfirm}
            />
            <MainCard noPadding>
                <Grid container spacing={gridSpacing} direction="row" sx={{ p: 2, background: `url(${Background})`, backgroundSize: 'cover' }}>
                    <Grid item lg={12} md={12} xs={12}>
                        <Typography display="inline" variant="h3" color={'white'}>{t('create_company')}</Typography>
                        <Typography display="inline" variant="h4" color={'white'}>- {t('create_company_first_step')}</Typography>
                    </Grid>
                    <Grid item lg={6} md={4} xs={12} sx={{ mt: 5 }}>
                        <Typography color={'#ffd18d'} fontFamily={'verdana'} fontSize={'24px'}>{t('create_company_fill_info')}</Typography>
                        <br />
                        <Typography color={'#faaf40'} fontFamily={'verdana'} fontSize={'48px'} fontWeight={'bold'}>{t('create_company_in_eceipt')}</Typography>
                        <br />
                        <Typography color={'#4a85b4'} fontFamily={'verdana'} fontSize={'48px'} fontWeight={'bold'}>{t('to')}</Typography>
                        <br />

                        <Typography color={'#faaf40'} fontFamily={'verdana'} fontSize={'40px'} fontWeight={'bold'} sx={{ textAlign: 'center' }}>{t('create_company_manage_order')}</Typography>
                        <br />
                        <Typography color={'#4a85b4'} fontFamily={'verdana'} fontSize={'40px'} fontWeight={'bold'} sx={{ textAlign: 'center' }}>{t('create_company_manage_inventory')}</Typography>
                        <br />
                        <Typography color={'#faaf40'} fontFamily={'verdana'} fontSize={'42px'} fontWeight={'bold'} sx={{ textAlign: 'center' }}>{t('create_company_save_cost')}</Typography>

                    </Grid>
                    <Grid item lg={6} md={8} xs={12} sx={{ pr: 2, mt: 2, pb: 5 }}>
                        <SubCard sx={{ border: 0 }} disableHover>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={gridSpacing}>

                                    <Grid item lg={6} md={6} xs={6}>
                                        <TextField
                                            fullWidth
                                            required
                                            label={t("company_name")}
                                            name="tenantName"
                                            value={tenantInfo.tenantName ?? ""}
                                            error={exist}
                                            onBlur={(e) => { checkTenantCode(e.target.value) }}
                                            onChange={handleInputChange}
                                            helperText={exist ? t("tenant code exist") : ''}
                                        />
                                    </Grid>
                                    <Grid item lg={6} md={6} xs={6}>
                                        <TextField
                                            fullWidth
                                            required
                                            label={t("company_code")}
                                            name="tenantCode"
                                            value={tenantInfo.tenantCode ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={t("company_introduction")}
                                            name="description"
                                            value={tenantInfo.description ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item lg={6} md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label={t("representative")}
                                            name="representative"
                                            value={tenantInfo.representative ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>

                                    {/* <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="mainCurrency"
                                            name="mainCurrency"
                                            value={tenantInfo.mainCurrency ?? ""}
                                            defaultValue={'API'}
                                            onChange={handleInputChange}>
                                            <MenuItem key={'SGD'} value={'SGD'}>SGD</MenuItem>
                                            <MenuItem key={'USD'} value={'USD'}>USD</MenuItem>
                                        </TextField>
                                    </Grid> */}
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <TextField
                                            fullWidth
                                            required
                                            label={t("business_registration_number")}
                                            name="brn"
                                            value={tenantInfo.brn ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Grid item lg={6} md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label={t("contact_email")}
                                            name="email"
                                            value={tenantInfo.email ?? ""}
                                            error={!emailValid}
                                            onChange={(e) => {
                                                handleInputChange(e)
                                                setEmailValid(validator.isEmail(e.target.value))
                                            }}
                                            helperText={!emailValid ? t("invalid_email_format") : ''}
                                        />
                                    </Grid>
                                    <Grid item lg={6} md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label={t("contact_number")}
                                            name="contactNumber"
                                            value={tenantInfo.contactNumber ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item lg={6} md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={t("fax")}
                                            name="fax"
                                            value={tenantInfo.fax ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>


                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Grid item lg={12} md={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label={t("address_line_1")}
                                            name="addr1"
                                            value={tenantInfo.addr1 ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label={t("address_line_2")}
                                            name="addr2"
                                            value={tenantInfo.addr2 ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item lg={6} md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={t("address_line_3")}
                                            name="addr3"
                                            value={tenantInfo.addr3 ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item lg={6} md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={t("address_line_4")}
                                            name="addr4"
                                            value={tenantInfo.addr4 ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>

                                    <Grid item lg={6} md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label={t("country")}
                                            name="country"
                                            value={tenantInfo.country ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>

                                    <Grid item lg={6} md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label={t("postcode")}
                                            name="postCode"
                                            value={tenantInfo.postCode ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container direction='row' justifyContent="end" alignItems="center" >
                                            <Button disableElevation type="submit" variant="contained" color="primary">{t("create")} </Button>
                                            <Button disableElevation variant="outlined" color="primary" sx={{ marginX: '5px' }} onClick={() => navigate('/home')}>{t("cancel")}</Button>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </form>
                        </SubCard>
                    </Grid>
                </Grid>
            </MainCard>
        </>

    )
}

export default TenantCreate;
