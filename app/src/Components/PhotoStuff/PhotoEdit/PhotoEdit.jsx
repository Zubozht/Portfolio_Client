import Photo from '../Photo/Photo.jsx';

function PhotoEdit()
{
    return(
        <>
            {localStorage.getItem("currentUserRoles") && localStorage.getItem("currentUserRoles").includes("Admin") && <Photo editMode={true}></Photo>}
        </>
    );
}

export default PhotoEdit