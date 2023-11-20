// import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import { useTheme, styled } from "@mui/material/styles";
import {
    Chip, Divider, Grid, TablePagination, Tooltip, Typography
} from '@mui/material';
import { IconFileInvoice, IconClockExclamation, IconRotateClockwise } from '@tabler/icons-react';
import SubCard from '../../../../ui-component/cards/SubCard';
import { ConvertUTCDateToLocalSimpleDate, translate } from 'common/functions';
import BasicTableSmall from '../../../../ui-component/BasicTableSmall';
import { InvoiceStatus } from 'app/common/OrderConstant';
import ZTextLinkButton from 'ui-component/ZTextLinkButton';
import ZTitleActionButton from 'ui-component/ZTitleActionButton';

const GridStyled = styled(Grid)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:before': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: 10,
        background: `linear-gradient(0deg, ${theme.palette.primary.main} 100%, rgba(0, 0, 0, 0) 0%)`,
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        top: 0,
        left: 0
    }
}));


const ZInvoiceCardList = ({ data, paging, onPageSizeChange, onPageChange, onClickView, onClickEdit, onClickCancel, onClickInvoice, onClickPaid, onCLickResend, onClickRevise, onClickPDF, regeneratePDF }) => {
    const theme = useTheme();
    const pkg = useSelector((state) => state.menu.pkg);
    const { t } = useTranslation();

    return (<>
        {(data && data.length > 0) &&
            // <Grid container spacing={1}>
            //     <Grid item xs={12}>
            Object.values(data).map((row, key) => (
                <GridStyled key={key}>
                    <SubCard sx={{ borderColor: theme.palette.primary.light, mb: 1 }} dividerSX={{ borderColor: theme.palette.grey[200] }}>
                        <Grid container justifyContent={'space-between'}>
                            <Grid item xs={2} sx={{ pr: 1, borderRight: 1, borderColor: theme.palette.grey[200] }}>
                                <Typography variant='caption'>{t("order_number") + ': '}</Typography>
                                <br />
                                {row.orderNumber ?
                                    <ZTextLinkButton variant="h4" align={'left'} select color={theme.palette.primary.dark} onClick={() => (onClickView(row))}>{row.orderNumber}</ZTextLinkButton>
                                    // <Typography variant="h4" component={Button} textAlign={'left'} sx={{
                                    //     p: 0, textDecoration: 'none', color: theme.palette.primary.dark, '&:hover': {
                                    //         textDecoration: "underline",
                                    //         backgroundColor: 'white'
                                    //     }
                                    // }} onClick={() => (onClickView(row))}>
                                    //     {row.orderNumber}</Typography>
                                    : <Typography variant="h4" >-</Typography>}

                                <Typography sx={{ pb: 1 }}></Typography>
                                <Typography variant='caption'>{t("order_to") + ': '}</Typography>
                                <Typography variant='h4'>{row.clientName}</Typography>
                                <Typography sx={{ pb: 1 }}></Typography>
                                <Typography variant='caption'>{t("invoice_date") + ': '}</Typography>
                                <Typography variant='h4'>{ConvertUTCDateToLocalSimpleDate(row.invoiceDate)}</Typography>
                            </Grid>
                            <Grid item sx={{ backgroundColor: '', flexGrow: 1, px: 1, borderRight: 1, borderColor: theme.palette.grey[200] }}>
                                {/* <Typography variant='caption'>{'Product Summary: '}</Typography> */}
                                {row?.items &&
                                    <BasicTableSmall noPage dense data={Object.values(row.items).map(item => {
                                        return {
                                            no: item.sequence + 1,
                                            name: item.name,
                                            description: item.description,
                                            quantity: item.quantity,
                                            uom: item.uom,
                                            total: item.totalPrice,
                                            currency: item.currency,
                                        }
                                    })} />}

                            </Grid>
                            <Grid item xs={1} sx={{ backgroundColor: '', px: 1, borderRight: 1, borderColor: theme.palette.grey[200] }} align='center'>
                                <Typography variant='caption'>{'PDF'}</Typography>
                                <Grid sx={{ pt: 1 }}>
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
                                </Grid>
                                {pkg === 1 && <Grid sx={{ pt: 1 }}>
                                    {/* 10min after last modification date */}
                                    {row.status !== 'CANCELLED' && !row.pdfUrl && row.status !== 'DRAFT' && (((Date.now() - row.updatedDate) / 60000) > 10) &&
                                        <ZTitleActionButton onClick={() => regeneratePDF(row)}>
                                            <Tooltip title={t("regenerate_pdf_message")}>
                                                <IconRotateClockwise stroke={2} size="1.5rem" />
                                            </Tooltip>
                                        </ZTitleActionButton>
                                    }
                                </Grid>}
                            </Grid>
                            <Grid item xs={2} sx={{ backgroundColor: '', px: 1, borderRight: 1, borderColor: theme.palette.grey[200] }} align='center'>
                                <Typography variant='caption'>{t("status")}</Typography>
                                <Grid sx={{ pt: 1 }}>
                                    <Chip label={translate(row.status.toUpperCase())} color="primary" size="small" style={{ backgroundColor: InvoiceStatus[row.status], color: 'white', padding: 0 }} />
                                </Grid>
                            </Grid>
                            {pkg === 1 && <Grid item xs={1} sx={{ backgroundColor: '', px: 1 }}>
                                <Typography variant='caption'>{t("action")}</Typography>
                                {row.status === 'DRAFT' &&
                                    <Grid sx={{ mb: 1, textAlign: 'left' }}>
                                        <ZTextLinkButton variant="body2" align={'left'} noWrap color={theme.palette.primary.dark} onClick={() => (onClickEdit(row))}>{t("edit")}</ZTextLinkButton>
                                    </Grid>}
                                {/* {row.status === 'DRAFT' &&
                                    <Grid sx={{ mb: 1 }}>
                                        <Typography variant="h5" noWrap component={Link}
                                            sx={{
                                                textDecoration: 'none', color: theme.palette.primary.dark, '&:hover': {
                                                    textDecoration: "underline"
                                                }
                                            }}>Finalise</Typography>
                                    </Grid>} */}
                                {row.status === 'GENERATED' &&
                                    <Grid sx={{ mb: 1 }}>
                                        <ZTextLinkButton variant="h5" align={'left'} noWrap color={theme.palette.primary.dark} onClick={() => (onClickRevise(row))}>{t("revise")}</ZTextLinkButton>
                                    </Grid>}
                                {row.status === 'GENERATED' && (row.pdfUrl ?
                                    <Grid sx={{ mb: 1 }}>
                                        <ZTextLinkButton variant="h5" align={'left'} noWrap color={theme.palette.primary.dark} onClick={() => (onClickInvoice(row))}>{t("invoice")}</ZTextLinkButton>
                                    </Grid> :
                                    <Tooltip title={t("pdf_generating")}>
                                        <Typography variant="h5" noWrap component={''} justifyContent={'left'}
                                            sx={{
                                                p: 0, textDecoration: 'none', color: theme.palette.grey[500]
                                            }}>{t("invoice")}</Typography>
                                    </Tooltip>)
                                }

                                {row.status === 'INVOICED' &&
                                    <Grid sx={{ mb: 1 }}>
                                        {/* <Typography variant="h5" noWrap component={Button} justifyContent={'left'}
                                            sx={{
                                                p: 0, mb: 1, textDecoration: 'none', color: theme.palette.primary.dark, '&:hover': {
                                                    textDecoration: "underline", backgroundColor: 'white'
                                                }
                                            }} onClick={() => (onClickPaid(row))}>Paid</Typography> */}
                                        <ZTextLinkButton variant="h5" align={'left'} noWrap color={theme.palette.primary.dark} onClick={() => (onClickPaid(row))}>{t("paid")}</ZTextLinkButton>
                                        {/* <Typography variant="h5" noWrap component={Button} justifyContent={'left'}
                                            sx={{
                                                p: 0, textDecoration: 'none', color: theme.palette.primary.dark, '&:hover': {
                                                    textDecoration: "underline", backgroundColor: 'white'
                                                }
                                            }} onClick={() => (onCLickResend(row))}>Resend Email</Typography> */}
                                        <br />
                                        <ZTextLinkButton variant="h5" align={'left'} noWrap color={theme.palette.primary.dark} onClick={() => (onCLickResend(row))}>{t("resend_email")}</ZTextLinkButton>
                                    </Grid>}

                                {row.status !== 'SETTLED' && row.status !== 'CANCELLED' && !(row.status === 'GENERATED' && row.pdfUrl == null) &&
                                    <Grid sx={{ mt: 2 }}>
                                        {/* <Typography variant="body2" noWrap component={Button} justifyContent={'left'}
                                            sx={{
                                                p: 0, textDecoration: 'none', color: theme.palette.error.dark, '&:hover': {
                                                    textDecoration: "underline", backgroundColor: 'white'
                                                }
                                            }} onClick={() => (onClickCancel(row))}>Cancel</Typography> */}
                                        <ZTextLinkButton variant="body2" align={'left'} noWrap color={theme.palette.error.dark} onClick={() => (onClickCancel(row))}>{t("cancel")}</ZTextLinkButton>
                                    </Grid>}
                            </Grid>}
                        </Grid>
                    </SubCard>
                </GridStyled>
            ))
        }

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

ZInvoiceCardList.propTypes = {
    selectedId: PropTypes.array
};

export default ZInvoiceCardList;