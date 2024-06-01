import { useState } from "react";
import useServices from "../../services/Services";
import { useNavigate } from "react-router-dom";

import AuthHeader from "../authHeader/AuthHeader";
import AppLogin from "../appLogin/AppLogin";
import AppRegister from "../appRegister/AppRegister";

import "./appAuth.scss"


const AppAuth = ({onLogin}) => {

    const [stage, setStage] = useState("login");
    const { login, register } = useServices();
    const navigate = useNavigate();

    const regUser = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        data.age = +data.age;
        register(data)
        .then(json => {
            if (!json.detail) {
                localStorage.setItem("token", json.token);
                onLogin("User");
                navigate("/main");
            } else {
                alert(json.detail);
            }
        })
        .catch(err => console.error("Error during registration:", err));
    };

    const loginUser = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        login(data)
        .then(json => {
            if (!json.detail) {
                localStorage.setItem("token", json.token);
                onLogin(json.role);
                navigate("/main");
            } else {
                alert(json.detail);
            }
        })
        .catch(err => console.error("Error during login:", err));
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container col-11 col-lg-4 rounded-2">
                <AuthHeader stage={stage} setStage={setStage}/>
                {stage === "login" ? <AppLogin loginUser={loginUser} /> : <AppRegister regUser={regUser} />}
            </div>
        </div>
    );
}

export default AppAuth;