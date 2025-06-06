import React, {useState, useEffect} from 'react'
import './devices.css'
import API from '../../util/Api'
import {decodeLicenseCodeWithToken} from '../../util/DecodeLicense'
import Swal from 'sweetalert2'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import {toast, Bounce} from 'react-toastify'
// import HashLoader from "react-spinners/HashLoader"

const Devices = () => {
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  let [search, setSearch] = useState('');
  let [devicesData, setDevicesData] = useState([]);
  let [license, setLicense] = useState([]);
  let [currentPage, setCurrentPage] = useState(1);
  let itemsPerPage = 10;
  // const [loading, setLoading] = useState(false);

  let filteredData = devicesData.filter(data => data?.deviceName?.toLowerCase().includes(search.toLowerCase()) || data?.macAddress?.toLowerCase().includes(search.toLowerCase()) || data?.ipAddress?.toLowerCase().includes(search.toLowerCase()));

  let paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage, currentPage * itemsPerPage
  );

  useEffect(() => {
    const getDevices = async () => {
      try {
        let response = await API.get("/devices/fetch-devices/");
        setDevicesData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }

    const getLicense = async () => {
      try {
        let response = await API.get("/license/get-license/");
        setLicense(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    
    getDevices();
    getLicense();
  }, []);

  const deviceCount = (licenseKey) => {
    let licenseData = license.find(data => data.licenseKey === licenseKey);
    if(!licenseData) return 0;
    let decodeKey = decodeLicenseCodeWithToken({licenseKey: licenseData.licenseKey});
    return decodeKey.totalDevices;
  }

  const handleLicenseAllocation = async (licenseKey, macAddress) => {
    if(!licenseKey) {
      let response = API.put(`/devices/deallocate-license/${macAddress}`);

      setDevicesData(prev => prev.map((device) => (
        device.macAddress === macAddress ? (
          {...device, licenseKey: licenseKey}
        ) : (
          device
        )
      )))

      toast.success('License deallocated successfully.', {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });

      return;
    }

    let updateLicenseData = {
      licenseKey: licenseKey,
      macAddress: macAddress,
      deviceCount: deviceCount(licenseKey)
    }

    try {
      // setLoading(true);
      let response = await API.put('/devices/update-license/', updateLicenseData);

      setDevicesData(prev => prev.map((device) => (
        device.macAddress === macAddress ? (
          {...device, licenseKey: licenseKey}
        ) : (
          device
        )
      )))

      toast.success('License Allocated Successfully!', {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });
    } catch (error) {
      toast.error('Something went Wrong! Please try again...', {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });
    } finally {
      // setLoading(false);
    }
  }

  const handleDeleteDevice = async (macAddress) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // setLoading(true);
          let response = await API.delete(`/devices/delete-device/${macAddress}`);
          setDevicesData(devicesData.filter(prev => prev.macAddress!==macAddress));
        } catch (error) {
          console.log(error);
        } finally {
          // setLoading(false);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your device has been deleted.",
          icon: "success"
        });
      }
    });
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  }

  return (
    <div className='mainPages'>
      {/* {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>} */}
      <div className='mainPages-header'>
        <input type="text" name='search' id='search' placeholder='&#128269; Search here' className='searchInput' value={search} onChange={(e)=>setSearch(e.target.value)}/>
      </div>
      <div className="groupTableContainer">
        <table className='groupTable'>
          <thead>
            <tr>
              <th className='groupTable-heading'>Device Name</th>
              <th className='groupTable-heading'>MAC Address</th>
              <th className='groupTable-heading'>IP Address</th>
              <th className='groupTable-heading'>Allocate License</th>
              <th className='groupTable-heading'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((data, index) => (
                <tr key={index}>
                  <td className='groupTable-data'>{data.deviceName}</td>
                  <td className='groupTable-data'>{data.macAddress}</td>
                  <td className='groupTable-data'>{data.ipAddress}</td>
                  <td className='groupTable-data'>
                    <select name="license" id="license" className='licenseSelect' value={data.licenseKey || ""} onChange={(e) => handleLicenseAllocation(e.target.value, data.macAddress)}>
                      <option value="">Select License</option>
                      {license.map((data) => (
                        <option key={data.licenseKey} value={data.licenseKey}>{data.licenseKey}</option>
                      ))}
                    </select>
                  </td>
                  <td className='groupTable-data'><i className="fa-solid fa-trash" onClick={() => handleDeleteDevice(data.macAddress)}></i></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className='empty-data-table'>No devices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <Stack spacing={2}>
          <Pagination count={Math.ceil(filteredData.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
        </Stack>
      </div>
    </div>
  )
}

export default Devices