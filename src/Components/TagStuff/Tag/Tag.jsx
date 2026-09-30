import styles from './tag.module.css';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import tagPUT from '../../../FetchTools/tagPUT.jsx';
import tagPOST from '../../../FetchTools/tagPOST.jsx'
import tagDELETE from '../../../FetchTools/tagDELETE.jsx';
import useFetchTags from '../../../FetchTools/useFetchTags.jsx';
import useFetchPhotos from '../../../FetchTools/useFetchPhotos.jsx';
import Grid from '../../Grid/Grid.jsx';
import Loading from '../../Loading/Loading.jsx';
import Error404 from '../../Error404/Error404.jsx';
import { ApiContext } from '../../../ApiContext.jsx';

function Tag(props)
{
    const navigate = useNavigate();
    const baseurl = useContext(ApiContext);
    const {tagID} = useParams();
    const { isTag=true, editMode=false } = props;
    const {tags:tag, isLoading, fetchError, notFetched} = useFetchTags(tagID);
    const { photos, isLoading:photosLoading, fetchError:photosError } = useFetchPhotos(`search, ${JSON.stringify({'tagIDs':[Number(tagID)]})}`);
    const [tagValue, setTagValue] = useState('');

    useEffect(function(){if(!isLoading && !fetchError){setTagValue(tag.tag);};}, [isLoading, fetchError]);

    const editTag = function(e)
    {
        setTagValue(e.target?.value);
    }


    const handleTagUpdate = async function()
    {
        let tagupdatebody;
        let response;
        if (isTag)
        {
            tagupdatebody =
            {
                "tag":tagValue,
                "photos":tag.photos.map(x => x.id)
            };
            response = await tagPUT(tagID, tagupdatebody, baseurl);
        }
        else
        {
            tagupdatebody =
            {
                "tag":tagValue
            };
            response = await tagPOST(tagupdatebody, baseurl);
        }
        
        if (!response.ok)
        {
            alert(`An error occured: ${response.status}`);
            throw new Error("An error occured: ", response.status);
        }

        if (isTag)
        {
            const responsejson = await response.json();
            navigate(`/tag/${responsejson.id}`);
        }
        else
        {
            const responsejson = await response.json();
            navigate(`/tag/${responsejson.id}`);
        }
        
    }

    const handleTagDelete = async function()
    {
        const response = await tagDELETE(tagID, baseurl);
        if (!response.ok)
        {
            alert(`An error occured: ${response.status}`);
            throw new Error("An error occured: ", response.status);
        }
        navigate(`/tags`)
    };

    return(
        <>
            {isTag && !editMode && !isLoading && !fetchError && !notFetched && !photosLoading && !photosError && (
            <>
                <section className={styles.Heading}>
                    <div className={styles.LeftSection}>
                        <div className={styles.TagText}>{tag.tag}</div>
                    </div>
                    <div className={styles.RightSection}>
                        {/*<Link to={`/tags`} className={styles.ToTagsLink}><div className={styles.ToTagsText}>To Tags →</div></Link>*/}
                        {localStorage.getItem('currentUserRoles') && localStorage.getItem('currentUserRoles').includes('Admin') && (localStorage.getItem("expires") - new Date(Date.now()).getTime() > 0) && <Link to={`/tag/${tagID}/edit`}><button className={styles.TagEditButton}>Edit</button></Link>}
                        {localStorage.getItem('currentUserRoles') && localStorage.getItem('currentUserRoles').includes('Admin') && (localStorage.getItem("expires") - new Date(Date.now()).getTime() > 0) && <button className={styles.TagDeleteButton} onClick={handleTagDelete}>Delete</button>}
                    </div>
                </section>
                <Grid requestbody={`search, ${JSON.stringify({'tagIDs':[Number(tagID)]})}`}></Grid>
            </>
            )}
            {editMode && localStorage.getItem('currentUserRoles') && localStorage.getItem('currentUserRoles').includes('Admin') && (localStorage.getItem("expires") - new Date(Date.now()).getTime() > 0) && !isLoading && !fetchError && !notFetched && !photosLoading && !photosError && (
            <>
                <section className={styles.Heading}>
                    <div className={styles.LeftSection}>
                        <input type="text" value={tagValue} className={styles.TagText} onChange={editTag}></input>
                    </div>
                    <div className={styles.RightSection}>
                        <button className={styles.TagSaveButton} onClick={handleTagUpdate}>Save</button>
                        <button className={styles.TagDiscardButton} onClick={function(){navigate(`/tag/${tagID}`)}}>Discard</button>
                    </div>
                </section>
                <Grid requestbody={`search, ${JSON.stringify({'tagIDs':[Number(tagID)]})}`}></Grid>
                {/*<input type="text" value={tagValue} onChange={editTag}></input>*/}
                {/*<button onClick={handleTagUpdate}>Submit.</button>*/}
            </>)}
            {!isTag && localStorage.getItem('currentUserRoles') && localStorage.getItem('currentUserRoles').includes('Admin') && (localStorage.getItem("expires") - new Date(Date.now()).getTime() > 0) && (
            <>
                <section className={styles.Heading}>
                    <div className={styles.LeftSection}>
                        {/*<h2>Create a new tag.</h2>*/}
                        <input type="text" className={styles.TagText} placeholder="Enter the tag name." onChange={editTag}></input>
                    </div>
                    <div className={styles.RightSection}>
                        <button className={styles.TagSaveButton} onClick={handleTagUpdate}>Save</button>
                        <button className={styles.TagDiscardButton} onClick={function(){navigate(`/tags`)}}>Discard</button>
                    </div>
                    {/*<div className={styles.RightSection}>*/}
                        {/*<Link to={`/tags`} className={styles.ToTagsLinkHidden}><div className={styles.ToTagsText}>To Tags →</div></Link>*/}
                    {/*</div>*/}
                </section>
            </>)}
            {isLoading && <Loading></Loading>}
            {(fetchError || notFetched) && isTag && <Error404></Error404>}
            {!isTag && (!localStorage.getItem('currentUserRoles') || !localStorage.getItem('currentUserRoles').includes('Admin')) && (localStorage.getItem("expires") - new Date(Date.now()).getTime() > 0) && <Error404></Error404>}
        </>)
}

export default Tag;