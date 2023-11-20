import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import validator from 'validator';
// import { useTheme } from '@mui/material/styles';
// material-ui
import {
    Grid, Button, Alert, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
    MenuItem, Divider, Typography, FormHelperText, FormControl, IconButton, InputLabel, OutlinedInput
} from '@mui/material';
// import { styled } from "@mui/material/styles";
import { gridSpacing } from 'common/constant';
import { gridSpacingSML } from 'common/constant';
import ZBackdrop from 'ui-component/ZBackdrop';
import MainCard from 'ui-component/cards/MainCard';
import BasicTable from 'ui-component/BasicTable';
import { IconSearch } from '@tabler/icons-react';
import { useAllTenantUser, useInviteTenantUser, useRemoveTenantUser, useUpdateTenantUserinfo } from 'aas/services/TenantAdminService';
import { GetTenantId } from 'aas/common/functions';
import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { strengthIndicator } from 'aas/common/FieldValidator';



// ==============================|| DEFAULT DASHBOARD ||============================== //


const UserManagement = () => {
    const { t } = useTranslation();
    // const theme = useTheme();
    // const [isLoading, setLoading] = useState(false);
    // const [setLoading] = useState(false);
    const [userListOrg, setUserListOrg] = useState(null);
    const [userList, setUserList] = useState(null);
    const [searchValue, setSearchValue] = useState(null);

    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [remove, setRemove] = useState(false);

    const [edit, setEdit] = useState(false);

    const [invite, setInvite] = useState(false);
    const [inviteName, setInviteName] = useState();
    const [inviteEmail, setInviteEmail] = useState();
    const [inviteEmailValid, setInviteEmailValid] = useState(true);

    const [id, setId] = useState(null);
    const [email, setEmail] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [password, setPassword] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [roles, setRoles] = useState();

    const [errorMsg, setErrorMsg] = useState('');
    const [passwordValid, setPasswordValid] = useState(true);
    const { isLoading, isError: loadingError, error: loadingErrorMsg, refetch } = useAllTenantUser(
        (response) => {
            if (response.code === "SUCCESS") {
                response.data.sort((obj1, obj2) => obj1.id > obj2.id ? 1 : -1)
                var lst = response.data.map(u => {
                    return {
                        id: u.id,
                        email: u.email,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        roles: u.roles
                    }
                })

                setUserListOrg(lst)
                setUserList(lst)
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.data.message)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
        })

    const { mutate: updateUserinfo, isLoading: updateLoading } = useUpdateTenantUserinfo(
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

    const { mutate: inviteTenantUser, isLoading: inviteLoading } = useInviteTenantUser(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("user_invited"))
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: removeTenantUser, isLoading: removeLoading } = useRemoveTenantUser(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("user_removed"))
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const isValid = () => {
        if (!inviteEmailValid) {
            return false
        }

        return true
    }
    const isValidUpdate = () => {
        if (!passwordValid) {
            setErrorMsg(t("password_strength_warning"))
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidUpdate()) {
            return
        }
        var data = {
            id: id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password,
            roles: roles
        }

        await updateUserinfo(data)
        setEdit(false)
        clearForm()
        refetch()
    }

    const handleClickEdit = (e) => {
        setId(e.id);
        setEmail(e.email);
        setFirstName(e.firstName);
        setLastName(e.lastName);
        setPassword(null);
        setRoles(e.roles);

        setEdit(true)
    }


    const handleSearch = (val) => {
        setSearchValue(val)
        if (userListOrg !== null && userListOrg.length > 0) {
            setUserList(Object.values(userListOrg).filter(e => e.email.toLowerCase().includes(val.toLowerCase()) || e.firstName.toLowerCase().includes(val.toLowerCase())
                || e.lastName.toLowerCase().includes(val.toLowerCase())))
        }
    };

    const clearForm = () => {
        setId(null);
        setEmail(null);
        setFirstName(null);
        setLastName(null);
        setPassword(null);
        setRoles(null);
    }


    const handleInvite = async (e) => {
        e.preventDefault();
        if (!isValid()) {
            return
        }
        var data = {
            name: inviteName,
            email: inviteEmail,
            tenantId: GetTenantId()
        }

        await inviteTenantUser(data)
        setInvite(false)
        setInviteName(null)
        setInviteEmail(null)
    }

    const handleRemoveUser = async () => {
        var data = {
            userId: id,
            tenantId: GetTenantId()
        }
        await removeTenantUser(data);
        setRemove(false)
        setEdit(false)
    }


    return (<>
        {(loadingError || dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} {loadingErrorMsg?.message ?? ''}</Alert>}
        <ZBackdrop open={isLoading || updateLoading || inviteLoading || removeLoading} />
        <ZPromptConfirmation open={remove}
            fullWidth
            title={t("please_confirm")}
            text={t("user_removed_message")}
            deleteButtonText={t("remove")}
            enableCancel={true}
            onClickDelete={handleRemoveUser}
            onClickCancel={() => { setRemove(false) }}
        />

        <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="sm" open={invite} >
            <form onSubmit={handleInvite}>
                <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{t("invite_user")}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                        <Grid item md={12} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label={t("name")}
                                value={inviteName ?? ""}
                                onChange={(value) => setInviteName(value.target.value)}
                            />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label={t("email")}
                                value={inviteEmail ?? ""}
                                error={!inviteEmailValid}
                                onChange={(value) => {
                                    setInviteEmail(value.target.value)
                                    setInviteEmailValid(validator.isEmail(value.target.value))
                                }}
                                helperText={!inviteEmailValid ? t("invalid_email_format") : ''}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item md={12} xs={12}>
                            <Typography variant="body2">{t("invite_user_message")}</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" color="primary">{t("invite")} </Button>
                    <Button variant="outlined" color="primary" onClick={() => {
                        setInvite(false)
                        setInviteName(null)
                        setInviteEmail(null)
                        setInviteEmailValid(true)
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
                                value={email ?? ""}
                                onChange={(value) => setEmail(value.target.value)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label={t("firstname")}
                                value={firstName ?? ""}
                                onChange={(value) => setFirstName(value.target.value)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label={t("lastname")}
                                value={lastName ?? ""}
                                onChange={(value) => setLastName(value.target.value)}
                            />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <FormControl variant="outlined" sx={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-adornment-password">{t("password")}</InputLabel>
                                <OutlinedInput
                                    type={showPassword ? 'text' : 'password'}
                                    value={password ?? ""}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        if (e.target?.value !== null && e.target?.value?.length > 0) {
                                            setPasswordValid(strengthIndicator(e.target.value) === 5)
                                        }

                                        if (e.target.value === "") {
                                            setPasswordValid(true)
                                        }
                                    }}
                                    error={password === null ? false : !passwordValid}
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
                                    label={t("password")}

                                />
                                {!passwordValid && (
                                    <FormHelperText error >{t("password_strength_warning")}</FormHelperText>)}
                            </FormControl>
                        </Grid>
                        <Grid item md={8} xs={8}>
                            <TextField
                                select
                                fullWidth
                                label={t("roles")}
                                defaultValue={'USER'}
                                SelectProps={{
                                    multiple: true,
                                    value: roles?.split(',') ?? ['USER'],
                                }}
                                onChange={(value) => { setRoles(value.target.value.map((v) => v).join(',')) }}
                            >
                                <MenuItem value={'USER'}>{t("user")}</MenuItem>
                                <MenuItem value={'ADMIN'}>{t("tenant_admin")}</MenuItem>
                            </TextField>
                            {errorMsg !== null && errorMsg.length > 0 ? <>
                                <Grid item xs={12} >
                                    <FormHelperText error>{errorMsg}</FormHelperText>
                                </Grid></> : null}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="space-between" alignItems="center" spacing={gridSpacing} sx={{ mb: 1 }}
                        flexDirection={{ xs: 'column', sm: 'row' }}>
                        <Grid item sx={{ order: { xs: 2, sm: 1 } }}>
                            <Button variant="contained" color="error" onClick={() => { setRemove(true) }}>{t("remove_user_from_tenant")}</Button>
                        </Grid>
                        <Grid item sx={{ order: { xs: 1, sm: 2 } }}>
                            <Grid container columnSpacing={1} >
                                <Grid item>
                                    <Button type="submit" variant="contained" color="primary">{t("update")}</Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="primary" onClick={() => {
                                        setEdit(false)
                                        clearForm()
                                        setPasswordValid(true)
                                    }}>{t("cancel")}</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogActions>
            </form>
        </Dialog>

        <Grid container spacing={gridSpacingSML} direction="row" sx={{ backgroundColor: '' }}>
            <Grid item xs={12}>
                <MainCard noPadding contentSX={{ padding: 1 }} title={t("company_users")} secondary={<>
                    <TextField
                        id="input-with-icon-textfield"
                        InputProps={{ startAdornment: (<InputAdornment position="start"><IconSearch stroke={1.5} size="1rem" /></InputAdornment>), }}
                        variant="standard"
                        value={searchValue ?? ""}
                        onChange={(value) => { handleSearch(value.target.value) }}
                        sx={{ mr: 5, width: 300 }}
                    />

                    <Button disableElevation type="submit" size="small" variant="contained" color="primary" onClick={() => setInvite(true)}>{t("invite_user")} </Button>
                </>
                }>
                    {userList !== null ?
                        <BasicTable data={userList} enableEdit={true} enableDelete={false} onClickEdit={handleClickEdit} dense={false} rowsPerPage={10} />
                        : null}
                </MainCard>
            </Grid>
        </Grid >
    </>
    );
};

export default UserManagement;
