import React, { Component } from "react";

import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableFooter, ButtonBase } from '@mui/material';
import { IconPencil } from '@tabler/icons-react';
import { translate } from "common/functions";


class BasicTableSmallClass extends Component {
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
        // console.log(this.props.data)
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
            <Table className="mb-0" size={this.props.dense && "small"} sx={{ overflowX: 'auto' }}>
                <TableHead>
                    <TableRow>
                        {Object.keys(this.props.data[0]).map(i => i.toUpperCase()).map(key => {
                            if (!(this.props.hideId === true && key === 'ID')) {
                                return <SmallTableCell key={key}>{translate(key.toLowerCase()).toUpperCase()}</SmallTableCell>
                            } else {
                                return null
                            }
                        })}
                        {(this.props.enableEdit || this.props.enableView) && (<SmallTableCell key={'Action'}>{translate("action")}</SmallTableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                        .map((element, key) => {
                            // console.log(element)
                            return (<TableRow key={key}>
                                {Object.keys(element).map((keyD) => {
                                    if (!(this.props.hideId === true && keyD.toUpperCase() === 'ID')) {
                                        return <SmallTableCell key={keyD}>{element[keyD]}</SmallTableCell>
                                    } else {
                                        return null
                                    }
                                })}

                                {this.props.enableEdit && (<TableCell>
                                    <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '0px', paddingRight: '5px' }}
                                        onClick={() => (this.props.onClickEdit(element))}>
                                        <IconPencil stroke={1} size="1rem" color={this.props.theme.palette.primary.dark} />
                                    </ButtonBase>
                                </TableCell>)}

                            </TableRow>)
                        })}
                </TableBody>

                {!this.props.noPage &&

                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                sx={{
                                    ".MuiTablePagination-toolbar": {
                                        padding: 0
                                    },
                                    ".MuiTablePagination-displayedRows": {
                                        fontSize: 12,
                                    }
                                }}
                                rowsPerPageOptions={[-1]}
                                labelRowsPerPage={translate('rows_per_page')}
                                count={this.props.data.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onPageChange={(event, page) => this.handleChangePage(event, page)}
                                backIconButtonProps={{ color: "primary" }}
                                nextIconButtonProps={{ color: "primary" }} />
                        </TableRow>
                    </TableFooter>}
            </Table>
        ) : null
    }
}

const SmallTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        fontSize: 11,
        paddingLeft: 6,
        paddingRight: 2
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 11,
        paddingLeft: 6,
        paddingRight: 2
    },
}));

export default function BasicTableSmall({ ...rest }) {
    const theme = useTheme();



    return <BasicTableSmallClass {...rest} theme={theme} />;
}











