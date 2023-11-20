import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import { useTheme } from "@mui/material/styles";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Paper, ButtonBase, Chip, Checkbox
} from '@mui/material';
import { IconPencil, IconEye, IconX } from '@tabler/icons-react';
import { visuallyHidden } from '@mui/utils';
import { StatusCode } from 'common/constant';
import { translate } from 'common/functions';

const ZPaginationTable = ({ data, paging, selectedId, onSelect, withCheckBox, onPageSizeChange, onPageChange, sort, onSort, enableEdit, enableView, enableDelete, enableCust, onClickView, onClickEdit, onClickDelete, onClickCust, custIcon }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');

    const [chk] = useState(selectedId);

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
                                    {withCheckBox && <TableCell></TableCell>}

                                    {Object.keys(data[0]).map((k, v) => {
                                        return sort !== false ?
                                            <TableCell key={k} align={'left'}
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
                                            :
                                            <TableCell key={k} align={'left'}
                                                padding='normal'>
                                                {translate(k.toLowerCase()).toUpperCase()}
                                            </TableCell>
                                    })}
                                    {(enableEdit || enableView || enableDelete) && (<TableCell sx={{ flex: 0 }} align={'right'} key={'Action'}>{t("action")}</TableCell>)}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {Object.values(data).map((row, key) => (
                                    <TableRow hover tabIndex={-1} key={key}>
                                        {/* {withCheckBox && console.log(selectedId.indexOf(row['id']) > -1)} */}
                                        {withCheckBox &&
                                            <TableCell>
                                                <Checkbox
                                                    color="primary"
                                                    id={row['id'] + ''}
                                                    checked={chk.indexOf(row['id']) > -1}
                                                    onChange={onSelect}
                                                />
                                            </TableCell>}

                                        {Object.keys(row).map((field, k) => {
                                            if (field.toUpperCase() === 'STATUS') {
                                                var sel = Object.keys(StatusCode).filter((statuskey, value) => statuskey.toUpperCase() === row[field].toUpperCase())
                                                if (sel.length > 0) {
                                                    return (<TableCell key={k}><Chip label={row[field].toUpperCase()} color="primary" size="small" style={{ backgroundColor: StatusCode[sel[0]], color: 'white', padding: 0 }} /></TableCell>)
                                                } else {
                                                    return (<TableCell key={k}>{row[field]}</TableCell>)
                                                }
                                            } else {
                                                return (<TableCell key={k} align="left">{row[field]}</TableCell>)
                                            }
                                        })}

                                        {(enableEdit || enableView || enableDelete || enableCust) && (
                                            <TableCell align={'right'}>
                                                {enableView &&
                                                    <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '5px', paddingRight: '5px' }}
                                                        onClick={() => (onClickView(row))}>
                                                        <IconEye stroke={1.5} size="1.5rem" color={theme.palette.primary.dark} />
                                                    </ButtonBase>}
                                                {enableEdit &&
                                                    <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '5px', paddingRight: '5px' }}
                                                        onClick={() => (onClickEdit(row))}>
                                                        <IconPencil stroke={1.5} size="1.5rem" color={theme.palette.primary.dark} />
                                                    </ButtonBase>}
                                                {enableDelete &&
                                                    <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '5px', paddingRight: '5px' }}
                                                        onClick={() => (onClickDelete(row))}>
                                                        <IconX stroke={1.5} size="1.5rem" color={theme.palette.error.dark} />
                                                    </ButtonBase>}
                                                {enableCust &&
                                                    <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '5px', paddingRight: '5px' }}
                                                        onClick={() => (onClickCust(row))}>
                                                        {custIcon}
                                                    </ButtonBase>}
                                            </TableCell>)}
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

ZPaginationTable.propTypes = {
    selectedId: PropTypes.array
};

export default ZPaginationTable;