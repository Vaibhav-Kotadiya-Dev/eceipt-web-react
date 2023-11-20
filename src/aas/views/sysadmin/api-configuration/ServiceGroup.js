import { useState } from 'react';

// material-ui
import { Grid, Typography, Chip, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Alert } from '@mui/material';
// import { styled } from "@mui/material/styles";
import { gridSpacing } from 'common/constant';

import ZCardList from 'ui-component/ZCardList';
import { gridSpacingSML } from 'common/constant';
import ZBackdrop from 'ui-component/ZBackdrop';
import MainCard from 'ui-component/cards/MainCard';
import { useAddGroupService, useAllServiceGroup, useAllServices, useRemoveGroupService, useServiceGroupByCode } from 'aas/services/SubscriptionPackageService';
import BasicTable from 'ui-component/BasicTable';
import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';
import { toast } from 'react-toastify';



// ==============================|| DEFAULT DASHBOARD ||============================== //
const ServiceGroup = () => {
    // const theme = useTheme();
    // const [isLoading, setLoading] = useState(false);

    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [serviceGroupList, setServiceGroupList] = useState(null);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [currentCode, setCurrentCode] = useState(null);

    const [startLink, setStartLink] = useState(false);
    const [selService, setSelService] = useState(null);
    const [serviceList, setServiceList] = useState(null);
    const [serviceListFiltered, setServiceListFiltered] = useState(null);

    const [openConfirmation, setOpenConfirmation] = useState(false);

    const { isLoading, isError: loadingError, error: loadingErrorMsg } = useAllServiceGroup(
        (response) => {
            if (response.code === "SUCCESS") {
                 response.data.sort((obj1, obj2) => obj1.code > obj2.code ? 1 : -1)
                var lst = Object.values(response.data).map(e => { return { ...e, name: e.code } })
                setServiceGroupList(lst)
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.data.message)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
        })

    const { isLoading: singleGpLoading, isError: loadingErrorSingleGp, error: loadingErrorMsgSingleGp, refetch: refetchSingleGp } = useServiceGroupByCode(currentCode,
        (response) => {
            if (response.code === "SUCCESS") {
                setCurrentGroup(response.data)
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.data.message)
            }
        },
        (error) => {
            // console.log(error)
            setDataLoadingError(error.message)
        })

    const { isLoading: serviceLoading, isError: loadingErrorService, error: loadingErrorMsgService } = useAllServices(
        (response) => {
            if (response.code === "SUCCESS") {
                response.data.sort((obj1, obj2) => obj1.code > obj2.code ? 1 : -1)
                setServiceList(response.data)
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.data.message)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
        })

    const { mutate: addGroupService, isLoading: addLoading } = useAddGroupService(
        (response) => {
            // console.log(response)
            if (response.data.code === "SUCCESS") {
                toast.success('Service added.')
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: removeGroupService, isLoading: removeLoading } = useRemoveGroupService(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('Service removed.')
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const reloadCurrentGroup = (e) => {
        setCurrentCode(e)
        refetchSingleGp()
    }

    const handleClickDelete = (e) => {
        setSelService(e.id)
        setOpenConfirmation(true)
    }

    const handleDeleteConfirmation = async (e) => {
        e.preventDefault();
        var data = {
            serviceId: selService,
            groupId: currentGroup.id
        }

        await removeGroupService(data);
        refetchSingleGp()
        setOpenConfirmation(false)
        setSelService(null)
    }

    const loadService = () => {
        var currentGroupServiceIds = Object.values(currentGroup.services).map(e => e.id)
        var lst = serviceList.filter(e => !currentGroupServiceIds.includes(e.id))
        setServiceListFiltered(lst)
    }

    const onChangeSel = (e) => {
        // console.log(e)
        reloadCurrentGroup(e)
    }

    const handleSubmitLink = async (e) => {
        e.preventDefault();
        // console.log(selService)
        var data = {
            serviceId: selService,
            groupId: currentGroup.id
        }

        await addGroupService(data);
        refetchSingleGp()
        setStartLink(false)
    };

    return (<>
        {(dataLoadingError || loadingError || loadingErrorSingleGp || loadingErrorService)
            && <Alert severity="error" style={{ marginBottom: 10 }}>Data failed to load.
                {dataLoadingError ?? ''}{loadingErrorMsg?.message ?? ''}{loadingErrorMsgSingleGp?.message ?? ''}{loadingErrorMsgService?.message}</Alert>}
        <ZBackdrop open={isLoading || singleGpLoading || removeLoading || addLoading || serviceLoading} />

        <ZPromptConfirmation open={openConfirmation}
            fullWidth
            title={"Please confirm"}
            text={'you are about to delete a record'}
            deleteButtonText={'delete'}
            enableCancel={true}
            onClickDelete={handleDeleteConfirmation}
            onClickCancel={() => { setSelService(null); setOpenConfirmation(false) }}
        />

        <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="sm" open={startLink} >
            <form onSubmit={handleSubmitLink}>
                <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{"Add Service"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                        <Grid item md={12} xs={12}>
                            {serviceListFiltered &&
                                <TextField
                                    select
                                    fullWidth
                                    label="Method"
                                    defaultValue={'GET'}
                                    value={selService ?? ""}
                                    onChange={(value) => { setSelService(value.target.value) }}>
                                    {Object.values(serviceListFiltered).sort((obj1, obj2) => obj1.permission > obj2.permission ? 1 : -1).map(e => (<MenuItem key={e.id} value={e.id}><i>[{e.permission}]</i>&nbsp; {e.url} &nbsp; <i>[{e.description}]</i></MenuItem>))}
                                </TextField>}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" color="primary">{'Add'} </Button>
                    <Button variant="outlined" color="primary" onClick={() => {
                        setStartLink(false)
                        // clearForm()
                    }}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>

        <Grid container spacing={gridSpacingSML} direction="row" sx={{ backgroundColor: '' }}>
            <Grid item xs={2} alignItems="flex-start" sx={{ backgroundColor: '' }} >
                {serviceGroupList &&
                    <ZCardList data={serviceGroupList} onChangeSel={onChangeSel} title='Service Group' />}
            </Grid>
            {(currentGroup && currentCode) && <>
                <Grid item xs={10} sx={{ backgroundColor: '' }}>
                    <Grid container spacing={gridSpacingSML}>
                        <Grid item xs={12}>
                            <MainCard noPadding sx={{ pl: 2, pr: 2, pt: 1.5, pb: 1.5 }}>
                                <Grid container spacing={gridSpacing} alignContent="center" justifyContent="space-between"  >
                                    <Grid item alignContent="center" sx={{ p: 0, m: 0 }}>
                                        <Grid container direction="row" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                                            <Grid item>
                                                <Typography variant="h4" sx={{ p: 0, m: 0, backgroundColor: '#FFFFFF' }}>{currentGroup.code}</Typography>
                                            </Grid>
                                            <Grid item sx={{ ml: 1 }}>
                                                <Chip label={currentGroup.description} variant="outlined" color="info" size="small" />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item alignContent="center">
                                        <Grid container direction="row" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                                            <Grid item justifyContent={'flex-end'} sx={{ ml: 1 }}>
                                                <Button disableElevation size="small" variant={"contained"} color="info" sx={{ borderRadius: 1 }}
                                                    onClick={() => { loadService(); setStartLink(true); }}>Link Services</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </MainCard >
                        </Grid>

                        <Grid item xs={12}>
                            {currentGroup.services !== null &&
                                <MainCard noPadding sx={{ pl: 2, pr: 2, pt: 2, pb: 0 }}>
                                    <BasicTable data={currentGroup.services.sort((obj1, obj2) => obj1.url > obj2.url ? 1 : -1)} dense={true} rowsPerPage={20} enableDelete={true} onClickDelete={handleClickDelete} />
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

export default ServiceGroup;
