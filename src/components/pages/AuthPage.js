import AppAuth from "../appAuth/AppAuth";


const AuthPage = ({onLogin}) => {

    return (
        <AppAuth onLogin={onLogin}/>
    )
}

export default AuthPage;