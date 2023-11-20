import { useTranslation } from 'react-i18next';

import { useTheme } from "@mui/material/styles";
import { Grid, IconButton, InputAdornment, ListItem, TextField, Typography } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { IconX } from '@tabler/icons-react';
import SubCard from 'ui-component/cards/SubCard';

const ZDraggableInvoiceProductList = ({ items, onDragEnd, onChange, onRemove }) => {
    const theme = useTheme()
    const { t } = useTranslation();

    return (
        <DragDropContext onDragEnd={onDragEnd} id={'drop-product'}>
            <Droppable droppableId="droppable-product-list" key={'product'} type={'product'}>
                {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {items.map((item, index) => (
                            <Draggable key={item.key} draggableId={item.key + ''} index={index}>
                                {(provided, snapshot) => (
                                    <ListItem
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}

                                        sx={{ px: 0, py: 0.5 }}>
                                        <Grid item xs={12}>
                                            <SubCard noPadding contentSX={{ background: snapshot.isDragging ? theme.palette.primary.light : '', p: 1.5 }}>
                                                <Grid container sx={{ p: 0 }} >
                                                    <Grid item xs={12}>
                                                        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 0 }}
                                                            flexDirection={{ xs: 'column', sm: 'row' }}>
                                                            <Grid item sx={{ flex: 1 }}>
                                                                <Typography variant="h5">{item.name} <Typography variant='caption'>{item.code}</Typography></Typography>
                                                                <Typography variant="caption">{item.description} </Typography>
                                                            </Grid>
                                                            <Grid item >
                                                                <IconButton size="small" onClick={() => onRemove(item.id)}
                                                                    sx={{
                                                                        transition: 'all .2s ease-in-out',
                                                                        color: theme.palette.error.dark,
                                                                        '&[aria-controls="menu-list-grow"],&:hover': {
                                                                            background: theme.palette.error.light,
                                                                            color: theme.palette.error.dark
                                                                        }
                                                                    }}>
                                                                    <IconX stroke={1.5} size="1.5rem" color={theme.palette.error.dark} />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 0 }}
                                                            flexDirection={{ xs: 'column', sm: 'row' }}>
                                                            <Grid item md={3} xs={12} sx={{ pr: 2 }}>
                                                                <TextField
                                                                    fullWidth
                                                                    variant='outlined'
                                                                    size='small'
                                                                    name={t("quantity")}
                                                                    type="number"
                                                                    InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">{item.uom}</Typography></InputAdornment> }}
                                                                    value={item.quantity ?? 0}
                                                                    onChange={(e) => onChange(item.key, e.target.name, e.target.value * 1)}
                                                                />
                                                            </Grid>
                                                            <Grid item md={4} xs={12} sx={{ pr: 2 }}>
                                                                <TextField
                                                                    fullWidth
                                                                    variant="standard"
                                                                    name={t("unitprice")}
                                                                    type="number"
                                                                    InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">{item.currency}/{item.uom}</Typography></InputAdornment>, }}
                                                                    value={item.unitprice}
                                                                    onChange={(e) => onChange(item.key, e.target.name, e.target.value * 1)}
                                                                />
                                                            </Grid>
                                                            <Grid item md={4} xs={12} sx={{ pr: 2 }}>
                                                                <TextField
                                                                    fullWidth
                                                                    variant="standard"
                                                                    InputProps={{
                                                                        endAdornment: <InputAdornment position="end"><Typography variant="caption">{item.currency}/Total</Typography></InputAdornment>, readOnly: true,
                                                                    }}
                                                                    value={item.unitprice * (item.quantity ?? 0)}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} sx={{ pb: 1 }}>
                                                        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 0 }}
                                                            flexDirection={{ xs: 'column', sm: 'row' }}>
                                                            <Grid item>
                                                                <Typography variant="h5">{t("remarks") + ':'}  &nbsp;</Typography>
                                                            </Grid>
                                                            <Grid item sx={{ flex: 1 }}>
                                                                <TextField fullWidth variant="standard" name={t("remarks")} value={item.remark ?? ''}
                                                                    onChange={(e) => onChange(item.key, e.target.name, e.target.value)} />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </SubCard>
                                        </Grid>
                                    </ListItem>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default ZDraggableInvoiceProductList;