import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../../Components/AlertComp/AlertBox"
import { useSelector } from "react-redux";


let url = process.env.REACT_APP_API_URL

const EditSpecification = () => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate()
    const selectedSpecification = useSelector((state) => state?.DataChange?.payload)

    const [specificationType, setSpecificationType] = useState(selectedSpecification?.Data_Type)
    const [specificationName, setSpecificationName] = useState(selectedSpecification?.Data_Name);
    const [dataAddStatus, setSpecificationAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (specificationName !== "") {

            try {
                let response = await axios.put
                    (
                        `${url}/data/update/${selectedSpecification?._id}`,
                        {
                            Data_Name: specificationName,
                            Data_Type: specificationType
                        },
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        }
                    );
                if (response.data.type === "success") {
                    setSpecificationAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                    setSpecificationName("");
                    setTimeout(() => {
                        Navigate('/showSpecification');
                    }, 900);
                } else {
                    setSpecificationAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setSpecificationAddStatus("error");
                let alertBox = document.getElementById('alert-box')
                alertBox.classList.add('alert-wrapper')
                setStatusMessage("Specification not Update!");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSpecificationAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById('alert-box')
            alertBox?.classList?.remove('alert-wrapper')
        }, 1500);

        return () => clearTimeout(timer);
    }, [dataAddStatus, statusMessage]);


    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Edit Specification</h4>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Specification Type :
                                                </label>
                                                <div className="col-md-10">
                                                    <select
                                                        required
                                                        className="form-select"
                                                        id="subcategory-select"
                                                        value={specificationType}
                                                        onChange={(e) => setSpecificationType(e.target.value)}
                                                    >
                                                        <option value="Transport">Transport</option>
                                                        <option value="Courier">Courier</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Specification Name :
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={specificationName}
                                                        onChange={(e) => {
                                                            setSpecificationName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a className="btn btn-danger" onClick={() => Navigate('/showSpecification')}>
                                                            {" "}
                                                            <i className="fas fa-window-close"></i> Cancel{" "}
                                                        </a>
                                                        <button className="btn btn-success" type="submit">
                                                            {" "}
                                                            <i className="fas fa-save"></i> Save{" "}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AlertBox status={dataAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default EditSpecification;
