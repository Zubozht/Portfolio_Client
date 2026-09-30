import Tag from '../Tag/Tag.jsx'

function TagEdit()
{
    return(
        <>
            {localStorage.getItem("currentUserRoles") && localStorage.getItem("currentUserRoles").includes("Admin") && <Tag editMode={true}></Tag>}
        </>
    );
};

export default TagEdit;