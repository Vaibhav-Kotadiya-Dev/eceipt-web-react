import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Grid, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Divider, MenuItem, FormHelperText
} from '@mui/material';

import { gridSpacing } from "common/constant";
import ZTextWithTitle from "ui-component/ZTextWithTitle";

const ZAdjustInventoryDialog = ({ open, product, onClickCancel, onClickOk }) => {
    // const theme = useTheme();
    const { t } = useTranslation();

    const [movement, setMovement] = useState('IN');
    const [quantity, setQuantity] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [error, setError] = useState();

    const handleClickOk = () => {
        if (quantity <= 0) {
            setError(t("number_more_than_zero_error"))
            return;
        } else {
            setError('')
        }

        onClickOk({ movement: movement, quantity: quantity, remarks: remarks })

        setMovement('IN')
        setQuantity(0)
        setRemarks('')
    }

    const handleClickCancel = () => {

        setError('')
        setMovement('IN')
        setQuantity(0)
        setRemarks('')

        onClickCancel()
    }

    return (
        <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="md" open={open} >
            <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{t("inventory_adjustment")}</DialogTitle>
            <DialogContent>
                <Grid container spacing={gridSpacing} sx={{ mt: 0 }}>
                    <Grid item md={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item md={3} xs={6}>
                                <ZTextWithTitle
                                    title={t("code")} titleToolTips={''}
                                    text={product?.code} textToolTips={''} />
                            </Grid>
                            <Grid item md={3} xs={6}>
                                <ZTextWithTitle
                                    title={t("name")} titleToolTips={''}
                                    text={product?.name} textToolTips={''} />
                            </Grid>
                            <Grid item md={6} xs={6}>
                                <ZTextWithTitle
                                    title={t("description")} titleToolTips={''}
                                    text={product?.description} textToolTips={''} />
                            </Grid>
                            <Grid item md={3} xs={6}>
                                <ZTextWithTitle
                                    title={t("category")} titleToolTips={''}
                                    text={product?.category} textToolTips={''} />
                            </Grid>
                            <Grid item md={3} xs={6}>
                                <ZTextWithTitle
                                    title={t("unitprice")} titleToolTips={''}
                                    text={product?.currency + ' ' + product?.unitprice} textToolTips={''} />
                            </Grid>
                            <Grid item md={3} xs={6}>
                                <ZTextWithTitle
                                    title={t("uom")} titleToolTips={''}
                                    text={product?.uom} textToolTips={''} />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label={t("movement")}
                                    name="movement"
                                    value={movement ?? ""}
                                    defaultValue={'IN'}
                                    onChange={(value) => { setMovement(value.target.value) }}>
                                    <MenuItem value={'IN'}>{t("in").toUpperCase()}</MenuItem>
                                    <MenuItem value={'OUT'}>{t("out").toUpperCase()}</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label={t("quantity")}
                                    value={quantity ?? ""}
                                    onChange={(value) => setQuantity(value.target.value)}
                                    inputProps={{ min: 0 }}
                                />
                                {error && <FormHelperText error>{error}</FormHelperText>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("remarks")}
                                    value={remarks ?? ""}
                                    onChange={(value) => setRemarks(value.target.value)}
                                    inputProps={{ maxLength: 200 }} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container justifyContent="space-between" alignItems="center" spacing={gridSpacing} sx={{ mb: 1 }}
                    flexDirection={{ xs: 'column', sm: 'row' }}>
                    <Grid item sx={{ order: { xs: 2, sm: 1 } }}></Grid>
                    <Grid item sx={{ order: { xs: 1, sm: 2 } }}>
                        <Grid container columnSpacing={1} >
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={handleClickOk}>{t("adjust")}</Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" color="primary" onClick={handleClickCancel}>{t("cancel")}</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>);
}

export default ZAdjustInventoryDialog;