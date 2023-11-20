// material-ui
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import { Typography, Tooltip, ListItemText } from '@mui/material';


const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} enterDelay={100} title={props.title ? props.title : ''} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 1.20)',
        boxShadow: theme.shadows[2],
        fontSize: 11,
    },
}));

const ZTextWithTitle = ({ title, titleToolTips, text, textToolTips }) => {
    if (title === undefined) {
        return (
            <LightTooltip title={textToolTips}>
                <Typography variant="h6" color="text.primary" >{text ? text : '-'}</Typography>
            </LightTooltip>
        )
    } else {
        return (
            <ListItemText sx={{ mb: 0 }}
                primary={<LightTooltip title={titleToolTips}><Typography variant="caption">{title}</Typography></LightTooltip>}
                secondary={<LightTooltip title={textToolTips}><Typography variant="h6" component="span">{text ? text : '-'}</Typography></LightTooltip>} />
        )
    }


}

export default ZTextWithTitle;
