import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import validator from 'validator';
// material-ui
// import { useTheme } from "@mui/material/styles";
import {
    Grid, Button, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Divider,
    MenuItem
} from '@mui/material';

import { IconPlus } from '@tabler/icons-react';
import { toast } from 'react-toastify';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ZBackdrop from 'ui-component/ZBackdrop';
import ZPaginationTable from 'ui-component/ZPaginationTable';
import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';
import { COUNTRY_LIST, gridSpacing } from 'common/constant';
import { useAllClient, useCreateClient, useDeleteClient, useUpdateClient } from 'app/services/masters/ClientService';
import ZTitleActionButton from 'ui-component/ZTitleActionButton';


// ==============================|| Client ||============================== //
const ClientPage = () => {
    // const theme = useTheme()
    const { t } = useTranslation();

    const [dataLoadingError, setDataLoadingError] = useState(null);
    const [data, setData] = useState(null);
    const [dataOrg, setDataOrg] = useState(null);
    const [paging, setPaging] = useState();

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState(null);

    const [remove, setRemove] = useState(false);
    const [edit, setEdit] = useState(false);
    const [create, setCreate] = useState(false);

    const [emailValid, setEmailValid] = useState(true);
    const [id, setId] = useState(null);
    const [clientInfo, setClientInfo] = useState({
        id: null,
        shortname: null,
        name: null,
        description: null,
        addr1: null,
        addr2: null,
        addr3: null,
        addr4: null,
        country: 'US',
        postCode: null,
        representative: null,
        contactNumber: null,
        fax: null,
        email: null,
        remark: null
    });

    const { isFetching } = useAllClient(
        (response) => {
            if (response.code === "SUCCESS") {
                setDataOrg(response.data.data)

                var lst = Object.values(response.data.data).map(e => {
                    return {
                        id: e.id,
                        shortname: e.shortname,
                        name: e.name,
                        description: e.description,
                        country: e.country,
                    }
                })

                setData(lst)
                setPaging(response.data.page)
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.message)
                setData(null)
                setPaging(null)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
            setData(null)
            setPaging(null)
        },
        page, pageSize, sortBy
    )

    const { mutate: deleteObj, isLoading: deleteLoading } = useDeleteClient(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("record_deleted"))
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: createObj, isLoading: createLoading } = useCreateClient(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("record_created"))
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: updateObj, isLoading: updateLoading } = useUpdateClient(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("record_updated"))
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const handleChangePageSize = (e) => {
        setPageSize(parseInt(e.target.value, 10))
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    };

    const handleSort = (property, order) => {
        setSortBy(property.toLowerCase() + "," + order)
    };

    const handleRemove = async () => {
        await deleteObj(id)
        setRemove(false)
        setEdit(false)
        clearForm()
    }

    const handleOnClickEdit = async (e) => {
        setId(e.id)
        var obj = Object.values(dataOrg).filter(el => el.id === e.id)[0]
        setClientInfo(obj)
        setEdit(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (create) {
            await createObj(clientInfo)
            clearForm()
            setCreate(false)
        }

        if (edit) {
            await updateObj(clientInfo)
            clearForm()
            setEdit(false)
        }
    }

    const clearForm = () => {
        setId(null);
        setClientInfo({
            id: null,
            shortname: null,
            name: null,
            description: null,
            addr1: null,
            addr2: null,
            addr3: null,
            addr4: null,
            country: "US",
            postCode: null,
            representative: null,
            contactNumber: null,
            fax: null,
            email: null,
            remark: null
        });

    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClientInfo({
            ...clientInfo,
            [name]: value,
        });
    };


    return (
        <>
            {(dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={isFetching || createLoading || updateLoading || deleteLoading} />

            <ZPromptConfirmation open={remove}
                fullWidth
                title={t("please_confirm")}
                text={t("record_delete_message")}
                deleteButtonText={t("delete")}
                enableCancel={true}
                onClickDelete={handleRemove}
                onClickCancel={() => { setRemove(false) }}
            />

            <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="sm" open={edit || create} >
                <form onSubmit={handleSubmit}>
                    <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{create ? t("create") : t("update")}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                            {edit &&
                                <Grid item md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        disabled
                                        required
                                        label={t("id")}
                                        value={id ?? ""}
                                        onChange={(value) => setId(value.target.value)}
                                    />
                                </Grid>}
                            <Grid item lg={6} md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("client_Name")}
                                    name="name"
                                    value={clientInfo.name ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("client_short_Name")}
                                    name="shortname"
                                    value={clientInfo.shortname ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    label={t("company_introduction")}
                                    name="description"
                                    value={clientInfo.description ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            <Grid item lg={12} md={12} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("address_line_1")}
                                    name="addr1"
                                    value={clientInfo.addr1 ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item lg={12} md={12} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("address_line_2")}
                                    name="addr2"
                                    value={clientInfo.addr2 ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    label={t("address_line_3")}
                                    name="addr3"
                                    value={clientInfo.addr3 ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    label={t("address_line_4")}
                                    name="addr4"
                                    value={clientInfo.addr4 ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    name="country"
                                    label={t("country")}
                                    value={clientInfo.country ?? ""}
                                    defaultValue={'US'}
                                    onChange={handleInputChange}>
                                    {Object.keys(COUNTRY_LIST).map((k, v) => <MenuItem key={k} value={k}>{k} - {COUNTRY_LIST[k]}</MenuItem>)}
                                </TextField>
                            </Grid>

                            <Grid item lg={6} md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("postcode")}
                                    name="postCode"
                                    value={clientInfo.postCode ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            <Grid item lg={6} md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("representative")}
                                    name="representative"
                                    value={clientInfo.representative ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>



                            <Grid item lg={6} md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("contact_email")}
                                    name="email"
                                    error={!emailValid}
                                    value={clientInfo.email ?? ""}
                                    onChange={(e) => {
                                        handleInputChange(e)
                                        setEmailValid(validator.isEmail(e.target.value))
                                    }}
                                    helperText={!emailValid ? 'Invalid Email Format.' : ''}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("contact_number")}
                                    name="contactNumber"
                                    value={clientInfo.contactNumber ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    label={t("fax")}
                                    name="fax"
                                    value={clientInfo.fax ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    label={t("remarks")}
                                    name="remark"
                                    multiline
                                    rows={2}
                                    value={clientInfo.remark ?? ""}
                                    onChange={handleInputChange}
                                />
                            </Grid>


                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Grid container justifyContent="space-between" alignItems="center" spacing={gridSpacing} sx={{ mb: 1 }}
                            flexDirection={{ xs: 'column', sm: 'row' }}>

                            <Grid item sx={{ order: { xs: 2, sm: 1 } }}>
                                {edit &&
                                    <Button variant="contained" color="error" onClick={() => { setRemove(true) }}>{t("delete")}</Button>}
                            </Grid>
                            <Grid item sx={{ order: { xs: 1, sm: 2 } }}>
                                <Grid container columnSpacing={1} >
                                    <Grid item>
                                        <Button type="submit" variant="contained" color="primary">{create ? t("create") : t("update")} </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="outlined" color="primary" onClick={() => {
                                            setEdit(false)
                                            setCreate(false)
                                            clearForm()
                                        }}>{t("cancel")}</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </form>
            </Dialog>

            <MainCard contentSX={{ p: 2 }} title={t("manage_client")} secondary={
                <ZTitleActionButton onClick={() => setCreate(true)}>
                    <IconPlus fontSize="inherit" stroke={1.5} size="1.5rem" />
                </ZTitleActionButton>}>
                <Grid container spacing={gridSpacing} justifyContent='center'>
                    <Grid item sx={{ width: '100%' }}>
                        {data &&
                            <ZPaginationTable
                                data={data}
                                paging={paging}
                                enableEdit={true}
                                onPageSizeChange={handleChangePageSize}
                                onPageChange={handleChangePage}
                                onSort={handleSort}
                                onClickEdit={handleOnClickEdit}
                            />}
                    </Grid>
                </Grid>
            </MainCard >

        </>
    );
};

export default ClientPage;
