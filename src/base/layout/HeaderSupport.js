import { useState, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar, Box, ButtonBase, Tooltip, Grid, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormHelperText
} from '@mui/material';
import validator from 'validator';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';


// assets
import { IconMessageReport } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { gridSpacing } from 'common/constant';
import { useSendSupportEmail } from 'app/services/SupportService';
import { useTenantInfo } from 'aas/services/TenantAdminService';
import ZBackdrop from 'ui-component/ZBackdrop';

// ==============================|| HeaderSupport ||============================== //
const HeaderSupport = forwardRef(({ sx }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const [tenantName, setTenantName] = useState(null);
    const [email, setEmail] = useState(null);
    const [emailValid, setEmailValid] = useState(true);
    const [name, setName] = useState(null);
    const [contents, setContents] = useState('');
    const [contentsValid, setContentsValid] = useState(true);

    const modules = {
        toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ size: [] }],
            [{ align: ["right", "center", "justify"] }],
            [{ list: "bullet" }],
            ["link", "image"],
        ]
    };

    const formats = [
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "color",
        "image",
        "background",
        "align",
        "size",
        "font"
    ];
    useTenantInfo(
        (response) => {
            if (response.code === "SUCCESS") {
                setTenantName(response?.data?.tenantName)
            }
        }, () => { })

    const { mutate: sendSupportEmail, isLoading } = useSendSupportEmail(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("support_sent_message"))
            } else {
                toast.error(response.data.message)
            }
        }, (error) => { toast.error(error.message) })


    const handSubmitReport = async (e) => {
        e.preventDefault();

        if (!emailValid) {
            return
        }

        if (contents.length < 20) {
            setContentsValid(false)
            return
        }

        var data = {
            tenantName: tenantName,
            email: email,
            name: name,
            contents: contents
        }

        await sendSupportEmail(data)

        setOpen(false)
        clear()
    }

    const clear = async (e) => {
        setEmail(null)
        setName(null)
        setContents(null)
        setEmailValid(true)
        setContentsValid(true)
    }


    return (
        <>
            <ZBackdrop open={isLoading} />
            <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="md" open={open} >
                <form onSubmit={handSubmitReport}>
                    <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{t("support_request")}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("email")}
                                    value={email ?? ""}
                                    error={!emailValid}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setEmailValid(validator.isEmail(e.target.value))
                                    }}
                                    helperText={!emailValid ? t("invalid_email_format") : ''}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("name")}
                                    value={name ?? ""}
                                    onChange={(value) => setName(value.target.value)}
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <ReactQuill
                                    theme="snow"
                                    style={{ minHeight: '200px' }}
                                    modules={modules}
                                    formats={formats}
                                    value={contents}
                                    onChange={setContents}

                                />
                                {!contentsValid && <FormHelperText error>{t("more_contents_error")}</FormHelperText>}
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
                                        <Button type="submit" variant="contained" color="primary">{t("send")}</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="outlined" color="primary" onClick={() => {
                                            setOpen(false)
                                        }}>{t("cancel")}</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </form>
            </Dialog>
            <Box sx={{ [theme.breakpoints.down('md')]: { mr: 2 }, ...sx, }}>
                <Tooltip title={t("support_request")} placement='bottom'>
                    <ButtonBase sx={{ borderRadius: '12px' }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.background.default,
                                color: theme.palette.error.light,
                                '&[aria-controls="menu-list-grow"],&:hover': {
                                    background: theme.palette.warning.dark,
                                    color: theme.palette.primary.light
                                }
                            }}
                            onClick={() => setOpen(true)}
                            color="inherit">
                            <IconMessageReport stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ButtonBase>
                </Tooltip>
            </Box>
        </>
    );
});

export default HeaderSupport;
