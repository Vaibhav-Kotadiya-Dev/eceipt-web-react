import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// material-ui
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Checkbox,
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Paper
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import { gridSpacing } from 'common/constant';
import { useAllTerms } from 'app/services/masters/TermService';
import { randomNumberInRange, translate } from 'common/functions';

const ZAddTermDialog = ({ open, onClickAdd, onClickCancel }) => {
    const { t } = useTranslation();

    const [data, setData] = useState(null);
    const [paging, setPaging] = useState();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState(null);

    const handleRequestSort = (property) => () => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        handleSort(property, isAsc ? 'desc' : 'asc')
    };

    useAllTerms(
        (response) => {
            if (response.code === "SUCCESS") {
                setData(response.data.data)
                setPaging(response.data.page)
            } else {
                setData(null)
                setPaging(null)
            }
        },
        (error) => {
            setData(null)
            setPaging(null)
        },
        page, pageSize, sortBy
    )

    const handleChangePageSize = (e) => {
        setPageSize(parseInt(e.target.value, 10))
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    };

    const handleSort = (property, order) => {
        setSortBy(property.toLowerCase() + "," + order)
    };

    const handleSelect = (e) => {
        var id = e.target.id
        var lst = Object.values(data).map((obj) => {
            if (obj.id.toString() === id.toString()) {
                obj = {
                    ...obj,
                    selected: obj.selected !== true ? true : false
                }
            }
            return obj;
        })
        setData(lst)
    };

    const handleClickAdd = () => {
        var lst = Object.values(data).filter((obj) => obj.selected === true)
        Object.values(lst).forEach(obj => {
            obj.orgId = obj.id
            obj.key = obj.id + '' + randomNumberInRange(10000, 50000)
            obj.id = null
        })

        onClickAdd(lst)
    }

    return (
        <Dialog aria-describedby="simple-modal-description" open={open} maxWidth={'lg'} fullWidth>
            <DialogTitle id="alert-dialog-title">
                {t("add_terms")}
            </DialogTitle>
            <DialogContent color='black'>
                <Grid container spacing={gridSpacing} justifyContent='center'>
                    <Grid item sx={{ width: '100%' }}>
                        {data &&
                            <Box sx={{ width: '100%' }}>
                                <Paper sx={{ width: '100%', mb: 0 }}>
                                    <TableContainer>
                                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell></TableCell>
                                                    {data[0] && Object.keys(data[0]).map((k, v) => {
                                                        if (k !== 'SELECTED') {
                                                            return <TableCell key={k} align={'left'}
                                                                padding='normal' sortDirection={orderBy === k ? order : false}>
                                                                <TableSortLabel
                                                                    active={orderBy === k}
                                                                    direction={orderBy === k ? order : 'asc'}
                                                                    onClick={handleRequestSort(k)}>
                                                                    {translate(k.toLowerCase()).toUpperCase()}
                                                                    {orderBy === k ? (
                                                                        <Box component="span" sx={visuallyHidden}>
                                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                                        </Box>
                                                                    ) : null}
                                                                </TableSortLabel>
                                                            </TableCell>
                                                        } else {
                                                            return null;
                                                        }
                                                    })}

                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {Object.values(data).map((row, key) => (
                                                    <TableRow hover tabIndex={-1} key={key}>
                                                        <TableCell>
                                                            <Checkbox
                                                                color="primary"
                                                                id={row['id'] + ''}
                                                                checked={row['selected'] === true}
                                                                onClick={handleSelect}
                                                            />
                                                        </TableCell>

                                                        {Object.keys(row).map((field, k) => {
                                                            if (field === 'selected') {
                                                                return null
                                                            } else {
                                                                return (<TableCell key={k} align="left">{row[field]}</TableCell>)
                                                            }
                                                        })}
                                                    </TableRow>)
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <TablePagination
                                        rowsPerPageOptions={[10, 25]}
                                        component="div"
                                        labelRowsPerPage={t('rows_per_page')}
                                        count={paging.total}
                                        rowsPerPage={paging.pageSize}
                                        page={paging.page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangePageSize}
                                    />
                                </Paper>
                            </Box>
                        }
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ mr: 5, pb: 2 }}>
                <Button variant="contained" color="primary" onClick={handleClickAdd}>{t("add_terms")}</Button>
                <Button variant="outlined" color="primary" onClick={onClickCancel}>{t("cancel")}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ZAddTermDialog;
