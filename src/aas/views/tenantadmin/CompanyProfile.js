import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// import { useTheme } from "@mui/material/styles";
import validator from 'validator';
// material-ui
import {
    Alert, Button, Chip, Divider, Grid, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Typography
} from '@mui/material';
import { IconPencil } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import ZTextWithTitle from 'ui-component/ZTextWithTitle';
import ZBackdrop from 'ui-component/ZBackdrop';
import { gridSpacing } from 'common/constant';

import { useRemoveTenantlogo, useTenantInfo, useUpdateOwnTenantInfo, useUpdateTenantlogo } from 'aas/services/TenantAdminService';
import ZImageUpload from 'ui-component/ZImageUpload';
import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';
import { toast } from 'react-toastify';
import ZTitleActionButton from 'ui-component/ZTitleActionButton';
import CompanyProfileSubscriptionSection from './CompanyProfileSubscriptionSection';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const CompanyProfile = () => {
    // const theme = useTheme()
    const { t } = useTranslation();

    const [dataLoadingError, setDataLoadingError] = useState(null);
    const [emailValid, setEmailValid] = useState(true);
    const [remove, setRemove] = useState(false);
    const [edit, setEdit] = useState(false);
    const [tenantInfo, setTenantInfo] = useState({
        tenantCode: null,
        tenantName: null,
        description: null,
        email: null,
        representative: null,
        contactNumber: null,
        fax: null,
        // mainCurrency: "SGD",
        brn: null,
        addr1: null,
        addr2: null,
        addr3: null,
        addr4: null,
        country: null,
        postCode: null,
        owner: null,
        ownerFirstName: null,
        ownerLastName: null
    });

    const { isLoading, data, isError, refetch } = useTenantInfo(
        (response) => {
            if (response.code === "SUCCESS") {
                setTenantInfo(response.data)
                if (response.data.profileImage !== undefined && response.data.profileImage !== null) {
                    setCompanyProfileImage([{
                        dataURL: response.data.profileImage
                    }])
                }
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.message)
            }
        }, () => { })

    const { mutate: updateTenantInfo, isLoading: updateLoading } = useUpdateOwnTenantInfo(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("record_updated"))
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: updateTenantLogo, isLoading: updateImageLoading } = useUpdateTenantlogo(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("image_updated"))
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: removeTenantLogo, isLoading: removeLogoLoading } = useRemoveTenantlogo(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("image_remove"))
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTenantInfo({
            ...tenantInfo,
            [name]: value,
        });
    };

    const isValid = () => {
        if (!emailValid) {
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid()) {
            return
        }
        await updateTenantInfo(tenantInfo);
        setEdit(false)
        clearForm()
        refetch()
    }

    const clearForm = () => {
        setTenantInfo({
            tenantCode: null,
            tenantName: null,
            description: null,
            email: null,
            representative: null,
            contactNumber: null,
            fax: null,
            // mainCurrency: "SGD",
            brn: null,
            addr1: null,
            addr2: null,
            addr3: null,
            addr4: null,
            country: null,
            postCode: null,
            owner: null,
            ownerFirstName: null,
            ownerLastName: null
        });

    }

    const [withChange, setWithChange] = useState(false);
    const [companyProfileImage, setCompanyProfileImage] = useState([]);
    const onChangeImage = async (imageList, idx) => {
        setCompanyProfileImage(imageList)
        setWithChange(true)
        // var resized = await ResizeBase64(imageList[0].dataURL, maxSize, maxSize)
        // console.log(resized)
        // ResizeBase64(imageList[0].dataURL, maxSize, maxSize)

        // console.log(ResizeBase64(imageList[0].dataURL, maxSize, maxSize))
        // var resized = ResizeBase64(imageList[0].dataURL, maxSize, maxSize)
        // console.log('Resize:' + resized)

    };

    const onSaveImage = async () => {
        console.log(companyProfileImage[0].file);

        if (companyProfileImage[0].file.size > 2097152) {
            toast.error(t("file_size_too_big_error"))
        } else {
            await updateTenantLogo(companyProfileImage[0].file)
            setWithChange(false)
        }
    };

    const handleRemoveImage = async () => {
        //update company image to null
        await removeTenantLogo()
        setWithChange(true)
        setCompanyProfileImage([])
        setRemove(false)
    };

    return (
        <>
            {(dataLoadingError && isError) && <Alert severity="error" style={{ marginBottom: 10 }}>Data failed to load. {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={isLoading || updateLoading || updateImageLoading || removeLogoLoading} />
            <ZPromptConfirmation open={remove}
                fullWidth
                title={t("please_confirm")}
                text={t("remove_image_prompt")}
                deleteButtonText={t("delete")}
                enableCancel={true}
                onClickDelete={handleRemoveImage}
                onClickCancel={() => { setRemove(false) }}
            />

            <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="md" open={edit} >
                <form onSubmit={handleSubmit}>
                    <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{t("update_company_info")}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                            <Grid item lg={3} md={3} xs={6}>
                                <TextField
                                    fullWidth
                                    disabled
                                    label={t("company_code")}
                                    name="tenantCode"
                                    value={tenantInfo.tenantCode ?? ""}
                                    InputProps={{ readOnly: true, }}
                                />
                            </Grid>
                            <Grid item lg={3} md={3} xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("company_name")}
                                    name="tenantName"
                                    value={tenantInfo.tenantName ?? ""}
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
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    label={t("company_introduction")}
                                    name="description"
                                    value={tenantInfo.description ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            {/* <Grid item lg={6} md={6} sm={6} xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label={t("currency")}
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

                            <Grid item lg={4} md={4} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("contact_email")}
                                    name="email"
                                    error={!emailValid}
                                    value={tenantInfo.email ?? ""}
                                    onChange={(e) => {
                                        handleInputChange(e)
                                        setEmailValid(validator.isEmail(e.target.value))
                                    }}
                                    helperText={!emailValid ? t("invalid_email_format") : ''}
                                />
                            </Grid>
                            <Grid item lg={4} md={4} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("contact_number")}
                                    name="contactNumber"
                                    value={tenantInfo.contactNumber ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item lg={4} md={4} xs={12}>
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

                            <Grid item lg={4} md={4} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("country")}
                                    name="country"
                                    value={tenantInfo.country ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} xs={12}>
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
                                <Divider />
                            </Grid>

                            <Grid item lg={4} md={4} xs={12}>
                                <TextField
                                    fullWidth
                                    disabled
                                    label={t("owner")}
                                    name="owner"
                                    value={tenantInfo.owner ?? ""}
                                    InputProps={{ readOnly: true, }}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("owner_firstname")}
                                    name="ownerFirstName"
                                    value={tenantInfo.ownerFirstName ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("owner_lastname")}
                                    name="ownerLastName"
                                    value={tenantInfo.ownerLastName ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained" color="primary">{t("update")}</Button>
                        <Button variant="outlined" color="primary" onClick={() => {
                            setEdit(false)
                        }}>{t("cancel")}</Button>
                    </DialogActions>
                </form>
            </Dialog>

            {data?.data &&
                <MainCard contentSX={{ padding: 1 }} title={<>
                    <Typography variant='inherit' display={'inline'}>{t("company_info")}</Typography>
                </>}
                    secondary={
                        <ZTitleActionButton onClick={() => setEdit(true)}>
                            <IconPencil fontSize="inherit" stroke={1.5} size="1.5rem" />
                        </ZTitleActionButton>
                    }>

                    <Grid container spacing={gridSpacing}>
                        <Grid item md={6} xs={12} >
                            <SubCard contentSX={{ pl: 1, pr: 2 }} title={<><b>{data?.data?.tenantName}</b>  <small><i style={{ color: "gray" }}> [{data?.data?.tenantCode}]</i></small></>}
                                secondary={<Chip label={data?.data?.subscription} variant={data?.data?.subscription === 'FREE' ? "outlined" : 'filled'} color="primary" size="small" />}>

                                <Grid container justifyContent="flex-start" sx={{ ml: 1 }}>
                                    <Grid item md={12} xs={12}>
                                        <ZImageUpload text={t("upload_company_logo")} images={companyProfileImage} withChange={withChange} onChange={onChangeImage} onRemove={() => setRemove(true)} onSave={onSaveImage} />
                                    </Grid>

                                    <Grid item xs={12} sx={{ my: 1 }}>
                                        <Divider />
                                    </Grid>

                                    <Grid item md={6} xs={6} sx={{ mb: 2 }}>
                                        <ZTextWithTitle
                                            title={t("owner")} titleToolTips={''}
                                            text={data?.data?.ownerFirstName + ' ' + data?.data?.ownerLastName} textToolTips={''} />
                                    </Grid>

                                    <Grid item md={6} xs={6} sx={{ mb: 2 }}>
                                        <ZTextWithTitle
                                            title={t("owner_email")} titleToolTips={''}
                                            text={data?.data?.owner} textToolTips={''} />
                                    </Grid>

                                    <Grid item md={6} xs={6} sx={{ mb: 2 }}>
                                        <ZTextWithTitle
                                            title={t("business_registration_number")} titleToolTips={''}
                                            text={data?.data?.brn} textToolTips={''} />
                                    </Grid>
                                    {/* <Grid item md={6} xs={6} sx={{ mb: 2 }}>
                                        <ZTextWithTitle
                                            title={t("currency")} titleToolTips={''}
                                            text={data?.data?.mainCurrency} textToolTips={''} />
                                    </Grid> */}
                                </Grid>

                            </SubCard>
                        </Grid>

                        <Grid item md={6} xs={12}>
                            <SubCard>
                                <Grid container justifyContent='flex-start' spacing={gridSpacing}>
                                    <Grid item md={12} xs={12}>
                                        <ZTextWithTitle
                                            title={t("introduction")} titleToolTips={''}
                                            text={data?.data?.description} textToolTips={''} />
                                    </Grid>
                                    <Grid item xs={12} sx={{ my: 1 }}>
                                        <Divider />
                                    </Grid>
                                    <Grid item md={6} xs={6}>
                                        <ZTextWithTitle
                                            title={t("representative")} titleToolTips={''}
                                            text={data?.data?.representative} textToolTips={''} />
                                    </Grid>
                                    <Grid item md={6} xs={6}>
                                        <ZTextWithTitle
                                            title={t("contact_email")} titleToolTips={''}
                                            text={data?.data?.email} textToolTips={''} />
                                    </Grid>
                                    <Grid item md={6} xs={6}>
                                        <ZTextWithTitle
                                            title={t("contact_number")} titleToolTips={''}
                                            text={data?.data?.contactNumber} textToolTips={''} />
                                    </Grid>
                                    <Grid item md={6} xs={6}>
                                        <ZTextWithTitle
                                            title={t("fax")} titleToolTips={''}
                                            text={data?.data?.fax} textToolTips={''} />
                                    </Grid>

                                    <Grid item xs={12} sx={{ my: 1 }}>
                                        <Divider />
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                        <ZTextWithTitle
                                            title={t("address_line_1")} titleToolTips={''}
                                            text={data?.data?.addr1} textToolTips={''} />
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                        <ZTextWithTitle
                                            title={t("address_line_2")} titleToolTips={''}
                                            text={data?.data?.addr2} textToolTips={''} />
                                    </Grid>
                                    {data?.data?.addr3 && <Grid item md={12} xs={12}>
                                        <ZTextWithTitle
                                            title={t("address_line_3")} titleToolTips={''}
                                            text={data?.data?.addr3} textToolTips={''} />
                                    </Grid>}
                                    {data?.data?.addr4 && <Grid item md={12} xs={12}>
                                        <ZTextWithTitle
                                            title={t("address_line_4")} titleToolTips={''}
                                            text={data?.data?.addr4} textToolTips={''} />
                                    </Grid>}

                                    <Grid item md={6} xs={6}>
                                        <ZTextWithTitle
                                            title={t("country")} titleToolTips={''}
                                            text={data?.data?.country} textToolTips={''} />
                                    </Grid>
                                    <Grid item md={6} xs={6}>
                                        <ZTextWithTitle
                                            title={t("postcode")} titleToolTips={''}
                                            text={data?.data?.postCode} textToolTips={''} />
                                    </Grid>
                                </Grid>
                            </SubCard>
                        </Grid>
                    </Grid>
                </MainCard>}

            {data?.data && <CompanyProfileSubscriptionSection tenantData={data?.data} />}
        </>
    );
};

export default CompanyProfile;
