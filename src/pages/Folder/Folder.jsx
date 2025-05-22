
import "./folder.scss"
import Poster from "../../components/Poster/Poster";
import Credits from "../../components/Credits/Credits";
import { motion } from "framer-motion";
import { staggerHalf, defaultPageFadeInVariants } from "../../motionUtils";
import { useSelector } from "react-redux";
import { selectFolderItemsList } from "../../redux/folderitems/folderitems.selectors";
import { selectFolderList } from "../../redux/folders/folder.selectors";


const FolderPage = () => {
    const folders = useSelector(selectFolderList);
    const items = useSelector(selectFolderItemsList);
    
    return (
        <div>
            <motion.div
                className="Folder"
                variants={defaultPageFadeInVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >       
                <h2 className="Folder__title">Folders</h2>
                <motion.div
                    className="Folder__wrp"
                    variants={staggerHalf}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    
                    {folders && folders.length > 0
                        ? folders.map(folder => (    
                            <>
                                <h2 className = "Folder__folderTitle">
                                    {folder.name}
                                </h2>

                                {items && items[folders.indexOf(folder)].length > 0 
                                    ? items[folders.indexOf(folder)].map(tvmovie => (
                                        <Poster 
                                            key={tvmovie.id}
                                            item={tvmovie}
                                            {...tvmovie}
                                            folders={folders}
                                        />
                                    ))
                                    : (
                                        <h2 className="Folder__subtitle">
                                            Sorry, this folder doesn&apos;t have any movies or tv-shows in it yet.
                                        </h2>
                                    )
                                }
                            </>
                        ))
                        : (
                            <h2 className="Folder__title">
                                Sorry, you don&apos;t have any folders yet.
                            </h2>
                        )}
                </motion.div>
                <Credits />   
            </motion.div>
        </div>
    )
}
export default FolderPage
