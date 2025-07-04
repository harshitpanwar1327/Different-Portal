import {React, useState}from 'react'
import './createGroup.css'
import API from '../util/Api'
import {toast} from 'react-toastify'
import HashLoader from "react-spinners/HashLoader"

const CreateGroup = ({setOpenModal, getGroupData}) => {
  let userId = sessionStorage.getItem('userId');
  let [groupName , setGroupName] = useState('');
  let [loading, setLoading] = useState(false);

  const handleCreate = async (e)=>{
    e.preventDefault();

    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);

      let groupData = {
        userId,
        groupName
      }

      let response = await API.post("/group/add-group/", groupData);
      
      await getGroupData(1, 10, '');

      toast.success('Group Saved Successfully');
    } catch (error) {
      toast.error(error.response.data.message || 'Group not saved!');
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
      setOpenModal(false);
    }
  }

  return (
    <div className="overlay" onClick={() => setOpenModal(false)}>
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <div className='create-group-popup' onClick={(e) => e.stopPropagation()}>
        <i onClick={()=>{setOpenModal(false)}} className="fa-solid fa-xmark"></i>
          <form onSubmit={handleCreate}>
            <h3>Let's create a Group</h3>
            <input type="text" name="groupName" id="groupName" placeholder='Group name' className='group-input' value={groupName} onChange={(e)=> setGroupName(e.target.value)} required/>
            <button className='create-group-button'>Create Group</button>
          </form>
      </div>
    </div>
  )
}

export default CreateGroup