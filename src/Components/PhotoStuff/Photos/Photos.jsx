import Grid from "../../Grid/Grid";
import EntityHeader from "../../EntityHeader/EntityHeader";
import styles from './photos.module.css'
import { Link } from "react-router-dom";

function Photos()
{
    return (
        <>
        <EntityHeader entityname="Photos" entityaction="Upload" entityactionlink="photo/upload"></EntityHeader>
        <Grid></Grid>
        </>);
}

export default Photos;