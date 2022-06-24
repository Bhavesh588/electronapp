import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Posts.scss";

function Posts({ postData, userD, status, setPostData }) {
    // console.log(postData);
    const [body, setBody] = useState("");
    const [err, setErr] = useState(false);

    const addpost = async () => {
        if (body !== "") {
            setErr(false);
            if (window.desktop) {
                if (status) {
                    await axios
                        .post("/posts", {
                            userUuid: userD.uuid,
                            body: body,
                        })
                        .then(async (item) => {
                            var p = {
                                uuid: item.data.uuid,
                                body: item.data.body,
                                createdAt: item.data.createdAt,
                                updatedAt: item.data.updatedAt,
                                user: userD,
                            };
                            await window.api.postfile(p);
                            setBody("");
                        })
                        .catch((err) =>
                            console.log("Error Creating Post: ", err)
                        );
                } else {
                    console.log("its Offline");
                    var p = {
                        userUuid: userD.uuid,
                        body: body,
                        user: userD,
                    };
                    await window.api.postfile(p);
                    setBody("");
                }
            } else {
                await axios
                    .post("/posts", {
                        userUuid: userD.uuid,
                        body: body,
                    })
                    .then(async (item) => {
                        var p = {
                            uuid: item.data.uuid,
                            body: item.data.body,
                            createdAt: item.data.createdAt,
                            updatedAt: item.data.updatedAt,
                            user: userD,
                        };
                        setPostData([...postData, p]);
                        setBody("");
                    })
                    .catch((err) => console.log("Error Creating Post: ", err));
            }
        } else {
            setErr(true);
        }
    };

    return (
        <div className="w-100 posts">
            <div className="w-100 d-flex justify-content-between align-items-center">
                <Link to="/" className="link">
                    Back
                </Link>
                <span>{userD?.name}</span>
            </div>
            <div className="w-100 mt-2">
                <textarea
                    type="text"
                    className="w-100"
                    placeholder="Enter Post"
                    value={body}
                    onChange={(e) => {
                        setErr(false);
                        setBody(e.target.value);
                    }}
                />
                {err ? <div className="text-danger">Required</div> : null}
                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-primary border"
                        onClick={addpost}
                    >
                        Add Post
                    </button>
                </div>
            </div>
            <div className="w-100 d-flex flex-column align-items-center">
                {postData?.length === 0 ? (
                    <div className="w-100 text-center">
                        <h5>No Post</h5>
                    </div>
                ) : (
                    postData
                        ?.slice(0)
                        .reverse()
                        .map((p, i) => (
                            <div
                                key={i}
                                className="w-100 border rounded m-2 p-2"
                            >
                                <h5>Post {postData.length - i}</h5>
                                <span>{p.body}</span>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
}

export default Posts;
