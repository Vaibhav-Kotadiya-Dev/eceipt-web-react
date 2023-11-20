import React, { Component } from "react";

import { useTheme } from '@mui/material/styles';
import { Chip, ButtonBase, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableFooter } from '@mui/material';

import { IconPencil, IconEye, IconX } from '@tabler/icons-react';
import { StatusCode } from "common/constant";
import { translate } from "common/functions";

class BasicTableClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            rowsPerPage: this.props.rowsPerPage ?? 10,
            page: 0,
            data: null,
            keys: null
        };
    }

    componentDidMount() {
        if (this.props.data !== null && this.props.data.length > 0) {
            this.setState({
                data: this.props.data,
                keys: Object.keys(this.props.data[0]).map(i => i.toUpperCase())
            })
        }
    }

    componentDidUpdate() {
        if (this.state.page * this.state.rowsPerPage > this.props.data.length) {
            this.setState({ page: 0 })
            // console.log(this.state.page)
            // console.log(this.props.data.length)
        }
    }


    handleChangePage = (event, nr) => {
        this.setState({ page: nr })
    }

    handleClick = () => {
        // console.log('clicked')
        // console.log(this.state.keys)
    }

    render() {

        return this.props.data !== null && this.props.data.length > 0 ? (
            <Table className="mb-0" size={this.props.dense ? "small" : "medium"}>
                <TableHead>
                    <TableRow>
                        {Object.keys(this.props.data[0]).map(i => i).map(key => (<TableCell key={key}>{translate(key.toLowerCase()).toUpperCase()}</TableCell>))}
                        {(this.props.enableEdit || this.props.enableView || this.props.enableDelete) && (<TableCell key={'Action'}>{translate("action").toUpperCase()}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                        .map((element) => (
                            <TableRow key={element[Object.keys(element)[0]]}>
                                {Object.keys(element).map((key) => {
                                    if (key.toUpperCase() === 'STATUS') {
                                        var sel = Object.keys(StatusCode).filter((statuskey, value) => statuskey.toUpperCase() === element[key].toUpperCase())
                                        if (sel.length > 0) {
                                            return (<TableCell key={key}><Chip label={translate(element[key].toLowerCase()).toUpperCase()} color="primary" size="small" style={{ backgroundColor: StatusCode[sel[0]], color: 'white', padding: 0 }} /></TableCell>)
                                        } else {
                                            return (
                                                <TableCell key={key}>{translate(element[key].toLowerCase()).toUpperCase()}</TableCell>
                                            )
                                        }
                                    } else {
                                        return (
                                            <TableCell key={key}>{element[key] && element[key].toString()}</TableCell>
                                        )
                                    }
                                })}

                                {(this.props.enableEdit || this.props.enableView || this.props.enableDelete || this.props.enableCust) && (
                                    <TableCell>
                                        {this.props.enableView &&
                                            <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '5px', paddingRight: '5px' }}
                                                onClick={() => (this.props.onClickView(element))}>
                                                <IconEye stroke={1.5} size="1.5rem" color={this.props.theme.palette.primary.dark} />
                                            </ButtonBase>}
                                        {this.props.enableEdit &&
                                            <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '5px', paddingRight: '5px' }}
                                                onClick={() => (this.props.onClickEdit(element))}>
                                                <IconPencil stroke={1.5} size="1.5rem" color={this.props.theme.palette.primary.dark} />
                                            </ButtonBase>}
                                        {this.props.enableDelete &&
                                            <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '5px', paddingRight: '5px' }}
                                                onClick={() => (this.props.onClickDelete(element))}>
                                                <IconX stroke={1.5} size="1.5rem" color={this.props.theme.palette.error.dark} />
                                            </ButtonBase>}
                                        {this.props.enableCust &&
                                            <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '5px', paddingRight: '5px' }}
                                                onClick={() => (this.props.onClickCust(element))}>
                                                {this.props.custIcon}
                                            </ButtonBase>}
                                    </TableCell>)}


                            </TableRow>
                        ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            sx={{ border: 0 }}
                            rowsPerPageOptions={[-1]}
                            labelRowsPerPage={translate('rows_per_page')}
                            count={this.props.data.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onPageChange={(event, page) => this.handleChangePage(event, page)}
                            backIconButtonProps={{ color: "primary" }}
                            nextIconButtonProps={{ color: "primary" }} />
                    </TableRow>
                </TableFooter>
            </Table>
        ) : null
    }
}

export default function BasicTable({ ...rest }) {
    const theme = useTheme();
    return <BasicTableClass {...rest} theme={theme} />;
}











