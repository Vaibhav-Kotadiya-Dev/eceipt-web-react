// import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import { useTheme } from "@mui/material/styles";
import {
    Chip, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography
} from '@mui/material';
import { IconFileInvoice, IconClockExclamation, IconPencil, IconArrowBackUp, IconTruckDelivery, IconCheckbox, IconMailForward, IconCircleX, IconRotateClockwise } from '@tabler/icons-react';
import { ConvertUTCDateToLocalSimpleDate, translate } from 'common/functions';
import { DoStatus } from 'app/common/OrderConstant';
import ZTitleActionButton from '../../../../ui-component/ZTitleActionButton';
import ZTextLinkButton from 'ui-component/ZTextLinkButton';



const ZDoTableList = ({ data, paging, onPageSizeChange, onPageChange, onClickView, onClickEdit, onClickCancel, onClickShip, onClickReceive, onCLickResend, onClickRevise, onClickPDF, regeneratePDF }) => {
    const theme = useTheme();
    const pkg = useSelector((state) => state.menu.pkg);
    const { t } = useTranslation();

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = data && data.length > 0 ? paging.pageSize - data.length : 0;
    return (<>
        {(data && data.length > 0) &&
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                    <TableHead>
                        <TableRow>
                            <TableCell align={'left'} padding='normal' >{t("order_number")}</TableCell>
                            <TableCell align={'left'} padding='normal' >{t("client")}</TableCell>
                            <TableCell align={'left'} padding='normal' >{t("delivery_date")}</TableCell>
                            <TableCell align={'left'} padding='normal' >{t("invoice")}</TableCell>
                            <TableCell align={'center'} padding='normal' >PDF</TableCell>
                            <TableCell align={'center'} padding='normal' >{t("status")}</TableCell>
                            {pkg === 1 && <TableCell align={'center'} padding='normal' >{t("action")}</TableCell>}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {Object.values(data).map((row, key) => (
                            <TableRow hover tabIndex={-1} key={key}>
                                <TableCell >{row.orderNumber ?
                                    <ZTextLinkButton variant="h4" align={'left'} select color={theme.palette.primary.dark} onClick={() => (onClickView(row))}>{row.orderNumber}</ZTextLinkButton>
                                    : <Typography variant="h4" >-</Typography>}</TableCell>
                                <TableCell >{row.clientName}</TableCell>
                                <TableCell >{ConvertUTCDateToLocalSimpleDate(row.deliveryDate)}</TableCell>
                                <TableCell >{row.invoiceNumber}</TableCell>

                                <TableCell align={'center'} sx={{ verticalAlign: 'center' }}>
                                    {row.pdfUrl &&
                                        <ZTitleActionButton onClick={() => (onClickPDF(row))}>
                                            <Tooltip title={t('view_pdf')}>
                                                <IconFileInvoice stroke={2} size="1.5rem" color={theme.palette.error.dark} />
                                            </Tooltip>
                                        </ZTitleActionButton>}
                                    {row.status !== 'CANCELLED' && row.status !== 'DRAFT' && !row.pdfUrl &&
                                        <Tooltip title={t('pdf_generating') + '...'}><span>
                                            <ZTitleActionButton disabled>
                                                <IconClockExclamation stroke={2} size="1.5rem" color={theme.palette.warning.dark} />
                                            </ZTitleActionButton>
                                        </span></Tooltip>}
                                    {/* to revise logic, 10min after last modification date */}
                                    {row.status !== 'CANCELLED' && !row.pdfUrl && row.status !== 'DRAFT' && (((Date.now() - row.updatedDate) / 60000) > 10) &&
                                        <ZTitleActionButton onClick={() => regeneratePDF()}>
                                            <Tooltip title={t("regenerate_pdf_message")}>
                                                <IconRotateClockwise stroke={2} size="1.5rem" />
                                            </Tooltip>
                                        </ZTitleActionButton>}
                                </TableCell>

                                <TableCell align={'center'}><Chip label={translate(row.status.toUpperCase())} color="primary" size="small" style={{ backgroundColor: DoStatus[row.status], color: 'white', padding: 0 }} /></TableCell>

                                {pkg === 1 && <TableCell align={'center'}>
                                    {row.status === 'DRAFT' &&
                                        <ZTitleActionButton onClick={() => onClickEdit(row)}>
                                            <Tooltip title={t("edit")}>
                                                <IconPencil fontSize="inherit" stroke={1.5} size="1.5rem" />
                                            </Tooltip>
                                        </ZTitleActionButton>
                                    }

                                    {row.status === 'GENERATED' &&
                                        <ZTitleActionButton onClick={() => onClickRevise(row)}>
                                            <Tooltip title={t("revise")}>
                                                <IconArrowBackUp fontSize="inherit" stroke={1.5} size="1.5rem" />
                                            </Tooltip>
                                        </ZTitleActionButton>}

                                    {row.status === 'GENERATED' && (row.pdfUrl ?
                                        <ZTitleActionButton onClick={() => onClickShip(row)}>
                                            <Tooltip title={t("ship")}><IconTruckDelivery fontSize="inherit" stroke={1.5} size="1.5rem" /></Tooltip>
                                        </ZTitleActionButton>
                                        :
                                        <Tooltip title={t("pdf_generating")}><span>
                                            <ZTitleActionButton disabled onClick={() => { }}>
                                                <IconTruckDelivery fontSize="inherit" stroke={1.5} size="1.5rem" />
                                            </ZTitleActionButton>
                                        </span></Tooltip>)
                                    }

                                    {row.status === 'TRANSIT' &&
                                        <ZTitleActionButton onClick={() => onClickReceive(row)}>
                                            <Tooltip title={t("receive")}>
                                                <IconCheckbox fontSize="inherit" stroke={1.5} size="1.5rem" />
                                            </Tooltip>
                                        </ZTitleActionButton>}

                                    {row.status === 'TRANSIT' &&
                                        <ZTitleActionButton onClick={() => onCLickResend(row)}>
                                            <Tooltip title={t("resend_email")}>
                                                <IconMailForward fontSize="inherit" stroke={1.5} size="1.5rem" />
                                            </Tooltip>
                                        </ZTitleActionButton>}

                                    {row.status !== 'DELIVERED' && row.status !== 'CANCELLED' && !(row.status === 'GENERATED' && row.pdfUrl == null) &&
                                        <ZTitleActionButton onClick={() => onClickCancel(row)}>
                                            <Tooltip title={t("cancel")}>
                                                <IconCircleX fontSize="inherit" stroke={1.5} size="1.5rem" color={theme.palette.error.dark} />
                                            </Tooltip>
                                        </ZTitleActionButton>}

                                </TableCell>}
                            </TableRow>)
                        )}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: (53) * emptyRows, }}>
                                <TableCell colSpan={12} />
                            </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>}


        <Grid item xs={12}>
            <Divider />
        </Grid>

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
    </>);
}

ZDoTableList.propTypes = {
    selectedId: PropTypes.array
};

export default ZDoTableList;