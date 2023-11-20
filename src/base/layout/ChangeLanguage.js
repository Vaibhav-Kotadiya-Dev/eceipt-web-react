import { useState, useRef, useEffect } from 'react';
import { useTranslation } from "react-i18next";
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar, Box, ButtonBase, ClickAwayListener,
    List,
    ListItemButton,
    ListItemText,
    Paper, Popper, Typography, useMediaQuery
} from '@mui/material';


// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/common/Transitions';
import { LANGUAGE_LIST } from 'common/constant';
import { useUpdateUserLanguage, useUserLanguage } from 'aas/services/UserService';

// ==============================|| NOTIFICATION ||============================== //

const ChangeLanguage = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);

    const { i18n } = useTranslation();
    const [lang, setLang] = useState('en');
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    useUserLanguage(
        (response) => {
            if (response.code === "SUCCESS") {
                if (response.data != null) {
                    i18n.changeLanguage(response.data);
                    setLang(response.data)
                }
            }
        }, () => { })

    const { mutate: updateUserLanguage } = useUpdateUserLanguage(
        (response) => {
            if (response.data.code === "SUCCESS") {
                setLang(response.data.data)
            }
        }, (error) => { })

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setLang(lang)
        updateUserLanguage(lang)
        setOpen(false)
    };

    return (
        <>
            <Box sx={{ ml: 2, mr: 0, [theme.breakpoints.down('md')]: { mr: 2 } }}>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.primary.light,
                            color: theme.palette.primary.dark,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: theme.palette.primary.dark,
                                color: theme.palette.primary.light
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        color="inherit">
                        {lang && <Typography variant='body1'>{lang.toUpperCase()}</Typography>}
                    </Avatar>
                </ButtonBase>
            </Box>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? 5 : 0, 20] } }] }}>
                {({ TransitionProps }) => (
                    <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ paddingX: 1, paddingBottom: 0 }}>
                                        <List component="nav"
                                            sx={{

                                                backgroundColor: theme.palette.background.paper,
                                                borderRadius: '10px',
                                                [theme.breakpoints.down('md')]: {
                                                    minWidth: '100%'
                                                },
                                                '& .MuiListItemButton-root': { mt: 0.5 }
                                            }}>

                                            {Object.keys(LANGUAGE_LIST).map((k, v) => {
                                                return (
                                                    <ListItemButton dense key={k}
                                                        sx={{ borderRadius: `15px`, py: 1 }}
                                                        onClick={() => { changeLanguage(k) }}>
                                                        <ListItemText primary={<Typography variant="body2">{LANGUAGE_LIST[k]}</Typography>} />
                                                    </ListItemButton>)
                                            })}
                                        </List>
                                    </Box>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default ChangeLanguage;
