// material-ui
import { Button, Typography } from '@mui/material';

const ZTextLinkButton = ({ children, variant, align, color, onClick, select = false, noWrap }) => {
    return (
        select ?
            <Typography variant={variant} noWrap={noWrap} component={'span'} justifyContent={align} sx={{
                p: 0, textDecoration: 'none', color: color, '&:hover': {
                    textDecoration: "underline",
                    backgroundColor: 'white',
                    cursor: 'pointer'
                }
            }} onClick={onClick}>
                {children}
            </Typography>
            :

            // <Typography variant="body2" noWrap component={Button} justifyContent={'left'}
            //     sx={{
            //         p: 0, textDecoration: 'none', color: color, '&:hover': {
            //             textDecoration: "underline", backgroundColor: 'white'
            //         }
            //     }} onClick={onClick}>Edit</Typography>
            <Typography variant={variant} noWrap={noWrap} component={Button} justifyContent={align} sx={{
                p: 0, textDecoration: 'none', color: color, '&:hover': {
                    textDecoration: "underline",
                    backgroundColor: 'white',
                }
            }} onClick={onClick}>
                {children}
            </Typography>

    )
}

export default ZTextLinkButton;
