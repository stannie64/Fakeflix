import "./homepage.scss"
import Banner from "../../components/Banner/Banner"
import Row from "../../components/Row/Row"
import Credits from "../../components/Credits/Credits";
import { useRetrieveData } from "../../hooks/useRetrieveData";
import { motion } from "framer-motion";
import { defaultPageFadeInVariants } from "../../motionUtils";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { selectFolderList } from "../../redux/folders/folder.selectors";
import { fetchFolderItemsAsync } from "../../redux/folderitems/folderitems.actions";


const Homepage = () => {
    const rows = useRetrieveData('movies');
    const dispatch = useDispatch();
    const folderList = useSelector(selectFolderList);

    useEffect (() => {
        dispatch(fetchFolderItemsAsync(folderList));
    }, [dispatch, folderList]);

    return (
        <motion.div
            className="Homepage"
            variants={defaultPageFadeInVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <Banner />
            {rows && rows.map(props => (
                <Row key={props.id} {...props} />
            ))}
            <Credits />
        </motion.div>
    )
}

export default Homepage
