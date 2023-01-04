
import { useEffect, useState } from 'react'
import Axios from 'axios'
import { toast } from 'react-toastify'
import { BASEURL } from '../constants'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons'

import Box from '@mui/material/Box';
import * as React from 'react';
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
import ConfirmationModal from '../components/ConfirmationModal'
import Link from 'next/link'

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

let TOKEN = "pk.eyJ1IjoiNzQ4NSIsImEiOiJjbDFua3kwcHIwMDE1M2luMXhleDNqMGZiIn0.Mj40f5LXER6tUfR3ygQLaA"

export default function Home() {
  const [companies, setCompanies] = useState([])
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(0);
  const [selected, setSelected] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [render, setRender] = React.useState(false);
  const [places, setPlaces] = React.useState([]);
  const [selectedPlace, setSelectedPlace] = React.useState();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [values, setValues] = useState({
    name: "",
    address: "",
    location: "",
  })

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selected) {
        const { data } = await Axios.post(`${BASEURL}/api/company/edit`, { ...values, _id: selected,location:selectedPlace?selectedPlace:values.location})
        toast.success('Data Editted Successfully')
      } else {
        const { data } = await Axios.post(`${BASEURL}/api/company/register`, { ...values,location:selectedPlace  })
        toast.success('Data Submitted Successfully')
      }
      setLoading(false)
      setRender(true)
      setPlaces()
      setSelectedPlace()
      setValues({
        ...values,
        name: '',
        location: '',
        address: ''
      })
      setSelected()
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const fetchData = async () => {
    try {
      const { data } = await Axios.get(`${BASEURL}/api/company`)
      console.log("data", data)
      setCompanies(data)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const handleLocation = async () => {
    console.log("in")
    try {
      const { data } = await Axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${values.location}.json?access_token=${TOKEN}`)
      console.log("data", data)
      setPlaces(data.features)
    } catch (error) {
      console.log(error)
      return res.status(400).send(error.message)
    }
  }

  useEffect(() => {
    if (render) setRender(false)
    fetchData()
  }, [render])

  const handleClose = () => {
    setOpen(false);
    if (selected) setSelected()
  };

  const modalShow = async (row) => {
    setOpen(true)
    setSelected(row._id)
  }

  const deleteHandler = async () => {
    try {
      const { data } = await Axios.delete(`${BASEURL}/api/company/${selected}`)
      toast.success('Data Deleted Successfully')
      setOpen(false);
      setRender(true)
      setValues({
        ...values,
        name: '',
        address: '',
        location: ''
      })
      setSelected()
    } catch (error) {
      toast.error(error.message)
      setOpen(false);
    }
  };

  const editHandler = (row) => {
    setSelected(row._id)
    setValues({
      ...values,
      name: row.name,
      location: row.location.name,
      address: row.address
    })
  }

  const cancelHandler = () => {
    setSelected()
    setValues({
      ...values,
      name: '',
      address: '',
      location: ''
    })
  }

  return (
    <>
      <ConfirmationModal
        open={open}
        onClose={handleClose}
        deleteHandler={deleteHandler}
      />
      <h1 className='jumbotron square text-center'>COMPANIES</h1>
      <div className='container'>
        <h1 className='text-center p-1'>Create Company</h1>
        <div className='container fluid col-md-12 col-lg-12 pb-2'>
          <form onSubmit={handleSubmit}>
            <div className='row pt-0'>
              <div className='col-md-12 col-lg-6 pb-2'>
                <label>Name</label>
                <input type="text"
                  placeholder="Enter Name"
                  className="form-control mb-3 p-4"
                  value={values.name}
                  name="name"
                  onChange={handleChange}
                  required
                />
                <label>Address</label>
                <input type="text"
                  placeholder="Enter Location"
                  className="form-control mb-3 p-4"
                  value={values.address}
                  name="address"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className=' col-md-12 col-lg-6 pb-2'>

                <label>Location</label>
                <input type="text"
                  placeholder="Enter Address"
                  className="form-control mb-3 p-4"
                  value={values.location}
                  name="location"
                  onBlur={() => handleLocation()}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      console.log("out")
                      handleLocation()
                    }
                  }}
                  onChange={handleChange}
                  required
                />
                {selectedPlace && <label style={{color:"green"}}>Selected Location : {selectedPlace?.place_name}</label>}
                {
                  places && places.length > 0 &&
                  <>
                    <p style={{ color: "red" }}>Select a location from the options</p>
                    {places.map(place => {
                      return (
                        <p style={{ cursor: "pointer" }} onClick={(e) => setSelectedPlace(place)}>{place.place_name}</p>
                      )
                    })}
                  </>
                }
              </div>
            </div>
            <div className=' col-md-12 col-lg-12'>

              <div className='row d-flex justify-content-center'>
                <div className='col-md-12 col-lg-5 m-1'>
                  <button className="btn btn-block btn-primary"
                    disabled={!values.name || !values.address || !values.location || loading || (!selectedPlace && !selected)}
                    type="submit">
                    {loading ? <SyncOutlined spin /> : selected ? "Edit" : "Submit"}
                  </button>
                </div>

                {
                  selected ?
                    <div className='col-md-12 col-lg-5 m-1'>
                      <button className="btn btn-block btn-dark" onClick={cancelHandler}>
                        Cancel
                      </button>
                    </div>
                    : ""
                }
              </div>
            </div>
          </form>
        </div>
        <div className='pt-3 pb-5'>
          <h1 className='text-center p-3'>Companies</h1>
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Name</StyledTableCell>
                      <StyledTableCell align="center">Address</StyledTableCell>
                      <StyledTableCell align="center">Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companies?.map((row) => (

                      <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row" align='center'>
                          <Link href={`/companies/${row._id}`}>{row.name}</Link>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Link href={`/companies/${row._id}`}>
                            {row.address}
                          </Link>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Button onClick={() => editHandler(row)}><FontAwesomeIcon icon={faPen} /></Button>
                          <Button onClick={() => modalShow(row)}><FontAwesomeIcon icon={faTrash} /></Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={companies.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </div>
      </div>
    </>
  )
}
