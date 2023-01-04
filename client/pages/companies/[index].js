import Axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { BASEURL } from '../../constants';
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import mapboxgl from '!mapbox-gl'
mapboxgl.accessToken = 'pk.eyJ1IjoiNzQ4NSIsImEiOiJjbDFua3kwcHIwMDE1M2luMXhleDNqMGZiIn0.Mj40f5LXER6tUfR3ygQLaA';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash, faUserXmark, faRightLeft, faUserLock, faUserCircle } from '@fortawesome/free-solid-svg-icons'

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { Button } from '@material-ui/core'
import ConfirmationModal from '../../components/ConfirmationModal'
import Link from 'next/link'

import UserModal from '../../components/UserModal'
import TransferModal from '../../components/Transfer.modal'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1a6aff",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const Company = ({ data }) => {
    const router = useRouter()
    const { index } = router.query

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [zoom, setZoom] = useState(10);
    const [company, setCompany] = useState(10);
    const [modal, setModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [selected, setSelected] = useState({});
    const [render, setRender] = useState(false);
    const [transferModal, setTransferModal] = useState(false);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const showModal = (event, newPage) => {
        setModal(true);
    };

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [data.location.lat, data.location.long],
            zoom: zoom
        });
    }, [])

    const getData = async () => {
        try {
            const { data } = await Axios.get(`${BASEURL}/api/company/${index}`)
            setCompany(data)
            console.log(data)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const editHandler = (row) => {
        console.log("row", row)
        setSelected(row)
        setModal(true)
    }
    const deleteModalShow = (row) => {
        setSelected(row)
        setConfirmModal(true)
    }

    useEffect(() => {
        if (render) setRender(false)
        if (selected) setSelected()
        getData()
    }, [index, render])

    const handleClose = () => {
        if (modal) setModal(false);
        if (confirmModal) setConfirmModal(false)
        if (transferModal) setTransferModal(false)
        if (selected) setSelected()
    };

    const removeFromCompany = async (row) => {
        try {
            let res = await Axios.post(`${BASEURL}/api/company/add-or-remove-user`, { userId: row._id, companyId: index })
            toast.success("User Removed From Company")
            setRender(true)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteHandler = async (row) => {
        try {
            const { data } = await Axios.delete(`${BASEURL}/api/user/${selected._id}`)
            toast.success('Data Deleted Successfully')
            setConfirmModal(false)
            setSelected()
            setRender(true)
        } catch (error) {
            toast.error(error.message)
            setConfirmModal(false)
        }
    };

    const transferHandler = (row) => {
        setSelected(row)
        setTransferModal(true)
    };
    const setSelectedToNull = (row) => {
        setSelected()
    };

    const blockHandler = async(row) => {
        try {
            let res = await Axios.post(`${BASEURL}/api/user/status`, { _id: row._id })
            toast.success("User Status Changed Successfully")
            setRender(true)
        } catch (error) {
            toast.error(error.message)
        }
    };

    return (
        <div>
            <UserModal
                open={modal}
                onClose={handleClose}
                selected={selected}
                setRender={setRender}
                setSelectedToNull={setSelectedToNull}
            />
            <TransferModal
                open={transferModal}
                onClose={handleClose}
                selected={selected}
                setRender={setRender}
            />
            <ConfirmationModal
                open={confirmModal}
                onClose={handleClose}
                deleteHandler={deleteHandler}
            />
            <h1 className='jumbotron square text-center'>{company?.name}</h1>
            <div className='container'>
                <div className='container'>
                    <div className='pb-5'>
                        <div ref={mapContainer} className="map-container" />
                    </div>
                    <div className='pt-4'>
                        <h1 className='text-center'>Welcome to {company?.name}</h1>
                    </div>
                    <div className='pt-1'>
                        <h2>Address : {data.address}</h2>
                    </div>
                    <div className='pb-5'>
                        {company && company.users?.length > 0 ? <Box sx={{ width: '100%' }}>
                            <Paper sx={{ width: '100%', mb: 2 }}>
                                <TableContainer component={Paper}>

                                    <Table sx={{ minWidth: 700 }} aria-label="customized table">

                                        <TableHead>

                                            <Button className='primary' onClick={showModal}>Add User</Button>
                                            <TableRow>
                                                <StyledTableCell align="center">First Name</StyledTableCell>
                                                <StyledTableCell align="center">Last Name</StyledTableCell>
                                                <StyledTableCell align="center">Email</StyledTableCell>
                                                <StyledTableCell align="center">Designation</StyledTableCell>
                                                <StyledTableCell align="center">Date Of Birth</StyledTableCell>
                                                <StyledTableCell align="center">Active</StyledTableCell>
                                                <StyledTableCell align="center">Actions</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {company.users?.map((row) => (
                                                <StyledTableRow key={row.name}>
                                                    <StyledTableCell component="th" scope="row" align='center'>
                                                        <Link href={`/companies/${row._id}`}>{row.firstName}</Link>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Link href={`/companies/${row._id}`}>
                                                            {row.lastName}
                                                        </Link>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {row.email}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {row.designation}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {row.dateOfBirth}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Button onClick={() => blockHandler(row)}>
                                                            <FontAwesomeIcon icon={row.active ? faUserLock : faUserCircle} />
                                                            {row.active ? "Deactivate" : "Activate"}
                                                        </Button>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Button onClick={() => editHandler(row)}><FontAwesomeIcon icon={faPen} /></Button>
                                                        <Button onClick={() => removeFromCompany(row)}><FontAwesomeIcon icon={faUserXmark} /></Button>
                                                        <Button onClick={() => transferHandler(row)}><FontAwesomeIcon icon={faRightLeft} /></Button>
                                                        <Button onClick={() => deleteModalShow(row)}><FontAwesomeIcon icon={faTrash} /></Button>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={company.users?.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Box>
                            :
                            <button className="btn btn-block btn-primary"
                                onClick={showModal}>
                                Add User
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Company

export async function getServerSideProps(context) {
    const id = context.query.index;
    const { data } = await Axios.get(`${BASEURL}/api/company/${id}`)
    // const data = await res.json()

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            data: data
        },
    }
}