import { useRef, useState } from "react";
import "./folderModal.scss"; 
import { useDispatch, useSelector, } from "react-redux";
import { folderHideModalDetail } from "../../redux/foldermodal/foldermodal.actions";
import { selectFolderModalState } from "../../redux/foldermodal/foldermodal.selectors";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion"
import { VscChromeClose } from "react-icons/vsc";
import { FaFolder } from "react-icons/fa";
import { createNewFolder } from "../../firebase/firebaseUtils";
import {  modalOverlayVariants, modalVariants} from "../../motionUtils";
import { fetchFoldersAsync } from "../../redux/folders/folder.actions";

/** This modal is put in the Navbar and is used so a user can make a new folder*/
function FolderModal() {
    const dispatch = useDispatch();
	const modalClosed = useSelector(selectFolderModalState);
    const modalRef = useRef();
    const [folderName, setFolderName] = useState("");
    const [errorMessage,setErrorMessage]=useState("")

    //I wanted folders to have more than a length of 3
    const handleDone = () => {
        if (folderName.length >= 4) {
          console.log("Folder name:", folderName);
          createNewFolder({name:folderName})
          setFolderName("")
          setErrorMessage("")
          dispatch(folderHideModalDetail());
          dispatch(fetchFoldersAsync())
       
        }else{
            
            setErrorMessage("Folder name must be at least 4 characters long.")
        }
      };
    return (
        <AnimatePresence exitBeforeEnter>
   
            
            {!modalClosed && (
                
                <motion.div
						variants={modalOverlayVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						key="modalOverlay"
						className={`Modal__overlay ${modalClosed && 'Modal__invisible'}`}
					>
						<motion.div
							key="modal"
							variants={modalVariants}
							ref={modalRef}
							className={`Modal__wrp ${modalClosed && 'Modal__invisible'}`}
						>
							<motion.button
								className="Modal__closebtn"
								onClick={()=> dispatch(folderHideModalDetail())}
							>
                     <VscChromeClose />
                    </motion.button>
                    <motion.div  initial="initial" animate="animate" exit="exit" className="Modal__info--wrp">
                    <h2 className="Modal__info__title">Create a New Folder</h2>
                    
                    </motion.div>
                    <div className="Modal__folderIcon">
                        <FaFolder size="15em" />
                     </div>
                     <motion.div
                         initial="initial"
                         animate="animate"
                         exit="exit"
                         className="Modal__content"
                    >
                     <div className="Modal__inputContainer">
                        <input
                             type="text"
                             placeholder="Folder name"
                             className="Modal__input"
                             value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                        />
                        
                    </div>
                    <p1>{errorMessage}</p1>
                    <button className="Modal__doneButton" onClick={handleDone}>
              Done
            </button>
            
					
						
            </motion.div>	
                </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default FolderModal;
