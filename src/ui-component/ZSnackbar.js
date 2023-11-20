import React, { Component } from "react";
import { useTheme } from '@mui/material/styles';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

class ZSnackbarClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        // console.log('here')
        // console.log(this.props.open)
    }

    render() {
        return (
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={this.props.open} autoHideDuration={this.props.duration ? this.props.duration : 3000} onClose={this.props.onClose}>
                <this.props.Alert onClose={this.props.onClose} severity={this.props.color ?? "success"} sx={{ width: '100%' }}>
                    {this.props.msg}
                </this.props.Alert>
            </Snackbar>)
    }
}

export default function ZSnackbar({ ...rest }) {
    const theme = useTheme();
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return <ZSnackbarClass {...rest} theme={theme} Alert={Alert} />;
}








