import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// import { useTheme } from "@mui/material/styles";
// material-ui
import {
    Alert, Button, Chip, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel,
    OutlinedInput, InputAdornment, IconButton, FormHelperText
} from '@mui/material';
import { IconPencil, IconLockAccess } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import ZTextWithTitle from 'ui-component/ZTextWithTitle';
import ZBackdrop from 'ui-component/ZBackdrop';
import { gridSpacing } from 'common/constant';

import ZImageUpload from 'ui-component/ZImageUpload';
import { useChangePassword, useOwnInfo, useRemoveProfileImage, useUpdateOwnInfo, useUpdateProfileImage } from 'aas/services/UserService';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';
import { toast } from 'react-toastify';
import { ConvertUTCDateToLocalDate } from 'common/functions';
import { strengthIndicator } from 'aas/common/FieldValidator';
import ZTitleActionButton from 'ui-component/ZTitleActionButton';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const UserProfile = () => {
    // const theme = useTheme()
    const { t } = useTranslation();

    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [remove, setRemove] = useState(false);
    const [edit, setEdit] = useState(false);

    const [changePassword, setChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [showOldPassword, setShowOldPassword] = useState(null);
    const [showNewPassword, setShowNewPassword] = useState(null);

    const [oldPasswordValid, setOldPasswordValid] = useState(true);
    const [newPasswordValid, setNewPasswordValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const [userInfo, setUserInfo] = useState({
        id: null,
        email: null,
        firstName: null,
        lastName: null,
        password: null,
        roles: null,
        profileImage: null,
        verified: null
    });

    const { isLoading, data, isError, refetch } = useOwnInfo(
        (response) => {
            if (response.code === "SUCCESS") {
                // console.log(response.data)
                setUserInfo(response.data)
                if (response.data.profileImage !== undefined && response.data.profileImage !== null) {
                    setProfileImage([{
                        dataURL: response.data.profileImage
                    }])
                }
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.data.message)
            }
        }, () => { })

    const { mutate: updateUserInfo, isLoading: updateLoading } = useUpdateOwnInfo(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("user_info_updated"))
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: updateProfileImage, isLoading: updateImageLoading } = useUpdateProfileImage(
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

    const { mutate: removeProfileImage, isLoading: removeLogoLoading } = useRemoveProfileImage(
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

    const { mutate: changeUserPassword, isLoading: chgPasswordLoading } = useChangePassword(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("password_updated"))
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await updateUserInfo(userInfo);
        setEdit(false)
        clearForm()
        refetch()
    }

    const isValid = () => {
        if (!newPasswordValid || !oldPasswordValid) {
            setErrorMsg(t("password_updated"))
            return false
        }

        setErrorMsg('')
        return true
    }

    const handleSubmitChangePassword = async (e) => {
        e.preventDefault();
        if (!isValid()) {
            return
        }
        var data = {
            email: userInfo.email,
            oldPassword: oldPassword,
            newPassword: newPassword
        }
        await changeUserPassword(data)
        setChangePassword(false)
        setOldPassword(null)
        setNewPassword(null)

    }
    const clearForm = () => {
        setUserInfo({
            id: null,
            email: null,
            firstName: null,
            lastName: null,
            password: null,
            roles: null,
            profileImage: null,
            verified: null
        });
    }

    const [withChange, setWithChange] = useState(false);
    const [profileImage, setProfileImage] = useState([]);
    const onChangeImage = async (imageList, idx) => {
        setProfileImage(imageList)
        setWithChange(true)
    };

    const onSaveImage = async () => {
        // console.log(profileImage[0].file);

        if (profileImage[0].file.size > 2097152) {
            toast.error(t("file_size_too_big_error"))
        } else {
            await updateProfileImage(profileImage[0].file)
            setWithChange(false)
        }
    };

    const handleRemoveImage = async () => {
        //update company image to null
        await removeProfileImage()
        setWithChange(true)
        setProfileImage([])
        setRemove(false)
    };

    return (
        <>
            {(dataLoadingError && isError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={isLoading || updateLoading || updateImageLoading || removeLogoLoading || chgPasswordLoading} />
            <ZPromptConfirmation open={remove}
                fullWidth
                title={t("please_confirm")}
                text={t("remove_image_prompt")}
                deleteButtonText={t("delete")}
                enableCancel={true}
                onClickDelete={handleRemoveImage}
                onClickCancel={() => { setRemove(false) }}
            />

            <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="sm" open={changePassword} >
                <form onSubmit={handleSubmitChangePassword}>
                    <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}><> {t("change_password")} <small ><i style={{ color: 'grey' }}>{t("change_password_google_message")}</i></small></>   </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <FormControl variant="outlined" sx={{ width: '100%' }}>
                                    <InputLabel htmlFor="outlined-adornment-password"> {t("old_password")}</InputLabel>
                                    <OutlinedInput
                                        type={showOldPassword ? 'text' : 'password'}
                                        value={oldPassword ?? ""}
                                        onChange={(e) => {
                                            setOldPassword(e.target.value)
                                            setOldPasswordValid(strengthIndicator(e.target.value) === 5)
                                        }}
                                        required
                                        error={!oldPasswordValid}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                                    onMouseDown={(event) => event.preventDefault()}
                                                    edge="end">
                                                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    // label="Password"
                                    />
                                    {!oldPasswordValid && (
                                        <FormHelperText error >{t("password_requirement")}</FormHelperText>)}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl variant="outlined" sx={{ width: '100%' }}>
                                    <InputLabel htmlFor="outlined-adornment-password">{t("new_password")}</InputLabel>
                                    <OutlinedInput
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword ?? ""}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value)
                                            setNewPasswordValid(strengthIndicator(e.target.value) === 5)
                                        }}
                                        required
                                        error={!newPasswordValid}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    onMouseDown={(event) => event.preventDefault()}
                                                    edge="end">
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    // label="Password"
                                    />
                                    {!newPasswordValid && (
                                        <FormHelperText error >{t("password_requirement")}</FormHelperText>)}
                                </FormControl>
                            </Grid>
                            {errorMsg !== null && errorMsg.length > 0 ? <>
                                <Grid item xs={12} >
                                    <FormHelperText error>{errorMsg}</FormHelperText>
                                </Grid></> : null}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained" color="primary">{t("update")}</Button>
                        <Button variant="outlined" color="primary" onClick={() => {
                            setChangePassword(false)
                        }}>{t("cancel")} </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="sm" open={edit} >
                <form onSubmit={handleSubmit}>
                    <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{t("update_user_info")}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                            <Grid item md={12} xs={12}>
                                <TextField
                                    fullWidth
                                    disabled
                                    required
                                    label={t("email")}
                                    value={userInfo.email ?? ""}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    name="firstName"
                                    label={t("firstname")}
                                    value={userInfo.firstName ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    name="lastName"
                                    label={t("lastname")}
                                    value={userInfo.lastName ?? ""}
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
                <MainCard contentSX={{ padding: 1 }} title={t("user_profile")} secondary={<>
                    <ZTitleActionButton onClick={() => setChangePassword(true)}>
                        <IconLockAccess fontSize="inherit" stroke={1.5} size="1.5rem" />
                    </ZTitleActionButton>
                    <ZTitleActionButton onClick={() => setEdit(true)}>
                        <IconPencil fontSize="inherit" stroke={1.5} size="1.5rem" />
                    </ZTitleActionButton>
                </>}>

                    <Grid container spacing={gridSpacing}>
                        <Grid item md={6} xs={12}>
                            <SubCard contentSX={{ pl: 1, pr: 2 }} title={data?.data?.firstName + ' ' + data?.data?.lastName}
                                secondary={Object.values(data?.data?.roles?.split(',')).map((r, k) =>
                                    <Chip key={k} label={r} variant={'outlined'} color="primary" size="small" sx={{ ml: 1 }} />)}>

                                <Grid container justifyContent="flex-start" sx={{ ml: 1 }} >
                                    <Grid item md={12} xs={12}>
                                        <ZImageUpload images={profileImage} withChange={withChange} onChange={onChangeImage} onRemove={() => setRemove(true)} onSave={onSaveImage} />
                                    </Grid>
                                    {/* <Grid item xs={12} sx={{ my: 1 }}>
                                        <Divider />
                                    </Grid> */}
                                </Grid>
                            </SubCard>
                        </Grid>

                        <Grid item md={6} xs={12}>
                            <SubCard>
                                <Grid container justifyContent='flex-start' spacing={gridSpacing}>
                                    <Grid item md={6} xs={6}>
                                        <ZTextWithTitle
                                            title={t("email")} titleToolTips={''}
                                            text={data?.data?.email} textToolTips={''} />
                                    </Grid>
                                    <Grid item md={6} xs={6}>
                                        <ZTextWithTitle
                                            title={t("verifed")} titleToolTips={''}
                                            text={data?.data?.verified ? t("yes") : t("no")} textToolTips={''} />
                                    </Grid>
                                    <Grid item md={6} xs={6}>
                                        <ZTextWithTitle
                                            title={t("recent_login_on")} titleToolTips={''}
                                            text={ConvertUTCDateToLocalDate(data?.data?.lastLoginDate)} textToolTips={''} />
                                    </Grid>
                                    <Grid item md={6} xs={6}>
                                        <ZTextWithTitle
                                            title={t("login_count")} titleToolTips={''}
                                            text={data?.data?.loginCount} textToolTips={''} />
                                    </Grid>
                                </Grid>
                            </SubCard>
                        </Grid>
                    </Grid>
                </MainCard>}
        </>
    );
};

export default UserProfile;
