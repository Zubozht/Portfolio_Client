import styles from './photo.module.css'
import imagesloaded from 'imagesloaded';
import React, {useEffect, useState, useRef, useContext} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useFetchPhotos from '../../../FetchTools/useFetchPhotos';
import useFetchTags from '../../../FetchTools/useFetchTags';
import photoPUT from '../../../FetchTools/PhotoPUT';
import photoPOST from '../../../FetchTools/PhotoPOST';
import photoDELETE from '../../../FetchTools/PhotoDELETE';
import tagPOST from '../../../FetchTools/tagPOST';
import tagPUT from '../../../FetchTools/tagPUT';
import Loading from '../../Loading/Loading';
import Error404 from '../../Error404/Error404';
import tagSearch from '../../../FetchTools/TagSearch';
import { ApiContext } from '../../../ApiContext';


function Photo(props)
{
    const baseurl = useContext(ApiContext);
    const {photoID} = useParams();
    /*const [thisPhotoID, setThisPhotoID ] = useState(photoID ? photoID : undefined);*/
    const {photos: photo, isLoading, fetchError, notFetched} = useFetchPhotos(photoID);
    const {tags, setTags, isLoading:tagsLoading, fetchError:tagsError} = useFetchTags("");
    const [thisPhotoTags, setThisPhotoTags] = useState([]);
    const [initialThisPhotoTags, setInitialThisPhotoTags] = useState([]);
    const [newTag, setNewTag] = useState("Enter a tag...");
    const [newTags, setNewTags] = useState([]);
    const [iftagDropdown, setIfTagDropdown] = useState(false);
    const {isPhoto=true, editMode} = props;
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();
    const photoRef= useRef(null);
    const [uploadedImage, setUploadedImage] = useState();
    const [caption, setCaption] = useState('');
    const [description, setDescription] = useState('');
    const [sortorder, setSortorder] = useState(1);
    const [imagePath, setImagePath] = useState(``);
    const [butClicked, setButClicked] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(function()
    {
        if (!isLoading && !fetchError)
        {
            /*if (photoID)
            {
                setThisPhotoID(photoID);
            };*/
            setImagePath(`${baseurl}/photo/image/${photo.id}?${Date.now()}`);
            setCaption(photo.caption);
            setDescription(photo.description);
            setSortorder(photo.sortorder)
        };
    }, [isLoading, fetchError, photoID]);

    useEffect(function()
    {
        if (!tagsLoading && !tagsError)
        {
            setInitialThisPhotoTags(tags.filter(x => x.photos.some(p => p.id === Number(photoID))));
            setThisPhotoTags(tags.filter(x => x.photos.some(p => p.id === Number(photoID))));
        };


    }, [tagsLoading, tagsError, photoID]);

    const editCaption = function(e)
    {
        setCaption(e.target?.value);
    };
    const editDescription = function(e)
    {
        setDescription(e.target?.value);
    };
    const editSortOrder = function(sortordershift)
    {
        setSortorder(function(currentSortorder){return(currentSortorder > 1 | sortordershift > 0 ? currentSortorder + sortordershift : 1)});
    };
    const enterTag = function(e)
    {
        setNewTag(e.target?.value);
    };

    // ІМПЛЕМЕНТУВАТИ СКРОЛИНГ СТРІЛКАМИ ПІЗНІШЕ

    useEffect(function(){document.addEventListener("keydown", handleKeyDown); return(function(){document.removeEventListener("keydown", handleKeyDown)});})
    const handleKeyDown = function(e){/*photoID && !editMode && e.key === "ArrowLeft" && Number(photoID)>1 ? navigate(`/photo/${Number(photoID)-1}`) : photoID && !editMode && e.key === "ArrowRight" && Number(photoID)<13 ? navigate(`/photo/${Number(photoID)+1}`) : undefined*/};
    

    const handleUpdate = async function()
    {
        setIsPending(true);

        const sendUpdateBody = async function()
        {

            if ((fileUploaded && uploadedImage) || (!fileUploaded && isPhoto))
            {
                const newtagids = await updateTags();
                const formData = new FormData();

                if (fileUploaded && uploadedImage)
                {
                    formData.append("image", uploadedImage);
                }
                else
                {
                    const response = await fetch(`${baseurl}/photo/image/${photo.id}`);
                    const oldimage = await response.blob();
                    formData.append("image", oldimage);
                };
                formData.append("caption", caption);
                formData.append("description", description);
                formData.append("sortorder", sortorder);
                newtagids.forEach(x => formData.append("tags", x));

                let response;
                if (isPhoto)
                {
                    response = await photoPUT(photoID, formData, baseurl);
                }
                else
                {
                    response = await photoPOST(formData, baseurl);
                };

                //console.log("response: ", response);

                setIsPending(false);

                if (response.ok)
                {
                    const jsonresponse = await response.json();
                    navigate(`/photo/${jsonresponse.id}`);

                    if (thisPhotoTags.length > 0)
                    {
                        const createdtagresponse = await tagSearch({"photos":[jsonresponse.id]}, baseurl);
                        const createdjsontagresponse = await createdtagresponse.json();
                        for (let tag of createdjsontagresponse)
                        {   
                            //console.log(tag);
                            const updatetagresponse = await tagPUT(tag.id, {"tag":tag.tag, "photos":tag.photos.map(x => x.id ? x.id : x)}, baseurl);
                            if (!updatetagresponse.ok)
                            {
                                alert(`An error occured: ${updatetagresponse.status}`);
                            };
                        };
                    };
                }
                else
                {
                    //console.log("not ok");
                    alert(`An error occured: ${response.status}`);
                };
            }
            else
            {
                alert("No photo uploaded.");
                setIsPending(false);
            }
        };

        sendUpdateBody();
    };

    const handleDelete = async function()
    {
        if (thisPhotoTags.length > 0)
        {
            for (let tag of thisPhotoTags)
            {   
                //console.log(tag);
                const response = await tagPUT(tag.id, {"tag":tag.tag, "photos":tag.photos.filter(x => x.id != Number(photoID)).map(x => x.id ? x.id : x)}, baseurl);
                if (!response.ok)
                {
                    alert(`An error occured: ${response.status}`);
                };
            };
        };


        const response = await photoDELETE(photoID, baseurl);
        if (!response.ok)
        {
            alert(`An error occured: ${response.status}`);
        }

        //console.log(response);
        navigate(`/photos`);
    };

    const unbindTag = function(t)
    {
        setThisPhotoTags(thisPhotoTags.filter(x => !(x.tag == t.tag && x.id == t.id)));
    };

    const createTag= async function()
    {
        setThisPhotoTags([...thisPhotoTags, {"id":null,"photos":null,"previewimage":null,"tag":newTag}]); 
    };

    const blocker = function()
    {
        if (isPending)
        {
            return (<div className={styles.WindowBlocker}> </div>);
        }
    };

    const tagDropdown = function()
    {
        return(
            <div className={styles.TagDropdown}>
                {tags.filter(x => x.tag.toLowerCase().includes(newTag.toLowerCase().trim())).filter(fx => thisPhotoTags.length > 0 ? !thisPhotoTags.some(nt => nt.id == fx.id) : fx).map(t => <div key={t.id} className={styles.FoundTag} onClick={function(){addNewTags(t);setNewTag("Enter a tag...");}}>{t.tag}</div>)}
                <div className={styles.CreateTag} onClick={function(){createTag();setNewTag("Enter a tag...");}}>Create a new tag.</div>
            </div>
        );
    };

    const addNewTags = function(tagtoadd)
    {
        setThisPhotoTags([...thisPhotoTags, tagtoadd]);
    };

    const updateTags = async function()
    {
        let newtagids = [];
        for (let tag of initialThisPhotoTags)
        {
            const response = await tagPUT(tag.id, {"tag":tag.tag, "photos":tag.photos.filter(x => thisPhotoTags.some(t => t.id == tag.id) ? x : x.id != Number(photoID)).map(x => x.id)}, baseurl);
            if (!response.ok)
            {
                alert(`An error occured: ${response.status}`);
            }

            const initialtagsresponsejson = await response.json();

            initialtagsresponsejson.photos.some(x => x.id == Number(photoID)) ? newtagids.push(initialtagsresponsejson.id) : undefined;
        };
        
        for (let newtag of thisPhotoTags.filter(x => !initialThisPhotoTags.some(it => x.id == it.id)))
            {
                if (newtag.id != null && isPhoto)
                {
                    const response = await tagPUT(newtag.id, {"tag":newtag.tag, "photos":[...newtag.photos, {"id":Number(photoID)}].map(x => x.id)}, baseurl);
    
                    if (!response.ok)
                    {
                        alert(`An error occured: ${response.status}`);
                    }
                    
                    newtagids.push(newtag.id)
                }
                else if (newtag.id == null && isPhoto)
                {
                    const tagcreatebody =
                    {
                        "tag":newtag.tag,
                        "photos":[Number(photoID)]
                    };
                    const tagresponse = await tagPOST(tagcreatebody, baseurl);
        
                    if (!tagresponse.ok)
                    {
                        alert(`An error occured: ${tagresponse.status}`);
                    }
                    const tagresponsejson = await tagresponse.json();

                    const newtagupdateresponse = await tagPUT(tagresponsejson.id, {"tag":tagresponsejson.tag, "photos":tagresponsejson.photos.map(x => x.id)}, baseurl);
    
                    if (!newtagupdateresponse.ok)
                    {
                        alert(`An error occured: ${newtagupdateresponse.status}`);
                    }

                    newtagids.push(tagresponsejson.id);
                }
                else if (newtag.id != null && !isPhoto)
                {
                    const response = await tagPUT(newtag.id, {"tag":newtag.tag, "photos":newtag.photos.map(x => x.id)}, baseurl);
    
                    if (!response.ok)
                    {
                        alert(`An error occured: ${response.status}`);
                    }
                    newtagids.push(newtag.id)
                }
                else
                {
                    const tagcreatebody =
                    {
                        "tag":newtag.tag,
                        "photos":[]
                    };
                    const tagresponse = await tagPOST(tagcreatebody, baseurl);
        
                    if (!tagresponse.ok)
                    {
                        alert(`An error occured: ${tagresponse.status}`);
                    }
                    const tagresponsejson = await tagresponse.json();

                    newtagids.push(tagresponsejson.id);
                }
            };
        
        return newtagids;
    };

    const photodelbutton = function()
    {   
        return(
            <svg className={styles.PhotoDel} onClick={function(){setButClicked(true);setFileUploaded(false);}} viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"/></svg>
        );
    };

    const tagdelbutton = function(x)
    {   
        return(
            <svg className={styles.TagDel} onClick={function(){unbindTag(x);}} viewBox="0 0 24 24" width="12" height="12" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"/></svg>
        );
    };

    const upimgpreview = function()
    {
        setFileUploaded(true);
        setUploadedImage(photoRef.current.files[0]);
    };

    const photoimage = function(){
        if (photoID && !editMode)
        {
            return(
                <section className={styles.PhotoSection}>
                    <img className={styles.PhotoFile} src={imagePath} alt={`Photo ${photoID}`}/>
                </section>
        );
        }
        else if (photoID && !butClicked)
        {
            return(<section className={styles.PhotoSection}>
                    <img className={styles.PhotoFile} src={imagePath} alt={`Photo ${photoID}`}/>
                    {photodelbutton()}
                   </section>)
        }
        else if (fileUploaded)
        {   return(<section className={styles.PhotoSection}><img className={styles.PhotoFile} src={URL.createObjectURL(uploadedImage)} alt={`Uploaded photo`}/>{photodelbutton()}</section>)
        }
        else
        {
            return(<section className={styles.PhotoSection}><input type="file" id="uploader" ref={photoRef} onChange={upimgpreview} /*value ="Upload a photo..." */accept="image/jpeg, image/jpg" className={styles.Uploader}/><label htmlFor="uploader" className={styles.UploaderLabel}>Upload a photo...</label></section>)

        };
    };
    
    
    const photocaption = function(){
        if (photoID && !editMode)
        {
            return(<h1 className={styles.Caption}>{caption}</h1>);
        }
        else if (editMode)
        {
            return(<input type="text" className={styles.Caption} value={caption} onChange={editCaption}/>);
        }
        else
        {
            return(<input type="text" className={styles.Caption} placeholder="Enter the caption..." onChange={editCaption}/>);
        }
    };

    const photodescription = function()
    {
        if (photoID && !editMode)
        {
            return(description != "" && <div className={styles.DescContainer}><p className={styles.Description}>{description}</p></div>)
        }
        else if (editMode)
        {
            return(<div className={styles.DescContainer}><textarea className={styles.Description} value={description} onChange={editDescription}/></div>)
        }
        else
        {
            return(<div className={styles.DescContainer}><textarea className={styles.Description} placeholder={"Enter description..."} onChange={editDescription}/></div>)
        }
    };
        
    const phototags = function()
    {
            if (photoID && !editMode && !tagsLoading && !tagsError && tags)
            {
                return(
                    <div className={styles.Tags}>
                        {thisPhotoTags.map(x => <div key={x.id} className={styles.TagAndDel} onClick={function(){navigate(`/tag/${x.id}`)}}>{x.tag}</div>)}
                    </div>
        
                )
            }
            else
            {
                return(
                    <section className={styles.Tags}>
                        {thisPhotoTags.map(x => <div key={x.id} className={styles.TagAndDel}><div onClick={function(){if(x.id!=null){navigate(`/tag/${x.id}`)}}}>{x.tag}</div><div>{tagdelbutton(x)}</div></div>)}
                        <div className={styles.TagFieldWithDropdown}>
                            <input value={newTag} onFocus={function(e){if(e.target.value == "Enter a tag..."){setNewTag("")};}} onChange={function(e){enterTag(e);setIfTagDropdown(true);}} onBlur={function(){setTimeout(function(){setIfTagDropdown(false)}, 150)}}></input>
                            {iftagDropdown && newTag!="" && tagDropdown()}
                        </div>
                    </section>
                )
            }
            /*else
            {
                return(
                    <div className={styles.Tags}>
                        <input type="text" value={newTag} onChange={enterTag}></input>
                    </div>
        
                )
            };*/
    };

    const photoexif = function()
    {
        if (photoID && !editMode && !isLoading && !fetchError && (photo.exposure || photo.apperture || photo.iso))
            {
                return(
                    <div className={styles.EXIFContainer}>
                        <fieldset>
                            <legend></legend>
                            <dl className={styles.EXIF}>
                                {photo.exposure && <dt>Shutterspeed: </dt>}
                                {photo.exposure && <dd>{photo.exposure}</dd>}

                                {photo.apperture && <dt>Apperture: </dt>}
                                {photo.apperture && <dd>f/{photo.apperture}</dd>}
                                {photo.iso && <dt>ISO: </dt>}
                                {photo.iso && <dd>{photo.iso}</dd>}
                            </dl>
                        </fieldset>
                    </div>
                );
            }
            else
            {
                return(
                    <></>
                );
            };
    };

    const sortordercontrols = function()
    {
        if ((photoID && !isPending && editMode) || (!photoID && !isPending))
        {
            return(
                <div className={styles.SortorderButtons}>
                    <button className={styles.SortorderUpButton} onClick={function(){editSortOrder(-1)}}><span>↑</span></button>
                    <button className={styles.SortorderDownButton} onClick={function(){editSortOrder(1)}}><span>↓</span></button>
                </div>
            );
        }
    }

    const edilete = function()
    {

        if (photoID && !isPending && !editMode)
        {
            return(
                <div className={styles.EdileteButtons}>
                    <Link to={`/photo/${photoID}/edit`} className={styles.PhotoEditLink}><button className={styles.PhotoEditButton}>Edit</button></Link>
                    <button className={styles.PhotoDeleteButton} onClick={handleDelete}>Delete</button>
                </div>
            );
        }
        else if (!isPending && editMode)
        {
            return(
                <div className={styles.EdileteButtons}>
                    <button className={styles.PhotoSaveButton} onClick={async function(){setIsPending(true); await handleUpdate();}}>Save</button>
                    <Link to={`/photo/${photoID}`} className={styles.PhotoDiscardLink}><button className={styles.PhotoDiscardButton}>Discard</button></Link>
                </div>
            );
        }
        else if (!isPending)
        {   
            return(
                <div className={styles.EdileteButtons}>
                    <button className={styles.PhotoSaveButton} onClick={async function(){setIsPending(true); await handleUpdate()}}>Upload</button>
                    <Link to={`/`} className={styles.PhotoDiscardLink}><button className={styles.PhotoDiscardButton}>Discard</button></Link>
                </div>
            );
        }
        else
        {
            return(
                <div className={styles.EdileteButtons}>
                    <button className={styles.PhotoLoadingButton}>Loading...</button>
                </div>
            );
        }
    };

    if (!isLoading && !fetchError && !tagsLoading && !tagsError && isPhoto &&!notFetched)
    {
        return(
            <div className={styles.PhotoPage}>
                {isPending && blocker()}
                <section className={styles.PhotoSection}>
                        {photoimage()}
                </section>
                <section className={styles.DiscSection}>
                    {photocaption()}
                    {photodescription()}
                    <div className={styles.Placeholder}></div>
                    {phototags()}
                    {photoexif()}
                    {localStorage.getItem("currentUserRoles") && localStorage.getItem("currentUserRoles").includes("Admin") && (localStorage.getItem("expires") - new Date(Date.now()).getTime() > 0) && sortordercontrols()}
                    {localStorage.getItem("currentUserRoles") && localStorage.getItem("currentUserRoles").includes("Admin") && (localStorage.getItem("expires") - new Date(Date.now()).getTime() > 0) && edilete()}
                </section>
            </div>
        );
    }
    else if (!isPhoto && localStorage.getItem("currentUserRoles") && localStorage.getItem("currentUserRoles").includes("Admin") && (localStorage.getItem("expires") - new Date(Date.now()).getTime() > 0))
    {
        return(
            <div className={styles.PhotoPage}>
                {isPending && blocker()}
                <section className={styles.PhotoSection}>
                        {photoimage()}
                </section>
                <section className={styles.DiscSection}>
                    {photocaption()}
                    {photodescription()}
                    <div className={styles.Placeholder}></div>
                    {phototags()}
                    {photoexif()}
                    {localStorage.getItem("currentUserRoles") && localStorage.getItem("currentUserRoles").includes("Admin") && (localStorage.getItem("expires") - new Date(Date.now()).getTime() > 0) && sortordercontrols()}
                    {localStorage.getItem("currentUserRoles") && localStorage.getItem("currentUserRoles").includes("Admin") && (localStorage.getItem("expires") - new Date(Date.now()).getTime() > 0) && edilete()}
                </section>
            </div>
        );
    }
    else if (!notFetched && !fetchError)
    {
        return (
        <Loading></Loading>
            );
    }
    else
    {
        return(<Error404></Error404>);
    };
};

Photo.propTypes =
{
    isPhoto: PropTypes.bool
};

export default Photo