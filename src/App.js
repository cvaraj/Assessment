import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Loader from './loader.gif';
import { BsPlusLg, BsCheckLg, BsXLg, BsUpload, BsTrash, BsArrowLeftShort, BsArrowRightShort  } from 'react-icons/bs';

function App() {
  const [popupShow, setPopupShow] = useState(false);
  const [documentPopupShow, setDocumentPopupShow] = useState(false);
  const [applicantList, setApplicantList] = useState([]);
  const [currentName, setCurrentName] = useState('');
  const [id, setId] = useState(0);
  const [documentId, setDocumentId] = useState(0);
  const [active, setActive] = useState(0);
  const [innerTabActive, setInnerTabActive] = useState(1);
  const [loader, setLoader] = useState(false);
  const [notificationLoader, setNotificationLoader] = useState(false)
  const [notification, setNotification] = useState()
  const handleAddApplicant = () => {
    setPopupShow(true);
  };

  const handleNameInput = (e) => {
    setCurrentName(e.target.value);
  };

  const handleSaveApplicant = (e) => {
    e.preventDefault();
    if (currentName.trim()) {
      const newApplicant = { name: currentName.trim(), id: id + 1 };
      setApplicantList((prevList) => [...prevList, newApplicant]); // Accumulate applicants in the list
      setCurrentName(''); // Clear the input field
      setPopupShow(false); // Close the popup
      setId(id + 1); // Increment ID for the next applicant
    }
  };

  const handleDocumentName = (e, id) => {
    e.preventDefault();
    if (currentName.trim()) {
      const k = applicantList.find((item) => item.id === id)?.documentList?.length;
      const l = k !== undefined ? parseInt(k, 10) : 0;
      const newDocument = { name: currentName.trim(), id: l + 1 };
      setApplicantList((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? {
                ...item,
                documentList: item.documentList
                  ? [...item.documentList, newDocument] // Append to existing documentList
                  : [newDocument], // Create a new documentList if it doesn't exist
              }
            : item
        )
      );
      setCurrentName(''); // Clear the input field
      setDocumentPopupShow(false); // Close the popup
      setDocumentId(documentId + 1); // Increment ID for the next applicant
      setInnerTabActive(1);
    }
  }

  const handleCloseApplicant = (e) => {
    e.preventDefault();
    setCurrentName(''); // Clear the input field
    setPopupShow(false); // Close the popup
    setDocumentPopupShow(false)
  };
  const handleTab = (index) => {
    setActive(index);
    setInnerTabActive(1)
  };

  const handleDcoumentList = () => {
    setDocumentPopupShow(true)
  }
  

  const handleInnerTab = (ids) => {
    setInnerTabActive(ids)
  }

  const [pendingFile, setPendingFile] = useState(null)
  const handleFileUpload = (e) => {
    
    const files = Array.from(e.target.files); // Convert FileList to Array
      const imageFiles = files.map((file) => {
        return {
          file_path: URL.createObjectURL(file), // Create a URL for the file
          file_name: file.name,
          file_size: file.size,
          file_status: 'Pending' // File size in bytes
        };
      });
      setPendingFile(imageFiles); // Update state with the array of images
  }

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`; // Bytes
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`; // Kilobytes
    return `${(size / (1024 * 1024)).toFixed(2)} MB`; // Megabytes
  };

  const handleUploadConfirm = (e, parentId, childId) => {
    setLoader(true);
    
    setTimeout(() => {
      if (pendingFile) {
        setApplicantList((prevData) =>
          prevData.map((item) =>
            item.id === parentId
              ? {
                  ...item,
                  documentList: item.documentList.map((data) => 
                    data.id === childId? {
                      ...data,
                      file_list: data.file_list ? [...data.file_list, ...pendingFile] : [...pendingFile]
                    }: data
                  ) 
                }
              : item
          )
        );
        setPendingFile(null); // Reset pending file
        setLoader(false);
        setNotificationLoader(true);
        setNotification('Uploaded SuccessFully');

        setTimeout(() => {
          setNotificationLoader(false);
        }, 3000);
      }
    }, 2000);
  }

  const handleDeleteApplicant = (e, id) => {
    e.preventDefault();
    setTimeout(function(){
      setActive(0);
    }, 100);
    const FilteredData = applicantList?.filter(option => option.id !== id);
    console.log('FilteredData', FilteredData);
    setApplicantList(FilteredData);
    
  }

  const handleFileDelete = (appId, docId, itemIndex) => {
    const FilteredData = applicantList.map((item) => {
      // Check if the current applicant matches `appId`
      if (item.id === appId) {
        // Update the `documentList` by filtering out the document with the matching `docId`
        return {
          ...item,
          documentList: item.documentList.map((document) => {
            // Check if the current document matches `docId`
            if (document.id === docId) {
              // Filter out the `item` within `file_list` using `index Position`
              return {
                ...document,
                file_list: document.file_list.filter((file, index) =>index !== itemIndex),
              };

              
            }
            console.log('document', document)
            return document; // Return the document unchanged if `docId` does not match
          }),
        };
      }
      return item; // Return the item unchanged if `appId` does not match
    });

    console.log('FilteredData', FilteredData);
    setApplicantList(FilteredData);
  }

  return (
    <div className="App">
      <div className='container'>
        <div className='heading'>
          <h1>Document Upload</h1>
          <button onClick={handleAddApplicant}><BsPlusLg /> Add Applicant</button>
        </div>
      </div>

      {/* Popup Form */}
      <div className={`popup ${popupShow ? 'show-popup' : ''}`}>
        <div className='popup-inner'>
          <div className='title'>
            <h3>Add Applicant </h3>
            <button onClick={handleCloseApplicant} className='close-btn'><BsXLg /></button>
          </div>
          <form>
            <div className='form-input'>
              <label>Name</label>
              <input
                value={currentName}
                onChange={handleNameInput}
                type='text'
                name="name"
              />
            </div>
            <div className='form-btn flex-end'>
              <button onClick={handleSaveApplicant}><BsCheckLg /> Save</button>
              <button className='cancel-btn' onClick={handleCloseApplicant}><BsXLg /> Cancel</button>
            </div>
          </form>
        </div>
      </div>

      {/* Document List */}
      <div className={`popup ${documentPopupShow ? 'show-popup' : ''}`}>
        <div className='popup-inner'>
          <div className='title'>
            <h3>Add Document </h3>
            <button onClick={handleCloseApplicant} className='close-btn'>X</button>
          </div>
          <form>
            <div className='form-input'>
              <label>Dcoument Name</label>
              <input
                value={currentName}
                onChange={handleNameInput}
                type='text'
                name="name"
              />
            </div>
            <div className='form-btn flex-end'>
              <button onClick={(e) => handleDocumentName(e, active+1)}><BsCheckLg /> Save</button>
              <button className='cancel-btn' onClick={handleCloseApplicant}><BsXLg /> Cancel</button>
            </div>
          </form>
        </div>
      </div>

      {/* Table to Display Applicant List */}
      <div className='container'>
        <div className='table-header flex-start'>
          {applicantList.map((applicant, applicantIndex) => (
            <div
              key={applicant.id} // Use unique id for key
              className={`applicant-list ${active === applicantIndex ? 'active' : ''}`}
              onClick={() => handleTab(applicantIndex)}
            >
              <div className='flex-start'>{applicant.name} <button onClick={(e) =>handleDeleteApplicant(e, applicant.id)}><BsTrash /></button></div> {/* Display the name property */}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className='data-main'>
          {applicantList.map((applicant, applicantIndex) => (
            <div
              key={`con-${applicant.id}`} // Use unique id for key
              className={`content ${active === applicantIndex ? 'active' : ''}`}
            >
              
              <div className='document-list'>
                  <div>
                    <ul className={applicant?.documentList? 'active' : ''}>
                      {applicant?.documentList?.map((document, documentIndex) => (
                        
                          <li className={innerTabActive === document.id? 'active' : '' } onClick={() => handleInnerTab(document.id)}><span>{document.name}</span></li>                 
                      
                      ))}
                    </ul>
                    <button onClick={handleDcoumentList}><BsPlusLg /> Add</button>
                  </div>
                  <div className='document-info'>
                  {!applicant?.documentList && <div className='empty-document'>No documents available</div>}
                    {applicant?.documentList?.map((document, documentIndex) => {    
                      return ( 
                        <>                        
                          {innerTabActive === document.id && 
                          <>
                            <div className='file-upload-header flex-start '>
                              <div className='mr-1 custom-upload'>
                                  <input onChange={handleFileUpload} type='file' name='file' />
                                  <button ><BsPlusLg /> Choose</button>
                              </div>
                              <button disabled={pendingFile? false: true} onClick={(e) => handleUploadConfirm(e, applicant.id, document.id)} className='mr-1'><BsUpload /> Upload</button>
                              <button disabled={pendingFile? false: true} onClick={() =>setPendingFile(null)}  className='mr-1'><BsXLg /> Cancel</button>
                            </div>
                            {!document?.file_list?.length > 0 && <div className='empty-document'>Drag and Drop Files Here <input onChange={handleFileUpload} type='file' name='file' /></div>}
                            {pendingFile && 
                              <div className='file-list'>
                                  <table width="100%">
                                    
                                    <tbody>
                                      <tr>
                                        <td><img width="40" src={pendingFile[0]?.file_path} alt=''/></td>
                                        <td>{pendingFile[0]?.file_name}</td>
                                        <td><span>{formatFileSize(pendingFile[0]?.file_size)}</span></td>
                                        <td><span className='status pending'>{pendingFile[0]?.file_status}</span></td>
                                        <td><BsXLg /></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  {loader && 
                                    <div className='loader'><img src={Loader} width="100px" alt='' /></div>
                                  }
                              </div>
                            }
                            {document?.file_list?.length > 0 && 
                              <div className='file-list'>
                                  <table width="100%">
                                    <thead>
                                      <tr>
                                        <th>Image</th>  
                                        <th>Name</th>
                                        <th>Size</th>
                                        <th>Status</th>
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {document?.file_list.map((item, itemIndex) => (
                                        <tr>
                                          <td><img width="40" src={item.file_path} alt=''/></td>
                                          <td>{item.file_name}</td>
                                          <td><span>{formatFileSize(item.file_size)}</span></td>
                                          <td><span className='status completed'>Completed</span></td>
                                          <td className='close-icon'><BsXLg onClick={() => handleFileDelete(applicant.id, document.id, itemIndex)}/></td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  <div>
                                    
                                  </div>
                              </div>
                            }
                          </>
                        }
                          </>
                      )
                      
                      })}
                  </div>
              </div>
              
            </div>
          ))}
        </div>
        {applicantList?.length > 0 && 
          <div className='row flex-end'>
            <button onClick={() => setActive(active < 1? applicantList.length - 1 : active - 1)} className='mr-2'><BsArrowLeftShort />Prev</button>
            <button onClick={() => setActive((prevActive) => prevActive >= (applicantList.length - 1) ? 0 : prevActive + 1)}>Next <BsArrowRightShort className='ml-1' /></button>
          </div>
        }
      </div>
      <div className={`notification ${notificationLoader? 'show' : ''}`}>{notification}</div>
    </div>
  );
}

export default App;
