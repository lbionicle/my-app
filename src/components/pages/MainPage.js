import AppChat from "../appChat/AppChat";
import MainHeader from "../mainHeader/MainHeader";
import AppCheckToken from "../appCheckToken/AppCheckToken";

const MainPage = ({userRole}) => {

    return (
        <AppCheckToken>
            <MainHeader userRole={userRole}/>
            <AppChat userRole={userRole}/>
        </AppCheckToken>
    )
}

export default MainPage;