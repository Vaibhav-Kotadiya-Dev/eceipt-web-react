import { useState } from 'react';
// import { useTheme } from '@mui/material/styles';
// material-ui
import { Grid, Button, Alert, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
// import { styled } from "@mui/material/styles";
import { gridSpacing } from 'common/constant';
import { gridSpacingSML } from 'common/constant';
import ZBackdrop from 'ui-component/ZBackdrop';
import MainCard from 'ui-component/cards/MainCard';
import BasicTable from 'ui-component/BasicTable';
import { IconSearch } from '@tabler/icons-react';
import { useAllUsersData, useUpdateUserinfo } from 'aas/services/TenantManagementService';
import { toast } from 'react-toastify';



// ==============================|| DEFAULT DASHBOARD ||============================== //


const Users = () => {
    // const theme = useTheme();
    // const [isLoading, setLoading] = useState(false);
    // const [setLoading] = useState(false);
    const [userListOrg, setUserListOrg] = useState(null);
    const [userList, setUserList] = useState(null);
    const [searchValue, setSearchValue] = useState(null);

    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [edit, setEdit] = useState(false);

    const [id, setId] = useState(null);
    const [email, setEmail] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [password, setPassword] = useState(null);
    const [roles, setRoles] = useState();
    const [verified, setVerified] = useState(null);

    const { isLoading, isError: loadingError, error: loadingErrorMsg, refetch } = useAllUsersData(
        (response) => {
            if (response.code === "SUCCESS") {
                response.data.sort((obj1, obj2) => obj1.id > obj2.id ? 1 : -1)
                var lst = response.data.map(u => {
                    return {
                        id: u.id,
                        email: u.email,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        roles: u.roles,
                        verified: u.verified
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

    const { mutate: updateUserinfo, isLoading: updateLoading } = useUpdateUserinfo(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('User Updated.')
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setLoading(true);
        var data = {
            id: id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password,
            roles: roles,
            verified: verified
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
        setVerified(e.verified);

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
        setVerified(null);
    }

    return (<>
        {(loadingError || dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>Data failed to load. {dataLoadingError ?? ''} {loadingErrorMsg?.message ?? ''}</Alert>}
        <ZBackdrop open={isLoading || updateLoading} />
        <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="sm" open={edit} >
            <form onSubmit={handleSubmit}>
                <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{"Update User Info"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                        <Grid item md={12} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="email"
                                value={email ?? ""}
                                onChange={(value) => setEmail(value.target.value)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="firstName"
                                value={firstName ?? ""}
                                onChange={(value) => setFirstName(value.target.value)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="lastName"
                                value={lastName ?? ""}
                                onChange={(value) => setLastName(value.target.value)}
                            />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TextField
                                fullWidth
                                label="password"
                                value={password ?? ""}
                                onChange={(value) => setPassword(value.target.value)}
                            />
                        </Grid>
                        <Grid item md={8} xs={8}>
                            <TextField
                                select
                                fullWidth
                                label="roles"
                                defaultValue={'USER'}
                                SelectProps={{
                                    multiple: true,
                                    value: roles?.split(',') ?? ['USER'],
                                }}
                                onChange={(value) => { setRoles(value.target.value.map((v) => v).join(',')) }}
                            >
                                <MenuItem value={'USER'}>USER</MenuItem>
                                <MenuItem value={'ADMIN'}>TENANT ADMIN</MenuItem>
                                <MenuItem value={'SYSADMIN'}>SYSTEM ADMIN</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item md={4} xs={4}>
                            <TextField
                                select
                                fullWidth
                                label="verified"
                                defaultValue={true}
                                value={verified ?? false}
                                // InputProps={{ readOnly: id != null }}
                                onChange={(value) => { setVerified(value.target.value) }}>
                                <MenuItem value={true}>YES</MenuItem>
                                <MenuItem value={false}>NO</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" color="primary">{'Update'} </Button>
                    <Button variant="outlined" color="primary" onClick={() => {
                        setEdit(false)
                        clearForm()
                    }}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>

        <Grid container spacing={gridSpacingSML} direction="row" sx={{ backgroundColor: '' }}>
            <Grid item xs={12}>
                <MainCard noPadding contentSX={{ padding: 1 }} title="User Management" secondary={<>
                    <TextField
                        id="input-with-icon-textfield"
                        InputProps={{ startAdornment: (<InputAdornment position="start"><IconSearch stroke={1.5} size="1rem" /></InputAdornment>), }}
                        variant="standard"
                        value={searchValue ?? ""}
                        onChange={(value) => { handleSearch(value.target.value) }}
                        sx={{ mr: 5, width: 300 }}
                    />

                    {/* <Button disableElevation type="submit" size="small" variant="contained" color="primary" onClick={() => setEdit(true)}> Create </Button> */}
                </>
                }>
                    {userList !== null ?
                        <BasicTable data={userList} enableEdit={true} enableDelete={false} onClickEdit={handleClickEdit} dense={false} rowsPerPage={10} />
                        : null}
                </MainCard>
            </Grid>
        </Grid>
    </>
    );
};

export default Users;
