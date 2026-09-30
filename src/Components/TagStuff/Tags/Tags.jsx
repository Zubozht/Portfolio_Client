import useFetchTags from '../../../FetchTools/useFetchTags';
import { Link, useNavigate } from 'react-router-dom';
import Grid from '../../Grid/Grid';
import EntityHeader from '../../EntityHeader/EntityHeader';
import Loading from '../../Loading/Loading';

function Tags()
{
    //const navigate = useNavigate();
    const { tags, isLoading, fetchError } = useFetchTags("");

    return (
            <>
                <EntityHeader entityname="Tags" entityaction="Create" entityactionlink="tag/create"></EntityHeader>
                {!isLoading && !fetchError && <Grid tagPreviews={tags.map(x => ({id: x.id, tag:x.tag}))}></Grid>}
                {isLoading && !fetchError && <Loading></Loading>}
            </>
            );
}

export default Tags;