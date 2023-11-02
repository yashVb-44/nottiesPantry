import React, { useEffect, useState } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";


let url = process.env.REACT_APP_API_URL

const AddVariation = ({ handleCloseModal, variations, setVariations }) => {

    const adminToken = localStorage.getItem('token');
    // const colors = [
    //     "Red", "Yellow", "Blue", "Black", "Orange", "White", "Purple", "Pink",
    //     "Brown", "Maroon", "Magenta", "Gold", "Mustard", "Lemon", "Beige", "Silver",
    //     "Cream", "Green", "Gray", "Navy Blue", "Violet", "Indigo", "Lime", "Olive",
    //     "Aqua", "Turquoise"
    // ]

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

    const [variationName, setVariationName] = useState("");
    const [variationImages, setVariationImages] = useState([]);
    const [sizeInputs, setSizeInputs] = useState([
        {
            index: 1, size: "", stock: 0, disc_pirce: 0, r1_quan: 0, r2_quan: 0, r3_quan: 0, r4_quan: 0,
            user_price: 0, r1_price: 0, r2_price: 0, r3_price: 0, r4_price: 0,
        }
    ]);
    const [imagePreviews, setImagePreviews] = useState([]);


    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setVariationImages((prevVariationImages) =>
            prevVariationImages.concat(files)
        );
        setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const handleAddSizeInput = () => {
        const newSizeInput = {
            index: sizeInputs.length + 1,
            size: "",
            stock: 0,
            disc_pirce: 0,
            r1_quan: 0,
            r2_quan: 0,
            r3_quan: 0,
            r4_quan: 0,
            user_price: 0,
            r1_price: 0,
            r2_price: 0,
            r3_price: 0,
            r4_price: 0,
        };
        setSizeInputs([...sizeInputs, newSizeInput]);
    };

    const handleRemoveSizeInput = (index) => {
        const updatedSizeInputs = sizeInputs.filter(
            (sizeInput) => sizeInput.index !== index
        );
        setSizeInputs(updatedSizeInputs.map((sizeInput, i) => ({ ...sizeInput, index: i + 1 })));
    };

    const handleAddVariation = (e) => {
        e.preventDefault();

        const newVariation = {
            name: variationName,
            images: variationImages,
            sizes: sizeInputs,
        };

        setVariations([...variations, newVariation]);

        setVariationName("");
        setVariationImages([]);
        setSizeInputs([{
            index: 1, size: "", stock: 0, disc_pirce: 0, r1_quan: 0, r2_quan: 0, r3_quan: 0, r4_quan: 0,
            user_price: 0, r1_price: 0, r2_price: 0, r3_price: 0, r4_price: 0,
        }]);
        setImagePreviews([]);

        handleCloseModal();
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
                                        <h4 className="mb-0">Add Variation</h4>
                                        <i
                                            className="fas fa-window-close"
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={handleCloseModal}
                                        ></i>
                                    </div>
                                    <form onSubmit={handleAddVariation}>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Color Name:
                                            </label>
                                            <div className="col-md-10">
                                                <select
                                                    required
                                                    className="form-select"
                                                    id="subcategory-select"
                                                    value={variationName}
                                                    onChange={(e) => {
                                                        setVariationName(e.target.value);
                                                    }}
                                                >
                                                    <option value="">Select Color</option>
                                                    {colors.map((color) => (
                                                        <option key={color?.name} value={color?.name}>
                                                            {color?.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Color Images:
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
                                                        required
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

                                        {sizeInputs.map((sizeInput, index) => (
                                            <div className="mb-3 row" key={sizeInput.index}>
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                    style={{ fontWeight: "bold", textDecoration: "underline" }}
                                                >
                                                    Size {sizeInput.index}:
                                                </label>
                                                <div className="col-md-2">
                                                    Size
                                                    <select
                                                        required
                                                        className="form-select"
                                                        id="subcategory-select"
                                                        value={sizeInput.size}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].size = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    >
                                                        <option value="">Select Size</option>
                                                        {sizes?.map((size => {
                                                            return (<option key={size?.name} value={size?.name}>{size?.name}</option>)
                                                        }))}
                                                        {/* <option value="One Size">One Size</option>
                                                        <option value="Unstitched Material">UNSTITCHED MATERIAL</option>
                                                        <option value="xs">xs</option>
                                                        <option value="s">s</option>
                                                        <option value="m">m</option>
                                                        <option value="l">l</option>
                                                        <option value="xl">xl</option>
                                                        <option value="xxl">xxl</option> */}
                                                    </select>
                                                </div>
                                                <div className="col-md-2">
                                                    Stock
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.stock}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].stock = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    Original Price
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.disc_pirce}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].disc_pirce = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div></div>

                                                <div className="col-md-2 mt-4">
                                                    Minimum Quantity:
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    Premium Bulk Buyer
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r1_quan}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r1_quan = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    Bulk Buyer
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r2_quan}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r2_quan = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    Premium Reseller
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r3_quan}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r3_quan = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    Reseller
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r4_quan}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r4_quan = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div></div>

                                                <div className="col-md-2 mt-4">
                                                    Price:-
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    User
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.user_price}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].user_price = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    Premium Bulk Buyer
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r1_price}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r1_price = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    Bulk Buyer
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r2_price}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r2_price = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    Premium Reseller
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r3_price}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r3_price = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    Reseller
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r4_price}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r4_price = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                {sizeInputs.length > 1 && (
                                                    <div className="col-md-1">
                                                        <i
                                                            className="fa fa-times mt-4"
                                                            style={{ fontSize: "34px", cursor: "pointer", color: "red" }}
                                                            onClick={() => handleRemoveSizeInput(sizeInput.index)}
                                                        ></i>
                                                    </div>
                                                )}
                                                {index === sizeInputs.length - 1 && (
                                                    <>
                                                        <div className="col-md-1">
                                                            <i
                                                                className="fa fa-plus mt-4"
                                                                style={{ fontSize: "32px", cursor: "pointer", color: "#5b73e8" }}
                                                                onClick={handleAddSizeInput}
                                                            ></i>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}

                                        <div className="d-flex flex-reverse flex-wrap gap-2">
                                            <a className="btn btn-danger" onClick={handleCloseModal}>
                                                <i className="fas fa-window-close"></i> Cancel{" "}
                                            </a>
                                            <button className="btn btn-success" type="submit">
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

export default AddVariation;
