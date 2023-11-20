import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
// material-ui
import { Grid, Button, Alert, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Divider } from '@mui/material';
// import { styled } from "@mui/material/styles";
import { gridSpacing } from 'common/constant';
import { gridSpacingSML } from 'common/constant';
import ZBackdrop from 'ui-component/ZBackdrop';
import MainCard from 'ui-component/cards/MainCard';
import BasicTable from 'ui-component/BasicTable';
import { IconSearch, IconPackage } from '@tabler/icons-react';
import { useAllTenantData, useChangeTenantPackage, useGetAllTenantsSubscription, useUpdateTenantInfo } from 'aas/services/TenantManagementService';
import { toast } from 'react-toastify';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { ConvertUTCDateToLocalSimpleDate } from 'common/functions';
// ==============================|| DEFAULT DASHBOARD ||============================== //


const Tenants = () => {
    const theme = useTheme();
    // const [isLoading, setLoading] = useState(false);
    const [tenantListOrg, setTenantListOrg] = useState(null);
    const [tenantList, setTenantList] = useState(null);
    const [searchValue, setSearchValue] = useState(null);

    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [edit, setEdit] = useState(false);
    const [tenantInfo, setTenantInfo] = useState({
        tenantCode: null,
        tenantName: null,
        description: null,
        email: null,
        representative: null,
        contactNumber: null,
        fax: null,
        // mainCurrency: "SGD",
        brn: null,
        addr1: null,
        addr2: null,
        addr3: null,
        addr4: null,
        country: null,
        postCode: null,
        owner: null,
        ownerFirstName: null,
        ownerLastName: null
    });

    const [changePkg, setChangePkg] = useState(false);
    const [changePkgTenantId, setChangePkgTenantId] = useState(null);
    const [currentTenantPkg, setCurrentTenantPkg] = useState('');
    const [changePkgExpireDate, setChangePkgExpireDate] = useState(dayjs(new Date().toLocaleDateString()));

    const { isLoading, isError: loadingError, error: loadingErrorMsg, refetch } = useAllTenantData(
        (response) => {
            if (response.code === "SUCCESS") {
                response.data.sort((obj1, obj2) => obj1.id > obj2.id ? 1 : -1)
                setTenantListOrg(response.data)
                setTenantList(response.data.map(t => {
                    return {
                        id: t.id,
                        tenantCode: t.tenantCode,
                        tenantName: t.tenantName,
                        description: t.description,
                        owner: t.owner,
                        subscription: t.subscription,
                        expire: t.expireDate === 0 ? '-' : ConvertUTCDateToLocalSimpleDate(t.expireDate)
                    }
                }))
                setDataLoadingError(null)

                var obj = response.data.map(t => {
                    return {
                        id: t.id,
                        tenantCode: t.tenantCode,
                        tenantName: t.tenantName,
                        description: t.description,
                        owner: t.owner,
                        subscription: t.subscription,
                        recurring: subData?.data.filter(o => o.tenantId = t.id)[0].recurringSubscriptionStatus.toUpperCase() ?? "",
                        expire: t.expireDate === 0 ? '-' : ConvertUTCDateToLocalSimpleDate(t.expireDate)
                    }
                })
                setTenantList(obj)
            } else {
                setDataLoadingError(response.data.message)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
        })

    const { data: subData } = useGetAllTenantsSubscription(
        (response) => { },
        (error) => { console.log(error) })

    const { mutate: updateTenantinfo, isLoading: updateLoading } = useUpdateTenantInfo(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('Service Updated.')
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const { mutate: changeTenantPackage, isLoading: updateChangePkg } = useChangeTenantPackage(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('Subscription Updated.')
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const handleSubmit = async (e) => {
        e.preventDefault();

        await updateTenantinfo(tenantInfo);
        setEdit(false)
        clearForm()
        refetch()
    }

    const handleClickEdit = (e) => {
        var selTenant = Object.values(tenantListOrg).find(t => t.id === e.id)
        setTenantInfo(selTenant)
        setEdit(true)
    }

    const handleChangePackage = async (e) => {
        // change packages
        e.preventDefault();

        // var selectedDate = new Date(changePkgExpireDate)
        // const tzoffset = selectedDate.getTimezoneOffset() * 60000

        // const convertedDate = new Date(selectedDate.getTime() + tzoffset)
        // console.log(selectedDate.getTime())



        await changeTenantPackage({
            tenantId: changePkgTenantId,
            packageCode: currentTenantPkg,
            expireDate: currentTenantPkg === 'FREE' ? 0 : new Date(changePkgExpireDate).getTime(),
        });
        setChangePkg(false)
        clearForm()
        refetch()
    }

    const handleClickCust = (e) => {
        // change packages
        var selTenant = Object.values(tenantListOrg).find(t => t.id === e.id)
        setChangePkgTenantId(selTenant.id)
        setCurrentTenantPkg(selTenant.subscription)
        setChangePkg(true)
    }

    const handleSearch = (val) => {
        setSearchValue(val)
        if (tenantListOrg !== null && tenantListOrg.length > 0) {
            setTenantList(tenantListOrg
                .filter(
                    e => e.tenantCode.toLowerCase().includes(val.toLowerCase()) ||
                        e.tenantName.toLowerCase().includes(val.toLowerCase()) ||
                        e.description.toLowerCase().includes(val.toLowerCase()) ||
                        e.owner.toLowerCase().includes(val.toLowerCase())
                )
                .map(t => {
                    return {
                        id: t.id,
                        tenantCode: t.tenantCode,
                        tenantName: t.tenantName,
                        description: t.description,
                        owner: t.owner,
                        subscription: t.subscription
                    }
                }))
        }
    };

    const clearForm = () => {
        setTenantInfo({
            tenantCode: null,
            tenantName: null,
            description: null,
            email: null,
            representative: null,
            contactNumber: null,
            fax: null,
            // mainCurrency: "SGD",
            brn: null,
            addr1: null,
            addr2: null,
            addr3: null,
            addr4: null,
            country: null,
            postCode: null,
            owner: null,
            ownerFirstName: null,
            ownerLastName: null
        });

    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTenantInfo({
            ...tenantInfo,
            [name]: value,
        });
    };

    return (<>
        {(loadingError || dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>Data failed to load. {dataLoadingError ?? ''} {loadingErrorMsg?.message ?? ''}</Alert>}
        <ZBackdrop open={isLoading || updateLoading || updateChangePkg} />
        <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="sm" open={changePkg} >
            <form onSubmit={handleChangePackage}>
                <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{"Change Tenant Package"}</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="currentTenantPkg"
                                    name="currentTenantPkg"
                                    value={currentTenantPkg ?? ""}
                                    defaultValue={'FREE'}
                                    onChange={(value) => { setCurrentTenantPkg(value.target.value) }}>
                                    <MenuItem value={'FREE'}>FREE</MenuItem>
                                    <MenuItem value={'BASIC'}>BASIC</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                {changePkgExpireDate && ConvertUTCDateToLocalSimpleDate(changePkgExpireDate)}
                            </Grid>

                            {currentTenantPkg !== 'FREE' &&
                                <Grid item xs={12}>
                                    <DatePicker
                                        sx={{ width: '100%' }}
                                        label="Expire Date"
                                        value={changePkgExpireDate}
                                        onChange={(value) => setChangePkgExpireDate(value)}
                                    />
                                </Grid>}
                        </Grid>
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" color="primary">{'Update'} </Button>
                    <Button variant="outlined" color="primary" onClick={() => {
                        setChangePkg(false)
                        setChangePkgTenantId(null)
                        setCurrentTenantPkg(null)
                    }}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>

        <Dialog aria-describedby="simple-modal-description" fullWidth maxWidth="md" open={edit} >
            <form onSubmit={handleSubmit}>
                <DialogTitle id="alert-dialog-title" sx={{ pb: 0, mb: 0 }}>{"Update Tenant Info"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={gridSpacing} sx={{ mt: 1 }}>
                        <Grid item lg={3} md={3} xs={6}>
                            <TextField
                                fullWidth
                                required
                                label="Company Code"
                                name="tenantCode"
                                value={tenantInfo.tenantCode ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item lg={3} md={3} xs={6}>
                            <TextField
                                fullWidth
                                required
                                label="Company Name"
                                name="tenantName"
                                value={tenantInfo.tenantName ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Representative"
                                name="representative"
                                value={tenantInfo.representative ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                label="Introduction"
                                name="description"
                                value={tenantInfo.description ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        {/* <Grid item lg={6} md={6} sm={6} xs={6}>
                            <TextField
                                select
                                fullWidth
                                label="Currency"
                                name="mainCurrency"
                                value={tenantInfo.mainCurrency ?? ""}
                                defaultValue={'API'}
                                onChange={handleInputChange}>
                                <MenuItem key={'SGD'} value={'SGD'}>SGD</MenuItem>
                                <MenuItem key={'USD'} value={'USD'}>USD</MenuItem>
                            </TextField>
                        </Grid> */}
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <TextField
                                fullWidth
                                required
                                label="Business Registration Number"
                                name="brn"
                                value={tenantInfo.brn ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item lg={4} md={4} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Contact Email"
                                name="email"
                                value={tenantInfo.email ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item lg={4} md={4} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Contact Number"
                                name="contactNumber"
                                value={tenantInfo.contactNumber ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item lg={4} md={4} xs={12}>
                            <TextField
                                fullWidth
                                label="Fax"
                                name="fax"
                                value={tenantInfo.fax ?? ""}
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
                                label="Address Line 1"
                                name="addr1"
                                value={tenantInfo.addr1 ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Address Line 2"
                                name="addr2"
                                value={tenantInfo.addr2 ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 3"
                                name="addr3"
                                value={tenantInfo.addr3 ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 4"
                                name="addr4"
                                value={tenantInfo.addr4 ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item lg={4} md={4} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Country"
                                name="country"
                                value={tenantInfo.country ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item lg={4} md={4} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Postcode"
                                name="postCode"
                                value={tenantInfo.postCode ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item lg={4} md={4} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Owner"
                                name="owner"
                                value={tenantInfo.owner ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item lg={4} md={4} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Owner First Name"
                                name="ownerFirstName"
                                value={tenantInfo.ownerFirstName ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item lg={4} md={4} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Owner Last Name"
                                name="ownerLastName"
                                value={tenantInfo.ownerLastName ?? ""}
                                onChange={handleInputChange}
                            />
                        </Grid>


                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" color="primary">{'Update'} </Button>
                    <Button variant="outlined" color="primary" onClick={() => {
                        setEdit(false)
                        clearForm()
                    }}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>

        <Grid container spacing={gridSpacingSML} direction="row" sx={{ backgroundColor: '' }}>
            <Grid item xs={12}>
                <MainCard noPadding contentSX={{ padding: 1 }} title="Tenant Management" secondary={<>
                    <TextField
                        id="input-with-icon-textfield"
                        InputProps={{ startAdornment: (<InputAdornment position="start"><IconSearch stroke={1.5} size="1rem" /></InputAdornment>), }}
                        variant="standard"
                        value={searchValue ?? ""}
                        onChange={(value) => { handleSearch(value.target.value) }}
                        sx={{ mr: 5, width: 300 }}
                    />

                    {/* <Button disableElevation type="submit" size="small" variant="contained" color="primary" onClick={() => setEdit(true)}> Create </Button> */}
                </>
                }>
                    {tenantList !== null ?
                        <BasicTable data={tenantList} enableEdit={true} onClickEdit={handleClickEdit} dense={false} rowsPerPage={10}
                            enableCust={true} onClickCust={handleClickCust} custIcon={<IconPackage stroke={1.5} size="1.5rem" color={theme.palette.grey.dark}
                            />}
                        />
                        : null}
                </MainCard>
            </Grid>
        </Grid>
    </>
    );
};

export default Tenants;
