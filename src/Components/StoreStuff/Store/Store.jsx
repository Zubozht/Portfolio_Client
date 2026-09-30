import useFetchProducts from '../../../FetchTools/useFetchProducts';
import { Link, useNavigate } from 'react-router-dom';
import Grid from '../../Grid/Grid';
import EntityHeader from '../../EntityHeader/EntityHeader';
import Loading from '../../Loading/Loading';
import styles from './store.module.css'

function Store()
{
    //const navigate = useNavigate();
    const { products, isLoading, fetchError } = useFetchProducts("");

    return (
            <>
                <EntityHeader entityname="Store" entityaction="Add" entityactionlink="store/add"></EntityHeader>
                {/*<div className={styles.Store}>Store???</div>*/}
                {!isLoading && !fetchError && <Grid productPreviews={products.map(x => ({id: x.id, product:x.title}))}></Grid>}
                {isLoading && !fetchError && <Loading></Loading>}
            </>
            );
}

export default Store;