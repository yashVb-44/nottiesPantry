import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridPagination, GridToolbarExport } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Modal from "react-modal";
import ImageModel from "../../../../Components/ImageComp/ImageModel";
import EditCustomerSupport from "./EditCustomerSupport";
// import ViewsPostCustomerSupport from "./ViewsPostCustomerSupport";


let url = process.env.REACT_APP_API_URL

const ShowCustomerSupport = () => {

    const adminToken = localStorage.getItem('token');

    const [requirementData, setCustomerSupportData] = useState([]);
    const [requirementName, setCustomerSupportName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)

    // for big image
    const [selectedImage, setSelectedImage] = useState("");
    const [isModalOpenforImage, setIsModalOpenforImage] = useState(false);

    const handleImageClick = (imageURL) => {
        setSelectedImage(imageURL);
        setIsModalOpenforImage(true);
    };

    const Navigate = useNavigate()
    const dispatch = useDispatch()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState()

    useEffect(() => {
        Modal.setAppElement(document.body);
    }, []);

    const handleOpenModal = (data) => {
        setSelectedForm(data)
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const localeText = {
        noRowsLabel: "No Data Found 😔",
    };

    const columns = [
        {
            field: "_id",
            width: 300,
            headerName: "Id",
        },
        {
            field: "orderId",
            headerName: "Order Id",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "User_Name",
            headerName: "User Name",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "User_Mobile_No",
            headerName: "Mobile No",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "subject",
            headerName: "Subject",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "CustomerSupport_Images",
            headerName: "Image",
            width: 150,
            renderCell: (params) => (
                <img
                    src={params?.row?.CustomerSupport_Images}
                    alt="CustomerSupport Image"
                    height={35}
                    width={35}
                    style={{ borderRadius: '50%', cursor: "pointer" }}
                    onClick={() => handleImageClick(params?.row?.CustomerSupport_Images)}
                />
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: "Date",
            headerName: "Date",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleCustomerSupportDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    <IconButton
                        aria-label="edit"
                        onClick={() => handleOpenModal(params.row)}
                    >
                        <i class="fas fa-pencil-alt font-size-16 font-Icon-Up"></i>
                    </IconButton>
                </Stack>
            ),
            filterable: false,
            sortable: false,
            hide: false,
        },
    ];

    useEffect(() => {
        async function getCustomerSupport() {

            try {
                const res = await axios.get(`${url}/feedback/get/all`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );

                setCustomerSupportData(res?.data?.customerSupport || []);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getCustomerSupport();
    }, [selectedForm]);


    const handleCustomerSupportDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {

                axios
                    .delete(`${url}/requirement/delete/${id}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        })
                    .then(() => {
                        setCustomerSupportData(requirementData.filter((d) => d?._id !== id));
                        Swal.fire("Success!", "CustomerSupport has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "CustomerSupport has not been deleted!", "error");
                    });
            }
        });
    };


    const handleMultipleCustomerSupportDelete = () => {
        let idsToDelete = selectedRows

        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {

                axios
                    .delete(`${url}/requirement/deletes`, {
                        data: { ids: idsToDelete },
                        headers: {
                            Authorization: `${adminToken}`,
                        }
                    })
                    .then(() => {
                        setCustomerSupportData(requirementData?.filter((d) => !idsToDelete?.includes(d?._id)));
                        Swal.fire("Success!", "CustomerSupport has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "CustomerSupport has not been deleted!", "error");
                    });
            }
        });
    };

    const handleFilter = () => {
        const filteredCustomerSupportList = requirementData?.filter((requirement) => {
            const formattedCustomerSupportName = (requirement?.name || "").toUpperCase().replace(/\s/g, "");
            let isCustomerSupportName = true;
            if (requirementName) {
                isCustomerSupportName = formattedCustomerSupportName.includes(requirementName.toUpperCase().replace(/\s/g, ""));
            }

            return isCustomerSupportName;
        });

        // Apply search query filtering
        const filteredData = filteredCustomerSupportList.filter((requirement) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(requirement);
            for (let i = 0; i < rowValues.length; i++) {
                const formattedRowValue = String(rowValues[i]).toUpperCase().replace(/\s/g, "");
                if (formattedRowValue.includes(formattedSearchQuery)) {
                    return true;
                }
            }
            return false;
        });

        return filteredData;
    };
    const getRowId = (row) => row._id;

    const handleCellClick = (params, event) => {
        if (event.target.type !== "checkbox") {
            event.stopPropagation();
        }
    };

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-2 table-heading">
                                CustomerSupport List
                            </div>
                            <div className="searchContainer mb-3">
                                <div className="searchBarcontainer">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="searchBar"
                                    />
                                    <ClearIcon className="cancelSearch" onClick={() => setSearchQuery("")} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="">
                                    <div className="datagrid-container">
                                        <DataGrid
                                            style={{ textTransform: "capitalize" }}
                                            rows={handleFilter()}
                                            columns={columns}
                                            checkboxSelection
                                            disableSelectionOnClick
                                            getRowId={getRowId}
                                            filterPanelDefaultOpen
                                            filterPanelPosition="top"
                                            slots={{
                                                toolbar: (props) => (
                                                    <div>
                                                        <GridToolbar />
                                                    </div>
                                                ),
                                            }}
                                            localeText={localeText}
                                            loading={isLoading}
                                            onCellClick={handleCellClick}
                                            onRowSelectionModelChange={(e) => setSelectedRows(e)}
                                            initialState={{
                                                pagination: { paginationModel: { pageSize: 10 } },
                                            }}
                                            pageSizeOptions={[10, 25, 50, 100]}
                                        />
                                        {selectedRows.length > 0 && (
                                            <div className="row-data">
                                                <div>{selectedRows.length} Categories selected</div>
                                                <DeleteIcon
                                                    style={{ color: "red" }}
                                                    className="cursor-pointer"
                                                    onClick={() => handleMultipleCustomerSupportDelete()}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                className="main-content dark"
                isOpen={isModalOpenforImage}
            >

                <ImageModel
                    isOpen={isModalOpenforImage}
                    onClose={() => setIsModalOpenforImage(false)}
                    imageURL={selectedImage}
                />
            </Modal>

            <Modal
                className="main-content dark"
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
            >
                <EditCustomerSupport
                    handleCloseModal={handleCloseModal}
                    selectedForm={selectedForm}
                />
            </Modal>
        </>
    );
};

export default ShowCustomerSupport;
