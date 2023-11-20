import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// material-ui
// import { useTheme } from "@mui/material/styles";
import {
    Grid, Button, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';

import { IconPlus } from '@tabler/icons-react';
import { toast } from 'react-toastify';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ZBackdrop from 'ui-component/ZBackdrop';
import ZPaginationTable from 'ui-component/ZPaginationTable';
import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';
import { gridSpacing } from 'common/constant';
import { useAllUom, useCreateUom, useDeleteUom, useUpdateUom } from 'app/services/masters/UomService';
import ZTitleActionButton from 'ui-component/ZTitleActionButton';


// ==============================|| Uom ||============================== //
const UomPage = () => {
    // const theme = useTheme()
    const { t } = useTranslation();

    const [dataLoadingError, setDataLoadingError] = useState(null);
    const [data, setData] = useState(null);
    const [paging, setPaging] = useState();

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState(null);

    const [remove, setRemove] = useState(false);
    const [edit, setEdit] = useState(false);
    const [create, setCreate] = useState(false);

    const [id, setId] = useState(null);
    const [uom, setUom] = useState(null);
    const [description, setDescription] = useState(null);

    const { isFetching } = useAllUom(
        (response) => {
            if (response.code === "SUCCESS") {
                setData(response.data.data)
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

    const { mutate: deleteObj, isLoading: deleteLoading } = useDeleteUom(
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

    const { mutate: createObj, isLoading: createLoading } = useCreateUom(
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

    const { mutate: updateObj, isLoading: updateLoading } = useUpdateUom(
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
        setUom(e.uom)
        setDescription(e.description)

        setEdit(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        var obj = {
            id: id,
            description: description,
            uom: uom
        }

        if (create) {
            await createObj(obj)
            clearForm()
            setCreate(false)
        }

        if (edit) {
            await updateObj(obj)
            clearForm()
            setEdit(false)
        }
    }

    const clearForm = () => {
        setId(null);
        setUom(null);
        setDescription(null);
    }

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
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("uom")}
                                    value={uom ?? ""}
                                    onChange={(value) => setUom(value.target.value)}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("description")}
                                    value={description ?? ""}
                                    onChange={(value) => setDescription(value.target.value)}
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

            <MainCard contentSX={{ p: 2 }} title={t("manage_uom")} secondary={
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

export default UomPage;
