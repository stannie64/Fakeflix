import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc,getDocs } from "firebase/firestore"; 
import { fetchFoldersAsync } from "../redux/folders/folder.actions";


const { REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_AUTH_DOMAIN, REACT_APP_FIREBASE_PROJECT_ID, REACT_APP_FIREBASE_STORAGE_BUCKET, REACT_APP_FIREBASE_MESSAGING_SENDER_ID, REACT_APP_FIREBASE_APP_ID, REACT_APP_FIREBASE_MEASUREMEMT_ID } = process.env;

// Firebase Configuration Object
const firebaseConfig = {
    apiKey: REACT_APP_FIREBASE_API_KEY,
    authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: REACT_APP_FIREBASE_APP_ID,
    measurementId: REACT_APP_FIREBASE_MEASUREMEMT_ID
}

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();

    if (!snapShot.exists) {
        const { displayName, email, photoURL } = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName,
                email,
                photoURL,
                createdAt,
                ...additionalData,
            })
        } catch (error) {
            console.log("error creating user", error.message)
        }
    }

    return userRef;
}

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            unsubscribe();
            resolve(userAuth);
        }, reject);
    });
}
/**
 * creates a folder in the firebaseDB
 * @param  newFolderData: String of folder name
 * 
 */
export async function createNewFolder(newFolderData) {
    // Get the currently signed-in user
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;  // Dynamically get the user ID
        
        // Reference to the 'folders' collection under the user
        const foldersCollectionRef = collection(db, 'users', userId, 'folders');
        
        try {
            // Add a new document with the provided data
            const docRef = await addDoc(foldersCollectionRef, newFolderData);
            console.log("Document written with ID: ", docRef.id);  // Log the new document's ID
            fetchFoldersAsync()
            return docRef.id;
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    } else {
        console.log("No user is signed in");
    }
}


/** this function gets the current user and returns the user's associated folders from the database.
 */
export const getUserFolders = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    // get database info, get ID from user, initialize empty folder array in which to store folders
    const db = getFirestore();
    const userId = user.uid;
    let folderArray = [];

    // get reference to relevant database path
    const foldersRef = collection(db, "users", userId, "folders");
   
    // retrieves all objects from the database collection, in this case the folders & their info
    const snapshot = await getDocs(foldersRef);
    snapshot.forEach((doc) => folderArray.push({id:doc.id,...doc.data()}));
    console.log(+folderArray)

    return folderArray;
    } 

    export async function addMovieToFolder(folderID,movie) {
        // Get the currently signed-in user
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (user) {
            const userId = user.uid;  // Dynamically get the user ID
            
            // Reference to the 'folders' collection under the user
            const foldersCollectionRef = collection(db, 'users', userId, 'folders',folderID,'tvmovies');
            
            try {
                // Add a new document with the provided data
                const docRef = await addDoc(foldersCollectionRef, movie);
                console.log("Document written with ID: ", docRef.id);  // Log the new document's ID
                fetchFoldersAsync()
                return docRef.id;
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        } else {
            console.log("No user is signed in");
        }
    }

    /** this function takes in the ID of a folder and returns the list of items 
     *  associated with the folder; each array item contains an object with
     *  the data of each TV series or movie.
     * 
     * @param {*} folderList the list of the folders with which to search the database.
     * the id of each folder in the folder list will be used to retrieve TV/movies.
     * 
     * @returns tvMoviesArray,  an array containing the information for the list items
     * inside of each folder, with each list item being either a TV series or a movie.
     */
    export const getFolderItems = async (folderList) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        // get database info, get ID from user, initialize empty array in which to store TV
        // series and movies associated with the folders (aka items stored in each folder)
        const db = getFirestore();
        const userId = user.uid;
        let tvMoviesArray = [[],[]];
        let i = 0;

        folderList.forEach( async (folder) => {
            let folderID = folder.id;
            // get reference to relevant database path
            let tvMoviesRef = collection(db, "users", userId, "folders", folderID, "tvmovies");
    
            // retrieves all objects from the database collection, in this case the folders & their info
            const snapshot = await getDocs(tvMoviesRef);
            tvMoviesArray[i] = [];
            snapshot.forEach((doc) => tvMoviesArray[i].push({id:doc.id,...doc.data()}));
            i++;
            console.log(+tvMoviesArray);
        })

        return tvMoviesArray;
    }
    
// Firebase web app init
firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const firestore = firebase.firestore()

// Sign in With Google Setup with popup
export const googleProvider = new firebase.auth.GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider)

export default firebase
