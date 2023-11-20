// material-ui
import { TextField, MenuItem } from '@mui/material';

const ZSelectUncontrolled = ({ label, value, onChange, option }) => {
    return (
        <TextField
            select
            fullWidth
            label={label}
            value={value ?? ""}
            defaultValue={value}
            onChange={onChange}>

            {(value && value.length > 0 && !(Object.values(option).filter((o) => o.v === value).length > 0)) &&
                <MenuItem key={value} value={value}>{value}</MenuItem>
            }

            {option && Object.values(option).map((o) => <MenuItem key={o.k} value={o.v}>{o.o}</MenuItem>)}
        </TextField>

    )
}

export default ZSelectUncontrolled;
