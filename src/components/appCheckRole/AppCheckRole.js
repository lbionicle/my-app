import AppNotAdmin from "../appNotAdmin/AppNotAdmin";

const AppCheckRole = (props) => {

    return (
        <>
            {
            (localStorage.getItem("userRole") === "Admin") ?
            <>
                {props.children}
            </>  
            : 
            <AppNotAdmin/>
            }

        </>
    )
}

export default AppCheckRole;