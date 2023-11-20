import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from "@mui/material/styles";

// material-ui
import {
    Alert,
    FormControlLabel,
    Grid,
    ImageList, ImageListItem,
    MenuItem,
    Radio,
    RadioGroup,
    // Switch,
    TextField,
    Typography
} from '@mui/material';
import { IconDeviceFloppy } from '@tabler/icons-react';
// project imports

import { gridSpacing } from 'common/constant';
import MainCard from 'ui-component/cards/MainCard';
import { useSaveSetting, useSetting } from 'app/services/SettingService';
import { toast } from 'react-toastify';
import SubCard from 'ui-component/cards/SubCard';
import ZTitleActionButton from 'ui-component/ZTitleActionButton';
import { Box } from '@mui/system';
import ZBackdrop from 'ui-component/ZBackdrop';
import { PDFFormats } from 'app/common/OrderConstant';
// import TenantService from 'aas/services/TenantService';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Settings = () => {
    const theme = useTheme()
    const { t } = useTranslation();

    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [id, setId] = useState(null);
    // const [viewClosedOrder, setViewClosedOrder] = useState(false);
    const [language, setLanguage] = useState('EN');

    const [invPrefix, setInvPrefix] = useState(null);
    const [invMid, setInvMid] = useState(null);
    const [doPrefix, setDoPrefix] = useState(null);
    const [doMid, setDoMid] = useState(null);
    const [pdfTemplate, setPdfTemplate] = useState("template_001");
    const [imagePath, setImagePath] = useState(require('assets/images/pdf/template_001.png'));

    const { isFetching } = useSetting(
        (response) => {
            if (response.code === "SUCCESS") {
                if (response.data != null) {
                    setId(response.data.id)
                    // setViewClosedOrder(response.data.viewClosedOrder)
                    setLanguage(response.data.language)
                    setInvPrefix(response.data.invNumberPrefix)
                    setInvMid(response.data.invNumberMid)
                    setDoPrefix(response.data.doNumberPrefix)
                    setDoMid(response.data.doNumberMid)
                    if (response.data.pdfTemplate) {
                        setPdfTemplate(response.data.pdfTemplate)
                    }
                }
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.message)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
        }
    )


    const { mutate: createObj, isLoading: createLoading } = useSaveSetting(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("saved"))
            } else {
                toast.error(response.data.message)
            }
        }, (error) => { toast.error(error.message) })


    const getMidStrSample = (mid) => {
        var currentDate = new Date();
        var year = currentDate.getFullYear(); //To get the Current Year

        var month = currentDate.getMonth() + 1; //To get the Current Month
        month = (month <= 9) ? '0' + month : month;

        switch (mid) {
            case "YY":
                return year.toString().substring(2, 4) + '-'
            case "YYMM":
                return year.toString().substring(2, 4) + month + '-'
            default:
                return '';
        }
    }

    const handleSave = async () => {
        console.log(pdfTemplate)
        var obj = {
            id: id,
            language: language,
            // viewClosedOrder: viewClosedOrder,
            description: null,
            doNumberPrefix: doPrefix,
            doNumberMid: doMid,
            invNumberPrefix: invPrefix,
            invNumberMid: invMid,
            pdfTemplate: pdfTemplate
        }
        await createObj(obj)
    }

    const handleRadioChange = (event) => {
        setPdfTemplate(event.target.value);
        setImagePath(require('assets/images/pdf/' + event.target.value + '.png'));
    };

    return (
        <>
            {(dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={isFetching || createLoading} />
            <MainCard contentSX={{}} title={t("settings")} secondary={
                <ZTitleActionButton onClick={() => handleSave()}>
                    <IconDeviceFloppy fontSize="inherit" stroke={1.5} size="1.5rem" />
                </ZTitleActionButton>}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <SubCard title={t("platform_setting")} sx={{ borderColor: theme.palette.grey[200] }} dividerSX={{ borderColor: theme.palette.grey[200] }}>
                            <Grid container spacing={gridSpacing}>
                                {/* <Grid item xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant='h4'> View Closed Order </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant='body1'><Switch checked={viewClosedOrder} onClick={e => setViewClosedOrder(!viewClosedOrder)} /> View Closed Order </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid> */}
                                <Grid item xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant='h4'>{t("settings")}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{ flexDirection: 'row' }}>
                                            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                                <TextField
                                                    sx={{ width: 150 }}
                                                    select
                                                    label="Language"
                                                    value={language ?? ""}
                                                    defaultValue={'EN'}
                                                    onChange={(e) => setLanguage(e.target.value)}>
                                                    <MenuItem key={'EN'} value={'EN'}>{t("english")}</MenuItem>
                                                    <MenuItem key={'CN'} value={'CN'}>{t("chinese")}</MenuItem>
                                                </TextField>
                                                <Typography sx={{ ml: 2 }} variant='body1'>{t("language_setting_message")} </Typography>
                                            </Box>

                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>

                    <Grid item xs={12}>
                        <SubCard title={t("order_setting")} sx={{ borderColor: theme.palette.grey[200] }} dividerSX={{ borderColor: theme.palette.grey[200] }}>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant='h4'> {t("invoice_order_format")}   <Typography variant='caption'> &nbsp; [{t("preview")}: <b>{invPrefix ? invPrefix + '-' : null}INV-{getMidStrSample(invMid)}00001</b>]</Typography></Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                                <TextField
                                                    label="Prefix"
                                                    value={invPrefix ?? ""}
                                                    onChange={(e) => setInvPrefix(e.target.value)}
                                                />
                                                <Typography variant='h4'> - INV - </Typography>
                                                <TextField
                                                    sx={{ width: 150 }}
                                                    select
                                                    label="Mid"
                                                    value={invMid ?? ""}
                                                    defaultValue={'YY'}
                                                    onChange={(e) => setInvMid(e.target.value)}>
                                                    <MenuItem key={''} value={''}>None</MenuItem>
                                                    <MenuItem key={'YY'} value={'YY'}>YY</MenuItem>
                                                    <MenuItem key={'YYMM'} value={'YYMM'}>YYMM</MenuItem>
                                                </TextField>
                                                <Typography variant='h4'> - [{t("sequence")}] </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant='h4'> {t("invoice_order_format")} {t("delivery_order_format")}    <Typography variant='caption'> &nbsp; [{t("preview")}: <b>{doPrefix ? doPrefix + '-' : null}DO-{getMidStrSample(doMid)}00001</b>]</Typography></Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                                <TextField
                                                    label="Prefix"
                                                    value={doPrefix ?? ""}
                                                    onChange={(e) => setDoPrefix(e.target.value)}
                                                />
                                                <Typography variant='h4'> - DO - </Typography>
                                                <TextField
                                                    sx={{ width: 150 }}
                                                    select
                                                    label="Mid"
                                                    value={doMid ?? ""}
                                                    defaultValue={'YY'}
                                                    onChange={(e) => setDoMid(e.target.value)}>
                                                    <MenuItem key={''} value={''}>{t("none")}</MenuItem>
                                                    <MenuItem key={'YY'} value={'YY'}>YY</MenuItem>
                                                    <MenuItem key={'YYMM'} value={'YYMM'}>YYMM</MenuItem>
                                                </TextField>
                                                <Typography variant='h4'> - [{t("sequence")}] </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant='h4'>{t("pdf_format")}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RadioGroup
                                                row
                                                onChange={handleRadioChange}
                                                // defaultValue={pdfTemplate}
                                                value={pdfTemplate ?? "template_001"}
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                name="radio-buttons-group">
                                                {PDFFormats.map((item) => (
                                                    <FormControlLabel key={item.name} value={item.value} control={<Radio />} label={t(item.name.toLowerCase())} />
                                                ))}
                                            </RadioGroup>
                                            <ImageList sx={{ width: 500, height: 450 }} variant="woven" cols={1} gap={1}>
                                                <ImageListItem>
                                                    <img
                                                        src={imagePath}
                                                        srcSet={imagePath}
                                                        alt={t("style_1")}
                                                        loading="lazy" />
                                                </ImageListItem>
                                            </ImageList>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>
                </Grid>
            </MainCard>

        </>

    );
};

export default Settings;
