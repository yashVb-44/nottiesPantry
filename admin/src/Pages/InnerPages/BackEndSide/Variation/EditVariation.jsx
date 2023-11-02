import React, { useState, useEffect } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";

const url = process.env.REACT_APP_API_URL

// const color = [
//     "Red", "Yellow", "Blue", "Black", "Orange", "White", "Purple", "Pink",
//     "Brown", "Maroon", "Magenta", "Gold", "Mustard", "Lemon", "Beige", "Silver",
//     "Cream", "Green", "Gray", "Navy Blue", "Violet", "Indigo", "Lime", "Olive",
//     "Aqua", "Turquoise"
// ]


const EditVariation = ({ handleCloseModal, selectedVariation, handleVariationUpdate }) => {
    const adminToken = localStorage.getItem('token');
    const [variationName, setVariationName] = useState(selectedVariation?.variation_Name || "");
    const [variationImages, setVariationImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState(
        selectedVariation?.variation_Images?.map((image) => image) || []
    );
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState([])

    useEffect(() => {
        async function getColor() {

            try {
                const res = await axios.get(`${url}/product/color/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );

                setColors(res?.data?.color || []);
            } catch (error) {
            }
        }

        async function getSize() {

            try {
                const res = await axios.get(`${url}/product/size/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );

                setSizes(res?.data?.size || []);
            } catch (error) {
            }
        }

        getColor();
        getSize()
    }, []);



    useEffect(() => {
        setVariationName(selectedVariation?.variation_Name || "");
        setVariationImages([]);
        setImagePreviews(
            selectedVariation?.variation_Images?.map((image) => image) || []
        );
    }, []);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setVariationImages(files);
        setImagePreviews(files?.map((file) => URL.createObjectURL(file)));
    };

    const handleUpdateVariation = async (e) => {
        e.preventDefault();
        setLoading(true)
        setButtonDisabled(true)

        if (!variationName && variationImages.length === 0) {
            console.log("Please provide variation name and images.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("Variation_Name", variationName);
            variationImages.forEach((image) => formData.append("images", image));

            const response = await axios.put(
                `${url}/product/variation/update/${selectedVariation._id}`,
                formData,
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedVariation = response?.data?.type
            console.log(updatedVariation);
            handleVariationUpdate();

            handleCloseModal();
        } catch (error) {
            console.error("Error updating variation:", error);
        }
        finally {
            setLoading(false)
            setButtonDisabled(false)
        }
    };

    return (
        <div className="main-content-model dark">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card model-card">
                                <div className="card-body">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 className="mb-0">Edit Variation</h4>
                                        {loading && <div className="loader">Loading...</div>}
                                        <i
                                            className="fas fa-window-close"
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={handleCloseModal}
                                        ></i>
                                    </div>
                                    <form onSubmit={handleUpdateVariation}>
                                        <div className="mb-3 row">
                                            <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                Variation Name:
                                            </label>
                                            <div className="col-md-10">
                                                <select
                                                    required
                                                    className="form-select"
                                                    id="subcategory-select"
                                                    value={variationName}
                                                    onChange={(e) => {
                                                        setVariationName(e.target.value)
                                                    }}
                                                >
                                                    <option value="">Select Size</option>
                                                    {colors?.map(color => {
                                                        return (
                                                            <option key={color?.name} value={color?.name}>{color?.name}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                Variation Images:
                                                <div className="imageSize">(Recommended Resolution:
                                                    W-971 X H-1500,
                                                    W-1295 X H-2000,
                                                    W-1618 X H-2500 )</div>
                                            </label>
                                            <div className="col-md-10">
                                                <div className="fileupload_block">
                                                    <input
                                                        type="file"
                                                        max={5}
                                                        name="banner_image"
                                                        className="form-control"
                                                        multiple
                                                        onChange={handleFileSelect}
                                                        id="example-text-input"
                                                    />
                                                </div>
                                                <div className="fileupload_img col-md-10 mt-3">
                                                    {imagePreviews.length <= 0 && (
                                                        <img
                                                            type="image"
                                                            src={defualtImage}
                                                            alt="product image"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    )}
                                                    {imagePreviews?.map((preview, index) => (
                                                        <img
                                                            key={index}
                                                            src={preview}
                                                            alt="Preview"
                                                            style={{ marginTop: "15px", marginLeft: "15px" }}
                                                            height={100}
                                                            width={100}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-reverse flex-wrap gap-2">
                                            <a className="btn btn-danger" onClick={handleCloseModal}>
                                                <i className="fas fa-window-close"></i> Cancel{" "}
                                            </a>
                                            <button className="btn btn-success" type="submit" disabled={buttonDisabled}>
                                                <i className="fas fa-save"></i> Save{" "}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditVariation;
