import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Layout from "../components/Layout/Layout";

const UpdateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [productPictures, setProductPictures] = useState([]);
  const [number, setNumber] = useState("");
  const [price, setPrice] = useState("");

  const [id, setId] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  //get single product
  const getSingleUser = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/auth/single-user/${params.slug}`
      );
      setName(data.user.name),
        setId(data.user._id),
        setEmail(data.user.email),
        setNumber(data.user.description),
        setPassword(data.user.quantity);
        setPrice(data.user.price);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleUser();
    //eslint-disable-next-line
  }, []);

  const handleProductPictures = (e) => {
    setProductPictures([...productPictures, e.target.files[0]]);
  };
  //create product funnctions

  const handleUpdate = async(e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("email", email);
      productData.append("password", password);
      productData.append("number", number);
      productData.append("price", price);

      for (let pic of productPictures) {
        productData.append("productPicture", pic);
      }
      const res = await axios.put(`/api/v1/auth/update-user/${id}`, productData);
      console.log(res);
      if (res?.data?.success) {
        toast.success("User Updated Successfully");
        navigate("/");
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <>
      <Layout title={"Dashboard - Update Product"}>
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-9">
              <h3>Update Product</h3>
              <div className="m-1 w-75">
                <div className="mb-3">
                  <label>Prodcut</label>
                  <input
                    type="text"
                    value={name}
                    placeholder="name"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {/* <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  placeholder="email"
                  className="form-control"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div> */}
                <div className="mb-3">
                  <label>Quantity</label>
                  <input
                    type="textarea"
                    value={password}
                    placeholder="quantity"
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label>Description</label>
                  <input
                    type="text"
                    value={number}
                    placeholder="description"
                    className="form-control"
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
                 <div className="mb-3">
                  <label>Price</label>
                  <input
                    type="text"
                    value={price}
                    placeholder="price"
                    className="form-control"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  {productPictures.length > 0
                    ? productPictures.map((pic, index) => (
                        <div key={index}>{pic.name}</div>
                      ))
                    : null}

                  <input
                    type="file"
                    multiple
                    name="productPicture"
                    className="form-control"
                    onChange={handleProductPictures}
                  />
                </div>

                <div className="mb-3">
                  <button className="btn btn-primary" onClick={handleUpdate}>
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default UpdateUser;
