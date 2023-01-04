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
    const [companies, setCompanies] = React.useState([])
    const [company, setCompany] = React.useState('')

    const migrateHandler = async () => {
        try {
            const { data } = await Axios.post(`${BASEURL}/api/company/migrate`, { fromCompanyId: index, userId: props?.selected?._id, toCompanyId: company })
            props.setRender(true)
            props.onClose()
        } catch (error) {
            toast.error(error.message)
        }
    };

    const getData = async () => {
        try {
            const { data } = await Axios.get(`${BASEURL}/api/company`)
            console.log(data)
            setCompanies(data)
        } catch (error) {
            toast.error(error.message)
        }
    }

    React.useEffect(() => {
        getData()
    }, [props])

    return (
        <div>
            <Dialog
                {...props}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Transfer User
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description">
            Once you delete you can't recover the data
          </DialogContentText> */}
                    <div className="container pt-1">
                        <p>Confirm the transfer of User : <b>{props?.selected?.firstName}</b></p>
                        <div className='pt-1 inputGroup'>
                            <label>Select a Company</label>
                            <select
                                name="cars"
                                id="cars"
                                form="carform"
                                className='select-control form-control'
                                onChange={(e) => setCompany(e.target.value)}
                            >
                                <option selected>Choose the company</option>
                                {companies && companies.length > 1 && companies.map(company => {
                                    return (
                                        <option value={company._id}>{company.name}</option>
                                    )
                                })
                                }
                            </select>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    {/* <Button
                        onClick={handleAddUser}
                        className="col"
                        size="large"
                        type="primary"
                        shape="round"
                    >
                        Transfer
                    </Button> */}
                    <button className="btn btn-block btn-primary"
                        disabled={!company || company == "Choose the company"}
                        onClick={migrateHandler}>
                        Migrate
                    </button>
                    <Button onClick={props.onClose} style={{ backgroundColor: "#e74c3c", color: "white" }} autoFocus>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
