import "./poster.scss"
import { motion } from "framer-motion";
import { posterFadeInVariants } from "../../motionUtils";
import { BASE_IMG_URL, FALLBACK_IMG_URL } from "../../requests";
import { FaChevronDown, FaMinus, FaPlay, FaPlus, FaFolderPlus } from "react-icons/fa";
import useGenreConversion from "../../hooks/useGenreConversion";
import { showModalDetail } from "../../redux/modal/modal.actions";
import { useDispatch, useSelector } from "react-redux";
import { addToFavourites, removeFromFavourites } from "../../redux/favourites/favourites.actions";
import { Link } from "react-router-dom";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useState, useRef } from 'react';
import { addMovieToFolder } from "../../firebase/firebaseUtils";
import ScrollableComponent from "../Scrollable/ScrollableComponent";
import { selectFolderList } from "../../redux/folders/folder.selectors";
import { fetchFolderItemsAsync } from "../../redux/folderitems/folderitems.actions";

const Poster = result => {
    const { item, item: { title, original_name, original_title, name, genre_ids, backdrop_path }, isFavourite } = result;
    let fallbackTitle = title || original_title || name || original_name;
    const genresConverted = useGenreConversion(genre_ids);
    const dispatch = useDispatch();
    const folders = useSelector(selectFolderList);

    // newly added: 
    //      - useState to set whether the folder list should be visible or not
    //      - folder list ref to close the folder list when an outside click happens
    const [folderList, setFolderList] = useState(false);
    const folderListRef = useRef();

    const handleAdd = event => {
        event.stopPropagation();
        dispatch(addToFavourites({ ...item, isFavourite }));
    };
    const handleRemove = event => {
        event.stopPropagation();
        dispatch(removeFromFavourites({ ...item, isFavourite }));
    };

    const handleModalOpening = () => {
        dispatch(showModalDetail({ ...item, fallbackTitle, genresConverted, isFavourite }));
    };

    const handlePlayAction = event => {
        event.stopPropagation();
    };

    useOutsideClick(folderListRef, () => {
		if (folderList) setFolderList(false);
	});

    /** this function takes in a folder object as a parameter and adds
     *  the current movie for this poster to that folder. using the info 
     *  stored in 'item'.
     * 
     * @param folder: is an object storing information about the folder to add a movie into.
     * 
    */
    const handleAddToFolder = (folder) => {
        addMovieToFolder(folder.id,item);
        dispatch(fetchFolderItemsAsync(folders));
    };

    /** this function takes in an event as the parameter. it stops the propagation of the
     *  event to prevent the modal dialog box from opening, and then sets the folder list state
     *  to true so the user can see the list of folders available to add to.
     * 
     * @param event: event registered, in this case clicking the "add to folder" button 
     */
    async function handleFolderListOpen (event) {
        event.stopPropagation();
        setFolderList(true);
    }

    /** this function takes in an event, stops its propagation, and sets the folder list state
     *  to false to close the folder list if it is open when the folder button on the poster is
     *  clicked.
     * 
     *  @param event: event registered, in this case clicking the "add to folder" button 
     */
    const handleFolderListClose = event => {
        event.stopPropagation();
        setFolderList(false);
    };

    return (
        <motion.div
            variants={posterFadeInVariants}
            className='Poster'
            onClick={handleModalOpening}
        >
            {backdrop_path ? (
                <img src={`${BASE_IMG_URL}/${backdrop_path}`} alt={fallbackTitle} />
            ) : (
                <>
                    <img src={FALLBACK_IMG_URL} alt={fallbackTitle} />
                    <div className='Poster__fallback'>
                        <span>{fallbackTitle}</span>
                    </div>
                </>
            )}
            <div className="Poster__info">
                <div className="Poster__info--iconswrp">
                    <Link
                        className="Poster__info--icon icon--play"
                        onClick={handlePlayAction}
                        to={'/play'}
                    >
                        <FaPlay />
                    </Link>
                    {!isFavourite
                        ? (
                            <button className='Poster__info--icon icon--favourite' onClick={handleAdd}>
                                <FaPlus />
                            </button>
                        ): (
                            <button className='Poster__info--icon icon--favourite' onClick={handleRemove}>
                                <FaMinus />
                            </button>
                        )}
        
                    <button className='Poster__info--icon icon--toggleModal'>
                        <FaChevronDown onClick={handleModalOpening}/>
                    </button>

                    { /* NEW ADDITION! add to folder button. */ }

                    <button
						className='Poster__info--icon icon--toggleModal'
						onClick={ folderList ? handleFolderListClose : handleFolderListOpen }
					>
                        <FaFolderPlus />
						<div className={`Poster__folders--content ${folderList ? "active" : ""}`}>
							{folderList && (
								<ul
									className="Poster__folders--content-wrp"
									ref={folderListRef}
                                    onMouseLeave={() => setFolderList(false)}
								>
                                    <ScrollableComponent>
										<li>
											<strong>Add to folder</strong>
										</li>
										{ folders.map((folder, i) => 
											<li key={i} onClick={(event) => {event.stopPropagation;
											handleAddToFolder(folder)}}>
												{folder.name}
											</li>
										)}
									</ScrollableComponent>
								</ul>
							)}
						</div>
                    </button>

                </div>
                <div className="Poster__info--title">
                    <h3>{fallbackTitle}</h3>
                </div>
                <div className="Poster__info--genres">
                    {genresConverted && genresConverted.map(genre => (
                        <span key={`Genre--id_${genre}`} className="genre-title">{genre}</span>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default Poster
