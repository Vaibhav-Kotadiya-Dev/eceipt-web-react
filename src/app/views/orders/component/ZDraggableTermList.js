import { useTheme } from "@mui/material/styles";
import { Grid, IconButton, ListItem, Typography } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { IconX } from '@tabler/icons-react';
import SubCard from 'ui-component/cards/SubCard';

const ZDraggableTermList = ({ items, onDragEnd, onRemove }) => {
    const theme = useTheme()
    return (
        <DragDropContext onDragEnd={onDragEnd} id={'drop-term'}>
            <Droppable droppableId="droppable-term-list" key={'term'} type={'term'}>
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
                                                <Grid container sx={{ pb: 1 }} >
                                                    <Grid item xs={12}>
                                                        <Grid container justifyContent="space-between" alignItems="" sx={{ mb: 0 }}
                                                            flexDirection={{ xs: 'column', sm: 'row' }}>
                                                            <Grid item sx={{ flex: 1 }}>
                                                                <Typography variant="h5">{item.type} </Typography>
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

export default ZDraggableTermList;