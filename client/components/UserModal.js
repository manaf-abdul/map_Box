import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Switch } from 'antd';
import Axios from 'axios'
import { BASEURL } from '../constants';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function AlertDialog(props) {
    const router = useRouter()
    const { index } = router.query
    console.log("props",props.selected)

    const [values, setValues] = React.useState({
        firstName: "",
        lastName: "",
        designation: "",
        email: "",
        active: true,
        dateOfBirth: ""
    })
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const handleAddUser = async (e) => {
        try {
            if (props.selected) {
                const { data } = await Axios.post(`${BASEURL}/api/user/edit`, { ...values, _id: props?.selected?._id })
                toast.success("User Edited Succewssfully")
                props.setSelectedToNull()
            } else {
                const { data } = await Axios.post(`${BASEURL}/api/user/register`, { ...values })
                toast.success("User Created Succesfully")
                let res = await Axios.post(`${BASEURL}/api/company/add-or-remove-user`, { userId: data.user._id, companyId: index })
                toast.success("User Created And Added to Company")
                props.setSelectedToNull()
            }
            props.setRender(true)
            props.onClose()
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const onChange = (checked) => {
        setValues({ ...values, active: checked })
    };

    React.useEffect(() => {
        if (props?.selected) {
            console.log("props.selected.active",props.selected.active)
            setValues({
                ...values,
                firstName: props.selected.firstName,
                lastName: props.selected.lastName,
                email: props.selected.email,
                designation: props.selected.designation,
                dateOfBirth: props.selected.dateOfBirth,
                active: props.selected.active
            })
        } else {
            setValues({
                ...values,
                firstName: '',
                lastName: '',
                email: '',
                designation: '',
                dateOfBirth: '',
                active: true
            })
        }
        return () => {
            setValues({
                ...values,
                firstName: '',
                lastName: '',
                email: '',
                designation: '',
                dateOfBirth: '',
                active: true
            })
        }
    }, [props])

    return (
        <div>
            <Dialog
                {...props}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Add User
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description">
            Once you delete you can't recover the data
          </DialogContentText> */}
                    <div className="container pt-3">
                        <form>
                            <div className='pt-3 inputGroup'>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    className="form-control square"
                                    onChange={handleChange}
                                    value={values.firstName}
                                    placeholder="First Name"
                                    name="firstName"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className='pt-3 inputGroup'>
                                <label>lastName</label>
                                <input
                                    type="text"
                                    className="form-control square"
                                    onChange={handleChange}
                                    value={values.lastName}
                                    placeholder="Last Name"
                                    name="lastName"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className='pt-3 inputGroup'>
                                <label>Email</label>
                                <input
                                    type="text"
                                    className="form-control square"
                                    onChange={handleChange}
                                    value={values.email}
                                    placeholder="Email"
                                    name="email"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className='pt-3 inputGroup'>
                                <label>Designation</label>
                                <input
                                    type="text"
                                    className="form-control square"
                                    onChange={handleChange}
                                    value={values.designation}
                                    placeholder="Designation"
                                    name="designation"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className='pt-3 inputGroup'>
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    className="form-control square"
                                    onChange={handleChange}
                                    value={values.dateOfBirth}
                                    placeholder="Date-of-Birth"
                                    name="dateOfBirth"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className='pt-3 inputGroup'>
                                <label className='m-2'>active</label>
                                <Switch checked	={values.active} onChange={onChange} />
                            </div>
                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleAddUser}
                        className="col"
                        size="large"
                        type="primary"
                        shape="round"
                    >
                        {props && props.selected ? "Edit" : "Create"}
                    </Button>
                    <Button onClick={props.onClose} style={{ backgroundColor: "#e74c3c", color: "white" }} autoFocus>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
