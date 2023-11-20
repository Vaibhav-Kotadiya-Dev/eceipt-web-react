import { useState } from 'react';
// import { useTheme } from '@mui/material/styles';
// material-ui
import { Grid, Button, Alert, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
// import { styled } from "@mui/material/styles";
import { gridSpacing } from 'common/constant';
import { gridSpacingSML } from 'common/constant';
import ZBackdrop from 'ui-component/ZBackdrop';
import MainCard from 'ui-component/cards/MainCard';
import { useAddService, useAllServices, useRemoveService } from 'aas/services/SubscriptionPackageService';
import BasicTable from 'ui-component/BasicTable';
import { IconSearch } from '@tabler/icons-react';
import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';
import { toast } from 'react-toastify';


// ==============================|| DEFAULT DASHBOARD ||============================== //

const ServiceGroup = () => {
    // const theme = useTheme();
    // const [isLoading, setLoading] = useState(false);
    const [serviceListOrg, setServiceListOrg] = useState(null);
    const [serviceList, setServiceList] = useState(null);
    const [searchValue, setSearchValue] = useState(null);

    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [edit, setEdit] = useState(false);
    const [serviceId, setServiceId] = useState(null);
    const [description, setDescription] = useState(null);
    const [url, setUrl] = useState(null);
    const [method, setMethod] = useState("GET");
    const [permission, setPermission] = useState('USER');

    const { isLoading, isError: loadingError, error: loadingErrorMsg, refetch } = useAllServices(
        (response) => {
            if (response.code === "SUCCESS") {
                response.data.sort((obj1, obj2) => obj1.url > obj2.url ? 1 : -1)
                setServiceListOrg(response.data)
                setServiceList(response.data)
                setDataLoadingError('')
            } else {
                setDataLoadingError(response.data.message)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
        })

    const { mutate: addService, isLoading: addLoading } = useAddService(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('Service added')
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: removeService, isLoading: removeLoading } = useRemoveService(
        (response) => {
            // console.log(response)
            if (response.data.code === "SUCCESS") {
                toast.success('Service removed.')
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
            id: serviceId,
            method: method,
            description: description,
            url: url,
            permission: permission
        }

        await addService(data);
        setEdit(false);
        clearForm()
        refetch()
    }

    const handleClickEdit = (e) => {
        setServiceId(e.id)
        setDescription(e.description);
        setUrl(e.url);
        setMethod(e.method);
        setPermission(e.permission);

        setEdit(true)
    }

    const handleClickDelete = async (e) => {
        // setLoading(true);
        var data = {
            id: serviceId,
            method: method,
            description: description,
            url: url,
            permission: permission
        }

        await removeService(data);
        setEdit(false);
        clearForm()
        refetch()
    }

    const handleSearch = (val) => {
        setSearchValue(val)
        if (serviceListOrg !== null && serviceListOrg.length > 0) {
            setServiceList(Object.values(serviceListOrg).filter(e => e.url.toLowerCase().includes(val.toLowerCase()) || e.description.toLowerCase().includes(val.toLowerCase())))
        }
    };

    const clearForm = () => {
        setServiceId(null)
        setDescription(null);
        setUrl(null);
        setMethod("GET");
        setPermission('USER');
    }


    return (<>
        {(loadingError || dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>Data failed to load. {dataLoadingError ?? ''} {loadingErrorMsg?.message ?? ''}</Alert>}
        <ZBackdrop open={isLoading || addLoading || removeLoading} />
        <ZPromptConfirmation open={false}
            title={"Please confirm"}
            text={'you are about to delete a record'}
            confirmButtonText={'confirm'}
            deleteButtonText={'delete'}
            enableCancel={true}
            onClickConfirm={() => console.log('clicked confirm')}
            onClickDelete={() => console.log('clicked confirm')}
            onClickCancel={() => console.log('clicked confirm')}
        />

        <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="sm" open={edit} >
            <form onSubmit={handleSubmit}>
                <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{"Add Service"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                        <Grid item md={12} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Description"
                                value={description ?? ""}
                                onChange={(value) => setDescription(value.target.value)}
                            />
                        </Grid>
                        <Grid item md={4} xs={4}>
                            <TextField
                                select
                                fullWidth
                                label="Method"
                                defaultValue={'GET'}
                                value={method}
                                // InputProps={{ readOnly: id != null }}
                                onChange={(value) => { setMethod(value.target.value) }}>
                                <MenuItem value={'GET'}>GET</MenuItem>
                                <MenuItem value={'POST'}>POST</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item md={8} xs={8}>
                            <TextField
                                fullWidth
                                required
                                label="URL"
                                value={url ?? ""}
                                onChange={(value) => setUrl(value.target.value)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Permission"
                                defaultValue={'GET'}
                                value={permission}
                                // InputProps={{ readOnly: id != null }}
                                onChange={(value) => { setPermission(value.target.value) }}>
                                <MenuItem value={'PUBLIC'}>PUBLIC</MenuItem>
                                <MenuItem value={'USER'}>USER</MenuItem>
                                <MenuItem value={'ADMIN'}>TENANT ADMIN</MenuItem>
                                <MenuItem value={'SYSADMIN'}>SYSTEM ADMIN</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {serviceId !== null && <Button variant="contained" color="error" onClick={() => handleClickDelete()}>Delete</Button>}
                    <Button type="submit" variant="contained" color="primary">{serviceId === null ? 'Add' : 'Update'} </Button>
                    <Button variant="outlined" color="primary" onClick={() => {
                        setEdit(false)
                        clearForm()
                    }}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>

        <Grid container spacing={gridSpacingSML} direction="row" sx={{ backgroundColor: '' }}>
            <Grid item xs={12}>
                <MainCard noPadding contentSX={{ padding: 1 }} title="Services" secondary={<>
                    <TextField
                        id="input-with-icon-textfield"
                        InputProps={{ startAdornment: (<InputAdornment position="start"><IconSearch stroke={1.5} size="1rem" /></InputAdornment>), }}
                        variant="standard"
                        value={searchValue ?? ""}
                        onChange={(value) => { handleSearch(value.target.value) }}
                        sx={{ mr: 5, width: 300 }}
                    />

                    <Button disableElevation type="submit" size="small" variant="contained" color="primary" onClick={() => setEdit(true)}> Create </Button></>
                }>
                    {serviceList !== null ?
                        <BasicTable data={serviceList} enableEdit={true} enableDelete={false} onClickEdit={handleClickEdit} dense={false} rowsPerPage={20} />
                        : null}
                </MainCard>
            </Grid>
        </Grid>
    </>
    );
};

export default ServiceGroup;
