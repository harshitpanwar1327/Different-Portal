import React, {useState, useEffect} from 'react'
import "./makeConfig.css"
import API from '../util/Api'
import {toast, Bounce} from 'react-toastify'
import {useParams} from 'react-router-dom'

const MakeConfig = ({setOpenModal, setConfigData}) => {
  const {groupID} = useParams();
  const [organizationName, setOrganizationName] = useState('');
  const [macAddress, setMacAddress] = useState(false);
  const [ipAddress, setIpAddress] = useState(false);
  const [date, setDate] = useState(false);
  const [tagline, setTagline] = useState(false);
  const [layout, setLayout] = useState('');
  const [topLeft, setTopLeft] = useState(false);
  const [topRight, setTopRight] = useState(false);
  const [bottomLeft, setBottomLeft] = useState(false);
  const [bottomRight, setBottomRight] = useState(false);
  const [chrome, setChrome] = useState(false);
  const [edge, setEdge] = useState(false);
  const [firefox, setFirefox] = useState(false);
  const [code, setCode] = useState(false);
  const [safari, setSafari] = useState(false);
  const [opera, setOpera] = useState(false);
  const [vscode, setVscode] = useState(false);
  const [notepad, setNotepad] = useState(false);
  const [prevData, setPrevData] = useState([]);

  useEffect(()=>{
    const fetchConfigData = async () => {
      try {
        let response = await API.get(`/config/get-config/${groupID}/`);
        setPrevData([response.data.data[0]]);
      } catch (error) {
        console.log(error);
      }
    }

    fetchConfigData();
  }, [groupID]);

  useEffect(()=>{
    setOrganizationName(prevData[0]?.organization || '');
    setMacAddress(prevData[0]?.macAddress || false);
    setIpAddress(prevData[0]?.ipAddress || false);
    setDate(prevData[0]?.date_enabled || false);
    setTagline(prevData[0]?.tagline_enabled || false);
    setLayout(prevData[0]?.layout || '');
    setTopLeft(prevData[0]?.qr_top_left || false);
    setTopRight(prevData[0]?.qr_top_right || false);
    setBottomLeft(prevData[0]?.qr_bottom_left || false);
    setBottomRight(prevData[0]?.qr_bottom_right || false);

    let process = prevData[0]?.whitelist_processes ? prevData[0].whitelist_processes.split(',') : [];
    setChrome(process.includes('chrome'));
    setEdge(process.includes('edge'));
    setFirefox(process.includes('firefox'));
    setCode(process.includes('code'));
    setSafari(process.includes('safari'));
    setOpera(process.includes('opera'));
    setVscode(process.includes('vscode'));
    setNotepad(process.includes('notepad'));
  }, [prevData]);

  let handleConfigForm = async (e) => {
    e.preventDefault();

    let processArray = [];
    if(chrome) processArray.push('chrome');
    if(edge) processArray.push('edge');
    if(firefox) processArray.push('firefox');
    if(code) processArray.push('code');
    if(safari) processArray.push('safari');
    if(opera) processArray.push('opera');
    if(vscode) processArray.push('vscode');
    if(notepad) processArray.push('notepad');

    let processString = processArray.join(',');

    let configData = {
      id: groupID,
      organization: organizationName,
      macAddress: macAddress,
      ipAddress: ipAddress,
      date_enabled: date,
      tagline_enabled: tagline,
      layout: layout,
      qr_top_left: topLeft,
      qr_top_right: topRight,
      qr_bottom_left: bottomLeft,
      qr_bottom_right: bottomRight,
      whitelist_processes: processString
    }

    try {
      let response = await API.put(`/config/edit-config/`, configData);

      setConfigData([configData]);

      toast.success('Policy Saved Successfully!', {
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
      setOpenModal(false);
    }
  }

  return (
    <div className='overlay' onClick={()=>setOpenModal(false)}>
      <div className='makeConfig-container' onClick={(e)=>e.stopPropagation()}>
        <i className="fa-solid fa-xmark" onClick={()=>setOpenModal(false)}></i>
        <h3 className='policyModal-heading'>Configuration Settings</h3>
        <form className="configForm" onSubmit={handleConfigForm}>
          <label htmlFor="companyName" className='configForm-label'>Organization</label>
          <input type="text" name="companyName" id="companyName" placeholder='Organization' className='companyInput' value={organizationName} onChange={(e) => setOrganizationName(e.target.value)}/>

          <div className="watermark-settings">
            <h4 className='configForm-label'>Watermark Setting</h4>
            <div className="manageStamp">
              <div className="manageStampCheckbox">
                <input type="checkbox" name="macAddress" id="macAddress" checked={macAddress} onChange={(e) => setMacAddress(e.target.checked)}/>
                <label htmlFor="macAddress" className='configForm-label'>MAC Address</label>
              </div>              
              <div className="manageStampCheckbox">
                <input type="checkbox" name="ipAddress" id="ipAddress" checked={ipAddress} onChange={(e) => setIpAddress(e.target.checked)}/>
                <label htmlFor="ipAddress" className='configForm-label'>IP Address</label>
              </div>
              <div className="manageStampCheckbox">
                <input type="checkbox" name="date" id="date" checked={date} onChange={(e) => setDate(e.target.checked)}/>
                <label htmlFor="date" className='configForm-label'>Date</label>
              </div>
              <div className="manageStampCheckbox">
                <input type="checkbox" name="tagline" id="tagline" checked={tagline} onChange={(e) => setTagline(e.target.checked)}/>
                <label htmlFor="tagline" className='configForm-label'>Tagline</label>
              </div>
            </div>
          </div>

          <label htmlFor="layout" className='configForm-label'>Layout</label>
          <select name="layout" id="layout" className='layoutDropdown' value={layout} onChange={(e) => setLayout(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="watermark-settings">
            <h4 className='configForm-label'>Manage QR</h4>
            <div className="manageStamp">
              <div className="manageStampCheckbox">
                <input type="checkbox" name="topLeft" id="topLeft" checked={topLeft} onChange={(e) => setTopLeft(e.target.checked)}/>
                <label htmlFor="topLeft" className='configForm-label'>Top Left</label>
              </div>              
              <div className="manageStampCheckbox">
                <input type="checkbox" name="topRight" id="topRight" checked={topRight} onChange={(e) => setTopRight(e.target.checked)}/>
                <label htmlFor="topRight" className='configForm-label'>Top Right</label>
              </div>
              <div className="manageStampCheckbox">
                <input type="checkbox" name="bottomLeft" id="bottomLeft" checked={bottomLeft} onChange={(e) => setBottomLeft(e.target.checked)}/>
                <label htmlFor="bottomLeft" className='configForm-label'>Bottom Left</label>
              </div>
              <div className="manageStampCheckbox">
                <input type="checkbox" name="bottomRight" id="bottomRight" checked={bottomRight} onChange={(e) => setBottomRight(e.target.checked)}/>
                <label htmlFor="bottomRight" className='configForm-label'>Bottom Right</label>
              </div>
            </div>
          </div>

          <div className="watermark-settings">
            <h4 className='configForm-label'>WhiteListed Processes QR</h4>
            <div className="whiteListedProcess">
              <div className="manageStampCheckbox">
                <input type="checkbox" name="chrome" id="chrome" checked={chrome} onChange={(e) => setChrome(e.target.checked)}/>
                <label htmlFor="chrome" className='configForm-label'>Chrome</label>
              </div>
              <div className="manageStampCheckbox">
                <input type="checkbox" name="Edge" id="Edge" checked={edge} onChange={(e) => setEdge(e.target.checked)}/>
                <label htmlFor="Edge" className='configForm-label'>Edge</label>
              </div>
              <div className="manageStampCheckbox">
                <input type="checkbox" name="firefox" id="firefox" checked={firefox} onChange={(e) => setFirefox(e.target.checked)}/>
                <label htmlFor="firefox" className='configForm-label'>Firefox</label>
              </div>
              <div className="manageStampCheckbox">
                <input type="checkbox" name="code" id="code" checked={code} onChange={(e) => setCode(e.target.checked)}/>
                <label htmlFor="code" className='configForm-label'>Code</label>
              </div>
              <div className="manageStampCheckbox">
                <input type="checkbox" name="safari" id="safari" checked={safari} onChange={(e) => setSafari(e.target.checked)}/>
                <label htmlFor="safari" className='configForm-label'>Safari</label>
              </div>
              <div className="manageStampCheckbox">
                <input type="checkbox" name="opera" id="opera" checked={opera} onChange={(e) => setOpera(e.target.checked)}/>
                <label htmlFor="opera" className='configForm-label'>Opera</label>
              </div>
              <div className="manageStampCheckbox">
                <input type="checkbox" name="vscode" id="vscode" checked={vscode} onChange={(e) => setVscode(e.target.checked)}/>
                <label htmlFor="vscode" className='configForm-label'>Vscode</label>
              </div>
              <div className="manageStampCheckbox">
                <input type="checkbox" name="notepad" id="notepad" className='checkboxInputConfig' checked={notepad} onChange={(e) => setNotepad(e.target.checked)}/>
                <label htmlFor="notepad" className='configForm-label'>Notepad</label>
              </div>
            </div>
          </div>

          <button className='saveModalBtn'>Save Changes</button>
        </form>
      </div>
    </div> 
  )
}

export default MakeConfig