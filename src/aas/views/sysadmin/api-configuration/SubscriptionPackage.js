import { useState } from 'react';

// material-ui
import { Grid, Typography, Chip, Button, Alert } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, TextField } from '@mui/material';
// import { styled } from "@mui/material/styles";
import { gridSpacing } from 'common/constant';

import ZCardList from 'ui-component/ZCardList';
import { gridSpacingSML } from 'common/constant';
import ZBackdrop from 'ui-component/ZBackdrop';
import MainCard from 'ui-component/cards/MainCard';
import { useAddPackageGroup, useAllServiceGroup, usePackagesDetailByCode, usePackagesList, useRemovePackageGroup } from 'aas/services/SubscriptionPackageService';
import BasicTable from 'ui-component/BasicTable';
import { toast } from 'react-toastify';


// ==============================|| DEFAULT DASHBOARD ||============================== //
const SubscriptionPackage = () => {
    // const theme = useTheme();
    // const [isLoading, setLoading] = useState(false);
    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [packagesList, setPackagesList] = useState(null);
    const [currentPackage, setCurrentPackage] = useState(null);
    const [selGroup, setSelGroup] = useState(null);
    const [serviceGroupList, setServiceGroupList] = useState(null);
    const [serviceGroupListFiltered, setServiceGroupListFiltered] = useState(null);
    const [serviceList, setServiceList] = useState(null);

    const [groupId, setGroupId] = useState('');
    const [currentCode, setCurrentCode] = useState(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('');

    const { isLoading, isError: loadingError, error: loadingErrorMsg } = usePackagesList(
        (response) => {
            if (response.code === "SUCCESS") {
                response.data.sort((obj1, obj2) => obj1.code > obj2.code ? 1 : -1)
                var list = Object.values(response.data).map(e => { return { name: e.code, code: e.code } })
                setPackagesList(list)
            } else {
                setDataLoadingError(response.data.message)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
        })

    const { isLoading: singlePkgLoading, isError: loadingErrorSinglePkg, error: loadingErrorMsgSinglePkg, refetch: refetchSinglePkg } = usePackagesDetailByCode(currentCode,
        (response) => {
            if (response.code === "SUCCESS") {
                setCurrentPackage(response.data)
            } else {
                setDataLoadingError(response.data.message)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
        })

    const { isLoading: serviceGpLoading, isError: loadingErrorServiceGp, error: loadingErrorMsgServiceGp } = useAllServiceGroup(
        (response) => {
            if (response.code === "SUCCESS") {
                response.data.sort((obj1, obj2) => obj1.code > obj2.code ? 1 : -1)
                setServiceGroupList(response.data)
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.data.message)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
        })

    const { mutate: addPackageGroup, isLoading: addLoading } = useAddPackageGroup(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('Group added.')
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: removePackageGroup, isLoading: removeLoading } = useRemovePackageGroup(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('Group removed.')
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })


    const setServiceGroup = (id) => {
        setGroupId(id)
        var lst = Object.values(currentPackage.serviceGroups).find(g => g.id === id).services.map((element, key) => {
            return {
                id: element.id,
                description: element.description,
                method: element.method,
                url: element.url,
                permission: element.permission
            }
        })
        lst.sort((obj1, obj2) => obj1.id > obj2.id ? 1 : -1)
        setServiceList(lst)
    }

    const onChangeSelectedPackage = (code) => {
        setServiceList(null)
        setCurrentCode(code)
        refetchSinglePkg()
    }

    const handleOpenLinkDialog = (type) => {
        // setLoading(true);
        setDialogType(type);
        var currentServiceGroupsIds = Object.values(currentPackage.serviceGroups).map(e => e.id)

        var lst = null;
        if (type === 'Link') {
            lst = serviceGroupList.filter(e => !currentServiceGroupsIds.includes(e.id))
        }
        if (type === 'Remove') {
            lst = serviceGroupList.filter(e => currentServiceGroupsIds.includes(e.id))
        }
        setServiceGroupListFiltered(lst)
        setOpenDialog(true);
    }

    // handleSubmitLink
    const handleSubmitDialog = async (e) => {
        e.preventDefault();
        // setLoading(true);

        var data = {
            packageId: currentPackage.id,
            groupId: selGroup
        }

        if (dialogType === 'Link') {
            await addPackageGroup(data)
            setOpenDialog(false)
        }
        if (dialogType === 'Remove') {
            await removePackageGroup(data)
            setOpenDialog(false)
        }
        setDialogType(null)
        setSelGroup(null)
    }

    return (<>
        {(dataLoadingError || loadingError || loadingErrorSinglePkg || loadingErrorServiceGp)
            && <Alert severity="error" style={{ marginBottom: 10 }}>Data failed to load.
                {dataLoadingError ?? ''} {loadingErrorMsg?.message ?? ''} {loadingErrorMsgSinglePkg?.message ?? ''}{loadingErrorMsgServiceGp?.message ?? ''}</Alert>}
        <ZBackdrop open={isLoading || singlePkgLoading || removeLoading || addLoading || serviceGpLoading} />

        <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="sm" open={openDialog} >
            <form onSubmit={handleSubmitDialog}>
                <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{"Add Service"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                        <Grid item md={12} xs={12}>
                            {serviceGroupListFiltered &&
                                <TextField
                                    select
                                    fullWidth
                                    label="Method"
                                    defaultValue={''}
                                    value={selGroup ?? ""}
                                    // SelectProps={{ multiple: false }}
                                    // InputProps={{ readOnly: id != null }}
                                    onChange={(value) => { setSelGroup(value.target.value) }}>
                                    {Object.values(serviceGroupListFiltered).map(e => (<MenuItem key={e.id} value={e.id}>{e.code} &nbsp; <i>[{e.description}]</i></MenuItem>))}
                                </TextField>}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {dialogType === 'Link' ? <Button type="submit" variant="contained" color="primary">{'Add'} </Button> : null}
                    {dialogType === 'Remove' ? <Button type="submit" variant="contained" color='error'>{'Remove'} </Button> : null}
                    <Button variant="outlined" color="primary" onClick={() => {
                        setOpenDialog(false)
                        setSelGroup(null)
                    }}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>

        <Grid container spacing={gridSpacingSML} direction="row">
            <Grid item xs={2} alignItems="flex-start" >
                {packagesList &&
                    <ZCardList data={packagesList} onChangeSel={onChangeSelectedPackage} title='Subscription Package' />}
            </Grid>
            {(currentPackage && currentCode) && <>
                <Grid item xs={10} sx={{ backgroundColor: '' }}>
                    <Grid container spacing={gridSpacingSML}>
                        <Grid item xs={12}>
                            <MainCard noPadding sx={{ pl: 2, pr: 2, pt: 1.5, pb: 1.5 }}>
                                <Grid container spacing={gridSpacing} alignContent="center" justifyContent="space-between"  >
                                    <Grid item alignContent="center" sx={{ p: 0, m: 0 }}>
                                        <Grid container direction="row" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                                            <Grid item>
                                                <Typography variant="h4" sx={{ p: 0, m: 0, backgroundColor: '#FFFFFF' }}>{currentPackage.name + ' [' + currentPackage.code + ']'}</Typography>
                                            </Grid>
                                            <Grid item sx={{ ml: 1 }}>
                                                <Chip label={currentPackage.description} variant="outlined" color="info" size="small" />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item alignContent="center">
                                        <Grid container direction="row" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                                            <Grid item justifyContent={'flex-end'} sx={{ ml: 1 }}>
                                                <Button disableElevation size="small" variant={"contained"} color="info" sx={{ borderRadius: 1 }}
                                                    onClick={() => { handleOpenLinkDialog('Link') }}> Link Service Group </Button>
                                            </Grid>
                                            <Grid item justifyContent={'flex-end'} sx={{ ml: 1 }}>
                                                <Button disableElevation size="small" variant={"contained"} color="error" sx={{ borderRadius: 1 }}
                                                    onClick={() => { handleOpenLinkDialog('Remove') }}> Remove Service Group </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </MainCard >
                        </Grid>
                        <Grid item xs={12}>
                            <MainCard noPadding sx={{ pl: 2, pr: 2, pt: 2, pb: 2 }}>
                                <Grid container spacing={0} direction="row" alignItems='center' justifyContent='left' sx={{ height: '100%' }}>
                                    {Object.values(currentPackage.serviceGroups).map((element, key) =>
                                        <Grid item justifyContent={'flex-end'} sx={{ ml: 0 }} key={key}>
                                            <Button disableElevation size="small" variant={groupId === element.id ? "contained" : "outlined"} color="info" sx={{ borderRadius: 0 }}
                                                onClick={() => { setServiceGroup(element.id) }}>
                                                <strong> {element.code}<br /> <i>{element.description}</i></strong>
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </MainCard >
                        </Grid>

                        <Grid item xs={12}>
                            {serviceList !== null &&
                                <MainCard noPadding sx={{ pl: 2, pr: 2, pt: 2, pb: 0 }}>
                                    <BasicTable data={serviceList} dense={true} rowsPerPage={10} />
                                </MainCard>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </>}
        </Grid>
    </>
    );
};

export default SubscriptionPackage;
