import useFetchTags from '../../../FetchTools/useFetchTags';
import { Link, useNavigate } from 'react-router-dom';
import Grid from '../../Grid/Grid';
import EntityHeader from '../../EntityHeader/EntityHeader';
import Loading from '../../Loading/Loading';
import styles from './store.module.css'

function Store()
{
    //const navigate = useNavigate();
    const { tags, isLoading, fetchError } = useFetchTags("");

    return (
            <>
                <EntityHeader entityname="Store" entityaction="Create" entityactionlink="store/create"></EntityHeader>
                <div className={styles.Store}>Store???</div>
            </>
            );
}

export default Store;