import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer.js";
import upload from "../../utils/upload.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest.js";
import { useNavigate } from "react-router-dom";
import getCurrentUser from "../../utils/getCurrentUser.js"

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  /**
   * This function dispatches an action with the name and value of the input field that triggered the
   * change event.
   */
  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  /**
   * The function handles the upload of files, including a cover image and multiple images, and
   * dispatches the URLs to be added to the state.
   */

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      /* This code is using the `Promise.all()` method to upload multiple files asynchronously and
      return an array of their URLs. It takes an array of files (`files`), spreads it into a new
      array, and maps over each file to upload it using the `upload()` function. The `await` keyword
      is used to wait for each upload to complete before returning the URL. The `Promise.all()`
      method then waits for all the promises to resolve and returns an array of URLs, which is stored
      in the `images` variable. */
      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
     /* `dispatch({ type: "ADD_IMAGES", payload: { cover, images } });` is dispatching an action to the
     gigReducer. The action type is "ADD_IMAGES" and the payload is an object containing the URLs of
     the cover image and multiple images that were uploaded. The gigReducer will then update the
     state with these URLs. */
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };


  const navigate = useNavigate();

  const queryClient = useQueryClient();

  /** 
   *  `const mutation = useMutation({...})` is using the `useMutation` hook from the
   *  ` @tanstack/react-query` library to create a mutation function that will send a POST request to the
   *  /gigs endpoint with the `gig` object as the request body. 
  */

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post(`/gigs`, gig);
      // ${getCurrentUser}
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  /**
   * This function handles form submission by preventing the default behavior, calling a mutation
   * function with the form state, and navigating to a new page.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
    navigate("/myGigs")
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "uploading" : "Upload"}
              </button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} />
            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
            />
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input type="number" onChange={handleChange} name="price" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
