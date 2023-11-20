import { useState } from "react";
// material-ui
import {
    Alert, Button, ButtonBase, Grid, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Typography, Tooltip
} from '@mui/material';

import BasicTable from "ui-component/BasicTable";
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useAllScheduleInfo, useCreateUpdateSchedule, useDeleteSchedule, usePauseSchedule, useResumeSchedule } from "aas/services/SchedulerService";
import { ConvertUTCDateToLocalDate } from "common/functions";

import ZBackdrop from "ui-component/ZBackdrop";

import { gridSpacing } from 'common/constant';
import ZPromptConfirmation from "ui-component/ZPromptConfirmation";

import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import ZTextWithTitle from "ui-component/ZTextWithTitle";
import { toast } from "react-toastify";

// ==============================|| SchedulerList PAGE ||============================== //
const SchedulerList = () => {
    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [tableData, setTableData] = useState([]);

    const [create, setCreate] = useState(false);
    const [remove, setRemove] = useState(false);
    const [edit, setEdit] = useState(false);
    const [mode, setMode] = useState("CREATE");
    const [schedule, setSchedule] = useState({
        jobName: null,
        jobGroup: null,
        description: null,
        method: null,
        url: null,
        parameter: null,
        repeatTime: null,
        cronExpression: null
    });
    const [selId, setSelId] = useState(false);
    const clearScheduleData = () => {
        setSchedule({
            jobName: null,
            jobGroup: null,
            description: null,
            method: null,
            url: null,
            parameter: null,
            repeatTime: null,
            cronExpression: null
        });
    }

    const { isLoading, data, isError: loadingError, error: loadingErrorMsg } = useAllScheduleInfo(
        (response) => {
            if (response.code === "SUCCESS") {
                response.data.sort((obj1, obj2) => obj1.id > obj2.id ? 1 : -1)
                var lst = response.data.map((content, key) => {
                    return {
                        id: content.id,
                        name: content.jobName,
                        description: content.description,
                        group: content.jobGroup,
                        cron: content.cronExpression,
                        next_run: ConvertUTCDateToLocalDate(content.nextTriggerTime),
                        count: content.count,
                        status: content.jobStatus,
                    }
                })
                // console.log(lst)
                setTableData(lst)
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.data.message)
            }
        }, (error) => {
            setDataLoadingError(error.message)
        })

    const { mutate: createSchedule, isLoading: createLoading } = useCreateUpdateSchedule(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('Schedule Created.')
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: deleteSchedule, isLoading: deleteLoading } = useDeleteSchedule(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('Schedule Deleted.')
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: pauseSchedule, isLoading: pauseLoading } = usePauseSchedule(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('Schedule Paused.')
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: resumeSchedule, isLoading: resumeLoading } = useResumeSchedule(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('Schedule Resumed.')
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSchedule({
            ...schedule,
            [name]: value,
        });
    };
    const handleClickEdit = (e) => {
        var schedule = Object.values(data.data).filter((element) => element.id === e.id)
        setSchedule(schedule[0])
        setMode('EDIT')
        setEdit(true)
    }

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        await createSchedule(schedule)
        setCreate(false)
        setEdit(false)
        clearScheduleData()
    }

    const handleClickDelete = async (e) => {
        setSelId(e.id)
        setRemove(true)
    };
    const handleDelete = async () => {
        await deleteSchedule(selId)
        setRemove(false)
        setSelId(null)
    };

    const handlePause = async () => {
        console.log('pause')

        await pauseSchedule(schedule.id);
        setEdit(false)
        clearScheduleData()
    }

    const handleResume = async () => {
        console.log('resume')

        await resumeSchedule(schedule.id);
        setEdit(false)
        clearScheduleData()
    }

    return (
        <>
            {(loadingError || dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>Data failed to load. {dataLoadingError ?? ''} {loadingErrorMsg?.message ?? ''}</Alert>}
            <ZBackdrop open={isLoading || createLoading || deleteLoading || pauseLoading || resumeLoading} />

            <ZPromptConfirmation open={remove}
                fullWidth
                title={"Please confirm"}
                text={'You are about to delete a schedule, please confirm.'}
                deleteButtonText={'Delete'}
                enableCancel={true}
                onClickDelete={handleDelete}
                onClickCancel={() => { setRemove(false) }}
            />

            <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="md" open={edit} >
                <form onSubmit={handleSubmitCreate}>
                    <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>

                        <Grid container justifyContent="space-between" alignItems="center" spacing={gridSpacing} sx={{ mb: 1 }}
                            flexDirection={{ xs: 'column', sm: 'row' }}>
                            <Grid item sx={{ order: { xs: 2, sm: 1 } }}>
                                <Typography variant="h3">{"Create Scheduler"}</Typography>
                            </Grid>
                            <Grid item sx={{ order: { xs: 1, sm: 2 } }}>
                                <Grid container columnSpacing={1} >
                                    <Grid item>
                                        {schedule.jobStatus === 'RUNNING' ? (<Tooltip title="Pause" placement="top">
                                            <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '5px', paddingRight: '5px' }}
                                                onClick={() => { handlePause() }}>
                                                <IconPlayerPause stroke={1.5} size="1.5rem" color={'orange'} />
                                            </ButtonBase></Tooltip>)
                                            : (
                                                <Tooltip title="Start" placement="top">
                                                    <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '5px', paddingRight: '5px' }}
                                                        onClick={() => { handleResume() }}>
                                                        <IconPlayerPlay stroke={1.5} size="1.5rem" color={'green'} />
                                                    </ButtonBase></Tooltip>
                                            )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                            {mode === "EDIT" ?
                                <Grid item lg={6} md={8} sm={10} xs={12}>
                                    <TextField
                                        fullWidth
                                        disabled
                                        label="Name"
                                        value={schedule.jobName ?? " "}
                                        InputProps={{ readOnly: true, }}
                                    />
                                </Grid>
                                :
                                <Grid item lg={6} md={8} sm={10} xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        name="jobName"
                                        label="Name"
                                        value={schedule.jobName ?? ""}
                                        onChange={handleInputChange}
                                    />
                                </Grid>}
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="description"
                                    label="Description"
                                    value={schedule.description ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item lg={3} md={6} sm={6} xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    name="jobGroup"
                                    label="Group"
                                    value={schedule.jobGroup ?? ""}
                                    defaultValue={'API'}
                                    onChange={handleInputChange}>
                                    <MenuItem key={'API'} value={'API'}>API</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item lg={3} md={6} sm={6} xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    name="method"
                                    label="Method"
                                    value={schedule.method ?? ""}
                                    defaultValue={'POST'}
                                    onChange={handleInputChange}>
                                    <MenuItem key={'POST'} value={'POST'}>POST</MenuItem>
                                    <MenuItem key={'GET'} value={'GET'}>GET</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="url"
                                    label="URL"
                                    value={schedule.url ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="cronExpression"
                                    label="Cron Expression"
                                    value={schedule.cronExpression ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    name="parameter"
                                    label="Parameter"
                                    value={schedule.parameter ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            {mode === "EDIT" && <>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ZTextWithTitle
                                        title={'Next Trigger Time'} titleToolTips={''}
                                        text={ConvertUTCDateToLocalDate(schedule.nextTriggerTime)} textToolTips={''} />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ZTextWithTitle
                                        title={'Job Run Count'} titleToolTips={''}
                                        text={schedule.count} textToolTips={''} />
                                </Grid></>}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained" color="primary">{'Create'} </Button>
                        <Button variant="outlined" color="primary" onClick={() => {
                            setEdit(false)
                            clearScheduleData()
                        }}>Cancel</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="md" open={create} >
                <form onSubmit={handleSubmitCreate}>
                    <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{"Create Scheduler"}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                            <Grid item lg={6} md={8} sm={10} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    name="jobName"
                                    label="Name"
                                    value={schedule.jobName ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="description"
                                    label="Description"
                                    value={schedule.description ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item lg={3} md={6} sm={6} xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    name="jobGroup"
                                    label="Group"
                                    value={schedule.jobGroup ?? ""}
                                    defaultValue={'API'}
                                    onChange={handleInputChange}>
                                    <MenuItem key={'API'} value={'API'}>API</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item lg={3} md={6} sm={6} xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    name="method"
                                    label="Method"
                                    value={schedule.method ?? ""}
                                    defaultValue={'POST'}
                                    onChange={handleInputChange}>
                                    <MenuItem key={'POST'} value={'POST'}>POST</MenuItem>
                                    <MenuItem key={'GET'} value={'GET'}>GET</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="url"
                                    label="URL"
                                    value={schedule.url ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="cronExpression"
                                    label="Cron Expression"
                                    value={schedule.cronExpression ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    name="parameter"
                                    label="Parameter"
                                    value={schedule.parameter ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained" color="primary">{'Create'} </Button>
                        <Button variant="outlined" color="primary" onClick={() => {
                            setCreate(false)
                            clearScheduleData()
                        }}>Cancel</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <MainCard contentSX={{ padding: 1 }} title="Scheduler" secondary={
                <Button disableElevation type="submit" size="small" variant="contained" color="primary" onClick={() => { setCreate(true); setMode('CREATE') }}> Create </Button>
            }>
                {tableData !== null && tableData.length > 0 ?
                    <BasicTable data={tableData} enableEdit={true} onClickEdit={handleClickEdit}
                        enableDelete={true} onClickDelete={handleClickDelete} />
                    : null}
            </MainCard>
        </>
    )

};

export default SchedulerList;




