// material-ui
import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ZTitleActionButton = ({ children, onClick, disabled }) => {
    const theme = useTheme()
    return (
        <IconButton size="small" onClick={onClick} disabled={disabled}
            sx={{
                transition: 'all .2s ease-in-out',
                color: theme.palette.primary.dark,
                '&[aria-controls="menu-list-grow"],&:hover': {
                    background: theme.palette.primary.dark,
                    color: theme.palette.primary.light
                }
            }}>
            {children}
        </IconButton>
    )
}

export default ZTitleActionButton;
