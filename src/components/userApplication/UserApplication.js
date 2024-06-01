
import { useEffect, useState } from "react";

import useServices from "../../services/Services";
import Spinner from "../spinner/Spinner";

import "./userApplication.scss"

const UserApplication = () => {
    const [applications, setApplications] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [officeInfo, setOfficeInfo] = useState(null);
    const [officeLoading, setOfficeLoading] = useState(false);

    const token = localStorage.getItem("token");

    const { getApplicationsByToken, getUserByToken, updateApplication, getOfficeById, _apiBase } = useServices();

    useEffect(() => {
        fetchApplications();
        fetchUserInfo();
    }, []);

    const fetchUserInfo = () => {
        const token = localStorage.getItem("token");
        getUserByToken(token).then(data => {
            setUserInfo(data);
        }).catch(err => {
            console.error("Error fetching user info:", err);
        });
    };

    const fetchApplications = () => {
        setLoading(true);
        getApplicationsByToken(token).then(data => {
            if (data.message) {
                setApplications([]);
            } else {
                setApplications(data);
            }
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching applications:", err);
            setLoading(false);
        });
    }

    const handleStatusChange = (appId, statusId) => {
        updateApplication(appId, statusId).then(() => {
            alert(statusId === 2 ? "Заявка одобрена" : "Заявка отменена");
            fetchApplications();
        }).catch(err => {
            console.error("Error updating application:", err);
        });
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleOfficeClick = (officeId) => {
        setOfficeLoading(true);
        getOfficeById(officeId).then(data => {
            setOfficeInfo(data);
            setOfficeLoading(false);
        }).catch(err => {
            console.error("Error fetching office info:", err);
            setOfficeLoading(false);
        });
    };

    const sortApplications = (apps) => {
        return apps.sort((a, b) => {
            if (a.status === 1 && b.status !== 1) return -1;
            if (a.status !== 1 && b.status === 1) return 1;
            return 0;
        });
    };

    const filteredApplications = Array.isArray(applications) ? sortApplications(applications).filter(app => {
        if (filterStatus === "all") return true;
        if (filterStatus === "inProcess" && app.status === 1) return true;
        if (filterStatus === "cancelled" && app.status === 0) return true;
        if (filterStatus === "approved" && app.status === 2) return true;
        return false;
    }) : [];

    const getStatusText = (status) => {
        switch (status) {
            case 1:
                return "В процессе";
            case 0:
                return "Отменена";
            case 2:
                return "Одобрена";
            default:
                return "Неизвестен";
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 1:
                return "text-warning";
            case 0:
                return "text-danger";
            case 2:
                return "text-success";
            default:
                return "";
        }
    };

    return (
        <>
            <div className="application-wrapper col-12 col-md-7 col-xxl-8 my-4 my-sm-1 my-lg-3 my-xl-4">
                <div className="filter col-12">
                    <select onChange={handleFilterChange} className="form-select rounded-0" aria-label="Default select example">
                        <option value="all">Все</option>
                        <option value="inProcess">В процессе</option>
                        <option value="cancelled">Отменена</option>
                        <option value="approved">Одобрена</option>
                    </select>
                </div>
                {loading ? (
                    <div className="text-center mt-4">
                        <Spinner />
                    </div>
                ) : (
                    filteredApplications.length === 0 ? (
                        <div className="wrapper text-center mt-2">
                            <h5>Заявок нет</h5>
                        </div>
                    ) : (
                        filteredApplications.map(app => (
                            <div key={app.id} className="wrapper-application wrapper col-12 d-flex flex-wrap align-items-start justify-content-between">
                                <div className="wrapper-application-id col-5 col-xxl-1 pe-2 pb-2">
                                    <h6>ID:</h6>
                                    <h5>{app.id}</h5>
                                </div>
                                <div className="wrapper-application-lastName col-7 col-xxl-2 pe-2 pb-2">
                                    <h6>Фамилия:</h6>
                                    <h5>{userInfo.lastName}</h5>
                                </div>
                                <div className="wrapper-application-firstName col-5 col-xxl-2 pe-2 pb-2">
                                    <h6>Имя:</h6>
                                    <h5>{userInfo.firstName}</h5>
                                </div>
                                <div className="wrapper-application-phone col-7 col-xxl-2 pe-2 pb-2">
                                    <h6>Моб. тел:</h6>
                                    <h5><a style={{ textDecoration: "underline" }} href={`tel:+${String(userInfo.tel).replace("-", "")}`}>+{userInfo.tel}</a></h5>
                                </div>
                                <div className="wrapper-application-office col-5 col-xxl-1 pe-2 pb-2">
                                    <h6>Офис:</h6>
                                    <h5 
                                        style={{ textDecoration: "underline", cursor: "pointer" }}
                                        data-bs-toggle="modal"
                                        data-bs-target="#modalApplication" 
                                        onClick={() => handleOfficeClick(app.id_office)}  
                                    >{app.id_office}</h5>
                                </div>
                                <div className={`wrapper-application-status col-7 col-xxl-2 pe-2 pb-2 ${getStatusClass(app.status)}`}>
                                    <h6>Статус:</h6>
                                    <h5 style={{ textDecoration: "underline" }}>{getStatusText(app.status)}</h5>
                                </div>
                                {app.status === 1 && (
                                    <div className="wrapper-application-controls col-12 col-xxl-1 text-start">
                                        <div
                                            className="btn btn-outline-danger my-2 rounded-0 col-12 col-xxl-8"
                                            onClick={() => handleStatusChange(app.id, 0)} 
                                        >
                                            <i className="bi fa-lg bi-x-lg"></i>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )
                )}
            </div>
            <ViewModal officeLoading={officeLoading} officeInfo={officeInfo} _apiBase={_apiBase}/>
        </>
    )
}

const ViewModal = ({officeLoading, officeInfo, _apiBase}) => {

    return (
        <div className="modal" id="modalApplication" tabIndex="-1" aria-labelledby="modalApplicationeLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-body">
                        <div style={{ cursor: "pointer", top: "10px", right: "20px", borderRadius: "0.3rem" }} className="btn btn-outline-dark position-absolute" data-bs-dismiss="modal" aria-label="close">
                            <i className="bi fa-lg bi-x-lg"></i>
                        </div>
                        {officeLoading ? (
                            <div className='text-center py-3'>
                                <Spinner />
                            </div>
                        ) : officeInfo ? (
                            <>
                                <div id="carouselIndicators" className="carousel carousel-dark slide col-12" data-bs-ride="carousel">
                                    <div className="carousel-inner">
                                        {officeInfo.photos.map((photo, index) => (
                                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                <img src={`${_apiBase}/${photo}`} className="d-block w-100" alt={`Office ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselIndicators" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target="#carouselIndicators" data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    </button>
                                </div>
                                <div className="modal-body-options col-12 pt-2">
                                    <h5>Параметры объекта:</h5>
                                    <h6 style={{ whiteSpace: 'pre-wrap' }}>{officeInfo.options}</h6>
                                </div>
                                <div className="modal-body-description col-12 pt-2">
                                    <h5>Описание:</h5>
                                    <h6 style={{ whiteSpace: 'pre-wrap' }}>{officeInfo.description}</h6>
                                </div>
                                <div className="modal-body-details col-12 pt-2">
                                    <h5>Детали:</h5>
                                    <h6>Площадь: {officeInfo.area} м²</h6>
                                    <h6>Цена: {officeInfo.price} BYN</h6>
                                    <h6>Адрес: {officeInfo.address}</h6>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-3">
                                <h5>Информация об офисе не найдена</h5>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserApplication;