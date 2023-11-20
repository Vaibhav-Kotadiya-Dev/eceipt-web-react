// import { useNavigate } from 'react-router-dom';
// material-ui
import {
    Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@mui/material';

import BasicTable from "ui-component/BasicTable";
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useSchedulerLogs } from "aas/services/SchedulerService";
import { ConvertUTCDateToLocalDate } from "common/functions";
import { useState } from "react";
import ZBackdrop from "ui-component/ZBackdrop";

// ==============================|| SchedulerLog PAGE ||============================== //
const SchedulerLog = () => {
    // const navigate = useNavigate();
    
    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [tableData, setTableData] = useState([]);

    const [viewDetail, setViewDetail] = useState(false);
    const [detailMsg, setDetailMsg] = useState(null);


    const { isLoading, data, isError: loadingError, error: loadingErrorMsg } = useSchedulerLogs(
        (response) => {
            if (response.code === "SUCCESS") {
                response.data.sort((obj1, obj2) => obj1.id > obj2.id ? 1 : -1)
                var lst = response.data.map((content, key) => {
                    return {
                        id: content.id,
                        created: ConvertUTCDateToLocalDate(content.createdDate),
                        name: content.searchKey,
                        operation: content.operation,
                        log: content.log.toString().length > 100 ? content.log.toString().substring(0, 100) + ' ......' : content.log,
                    }
                })
                setTableData(lst)
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.data.message)
            }
        }, (error) => {
            setDataLoadingError(error.message)
        })


    const handleClickView = (e) => {
        // console.log(e.id)
        var schedule = Object.values(data.data).filter((element) => element.id === e.id)
        setDetailMsg(schedule[0].log)
        setViewDetail(true)
    }

    return (
        <>
            {(loadingError || dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>Data failed to load. {dataLoadingError ?? ''} {loadingErrorMsg?.message ?? ''}</Alert>}
            <ZBackdrop open={isLoading} />
            <Dialog aria-describedby="simple-modal-description" open={viewDetail} >
                <DialogTitle id="alert-dialog-title">
                    {"Log Detail"}
                </DialogTitle>
                <DialogContent  >
                    <DialogContentText id="alert-dialog-description" color='black'>
                        {detailMsg}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="primary" onClick={() => setViewDetail(false)}>OK</Button>
                </DialogActions>
            </Dialog>

            <MainCard contentSX={{ padding: 1 }} title="Schedule Log">
                {tableData !== null && tableData.length > 0 ?
                    <BasicTable data={tableData} enableView={true} onClickView={handleClickView} dense={true} rowsPerPage={20} />
                    : null}
            </MainCard>
        </>
    )
}

export default SchedulerLog;