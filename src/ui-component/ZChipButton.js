// material-ui
import { Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ZChipButton = ({ label, onClick, icon }) => {
    const theme = useTheme()
    return (
        <Chip label={label}
            sx={{
                backgroundColor: 'transparent',
                '&:hover': {
                    background: theme.palette.primary.dark,
                    color: 'white',
                    "& .MuiChip-icon": {
                        color: 'white',
                    }
                },
            }}
            onClick={onClick}
            icon={icon} />
    )
}

export default ZChipButton;
