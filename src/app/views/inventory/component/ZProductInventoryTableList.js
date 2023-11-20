import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from "@mui/material/styles";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Paper, ButtonBase
} from '@mui/material';
import { IconPencil } from '@tabler/icons-react';
import { visuallyHidden } from '@mui/utils';
import ZTextLinkButton from 'ui-component/ZTextLinkButton';

const ZProductInventoryTableList = ({ data, invData, paging, onPageSizeChange, onPageChange, onSort, onClickView, onClickEdit }) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');

    const handleRequestSort = (property) => () => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        onSort(property, isAsc ? 'desc' : 'asc')
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = data && data.length > 0 ? paging.pageSize - data.length : 0;

    return (<>
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 0 }}>
                {(data && data.length > 0) &&
                    <TableContainer>
                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                            <TableHead>
                                <TableRow>
                                    {Object.keys(data[0]).filter(o => o !== 'code').map((k, v) => {
                                        return <TableCell key={k} align={'left'}
                                            padding='normal' sortDirection={orderBy === k ? order : false}>
                                            <TableSortLabel
                                                active={orderBy === k}
                                                direction={orderBy === k ? order : 'asc'}
                                                onClick={handleRequestSort(k)}>
                                                {t(k.toLowerCase()).toUpperCase()}
                                                {orderBy === k ? (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    })}
                                    <TableCell sx={{ flex: 0 }} align={'center'}>{t("onhand").toUpperCase()}</TableCell>
                                    <TableCell sx={{ flex: 0 }} align={'center'}>{t("reserved").toUpperCase()}</TableCell>
                                    <TableCell sx={{ flex: 0 }} align={'center'}>{t("in_transit").toUpperCase()}</TableCell>
                                    <TableCell sx={{ flex: 0 }} align={'center'} key={'Action'}>{t("action")}</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {Object.values(data).map((row, key) => (
                                    <TableRow hover tabIndex={-1} key={key}>
                                        <TableCell align="left">{row.id}</TableCell>
                                        {/* <TableCell align="left">{row.code}</TableCell> */}
                                        <TableCell align="left">
                                            <ZTextLinkButton variant="h4" align={'left'} select color={theme.palette.primary.dark} onClick={() => (onClickView(row))}>{row.name}</ZTextLinkButton>
                                        </TableCell>
                                        {/* <TableCell align="left">{row.description}</TableCell> */}
                                        <TableCell align="left">{row.uom}</TableCell>
                                        <TableCell align="left">{row.currency}</TableCell>
                                        <TableCell align="left">{row.unitprice}</TableCell>
                                        <TableCell align="left">{row.saftyStockLevel}</TableCell>
                                        {/* <TableCell align="left">{row.category}</TableCell> */}

                                        {/* To revise logic, although it's pulls per page data, logic here is not perfrect */}
                                        <TableCell align="center"
                                            sx={{ color: invData && Object.values(invData?.data).filter(o => o.code === row.code).map(r => r.onHand)[0] < row.saftyStockLevel ? 'red' : '' }}>
                                            {invData && (Object.values(invData?.data).filter(o => o.code === row.code).map(r => r.onHand)[0] ?? 0)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {invData && (Object.values(invData?.data).filter(o => o.code === row.code).map(r => r.reserved)[0] ?? 0)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {invData && (Object.values(invData?.data).filter(o => o.code === row.code).map(r => r.inTransit)[0] ?? 0)}
                                        </TableCell>


                                        <TableCell align={'center'}>
                                            <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '5px', paddingRight: '5px' }}
                                                onClick={() => (onClickEdit(row))}>
                                                <IconPencil stroke={1.5} size="1.5rem" color={theme.palette.primary.dark} />
                                            </ButtonBase>
                                        </TableCell>
                                    </TableRow>)
                                )}

                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (53) * emptyRows, }}>
                                        <TableCell colSpan={12} />
                                    </TableRow>)}
                            </TableBody>
                        </Table>
                    </TableContainer>}

                <TablePagination
                    rowsPerPageOptions={[10, 25]}
                    component="div"
                    labelRowsPerPage={t('rows_per_page')}
                    count={paging.total}
                    rowsPerPage={paging.pageSize}
                    page={paging.page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onPageSizeChange}
                />
            </Paper>
        </Box>
    </>);
}

export default ZProductInventoryTableList;