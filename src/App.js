import { useEffect, lazy, Suspense, useState } from "react";
import axios from "axios";
import loader from "./assets/Loader.gif";
// import allposts from "./Data/posts.json";
import { connect } from "react-redux";

import { Route, Routes } from "react-router-dom";

import "./App.scss";

const Users = lazy(() => import("./Pages/Users/Users"));
const Posts = lazy(() => import("./Pages/Posts/Posts"));

// This useEffect was running Twice without anything declare in the useEffect. But
// When I removed React.StrictMode in index.js file then useEffect was running onlu once.
function App(props) {
    const { pos, allpos, us, allusers } = props;

    const [postData, setPostData] = useState([]);
    // const [posts, setPosts] = useState(pos);
    // const [users] = useState(us);
    const [userD, setUserD] = useState();
    const [status] = useState(true); // Change it to true for Online Store

    useEffect(() => {
        async function reading() {
            var d = [];
            await window.api.getAllData("posts").then((item) => (d = item));
            if (pos.length === 0 || us.length === 0) {
                allpos(d.posts);
                allusers(d.users);
            }
            if (status) {
                if (d.posts.length === 0 || d.users.length === 0) {
                    console.log("it comes here");
                    await axios
                        .get("https://twilio007.herokuapp.com/posts")
                        .then(async (item) => {
                            await window.api.addData(item.data, "posts");
                            await window.api
                                .getAllData("posts")
                                .then((item) => allpos(item.posts));
                        });
                    await axios
                        .get("https://twilio007.herokuapp.com/users")
                        .then(async (item) => {
                            await window.api.addData(item.data, "users");
                            await window.api
                                .getAllData("users")
                                .then((item) => allusers(item.users));
                        });
                } else {
                    await pos.forEach(async function (post, index) {
                        if (Object.keys(post)) {
                            if (Object.keys(post).includes("userUuid")) {
                                await axios
                                    .post(
                                        "https://twilio007.herokuapp.com/posts",
                                        {
                                            userUuid: post.userUuid,
                                            body: post.body,
                                        }
                                    )
                                    .then(async (item) => {
                                        var p = {
                                            uuid: item.data.uuid,
                                            body: item.data.body,
                                            createdAt: item.data.createdAt,
                                            updatedAt: item.data.updatedAt,
                                            user: post.user,
                                        };
                                        pos.splice(index, 1);
                                        pos[index] = p;
                                        await window.api.addData(pos, "posts");
                                        allpos(pos);
                                        // await window.api
                                        //     .getAllData("posts")
                                        //     .then((item) => allpos(item));
                                    })
                                    .catch((err) => {
                                        console.log(
                                            "Useffect Post Error: ",
                                            err
                                        );
                                    });
                                // await window.api
                                //     .getAllData("posts")
                                //     .then((item) => setPosts(item));
                            }
                        }
                    });
                }
            }
        }
        async function webread() {
            if (pos.length === 0) {
                await axios
                    .get("https://twilio007.herokuapp.com/posts")
                    .then((post) => allpos(post.data));
                await axios
                    .get("https://twilio007.herokuapp.com/users")
                    .then((u) => allusers(u.data));
            }
        }
        if (window.desktop) {
            reading();
            // setPosts(pos);
            // allpos(require("./Data/posts.json"));
            if (userD) {
                var p = [];
                for (let i = 0; i < pos.length; i++) {
                    if (pos[i].user.uuid === userD.uuid) {
                        p.push(pos[i]);
                    }
                }
                setPostData(p);
            }
        } else {
            webread();
        }
    }, [userD, status, allpos, pos, us, allusers]);

    const user = (data) => {
        var p = [];
        setUserD(data);
        for (let i = 0; i < pos.length; i++) {
            if (pos[i].user.uuid === data.uuid) {
                p.push(pos[i]);
            }
        }
        setPostData(p);
    };

    return (
        <div className="App container mt-2">
            {window.desktop ? (
                us.length === 0 && pos.length === 0 && !status ? (
                    <div className="connection_status d-flex align-items-center justify-content-center">
                        <div className="bg-light p-5 rounded">
                            <span style={{ fontWeight: "600" }}>
                                Please its your first time in the App. Connect
                                to Internet First
                            </span>
                        </div>
                    </div>
                ) : us.length === 0 && pos.length === 0 && status ? (
                    <div className="connection_status d-flex align-items-center justify-content-center">
                        <div className="bg-light p-5 rounded">
                            <div className="load">
                                <div style={{ width: "100px" }}>
                                    <img
                                        src={loader}
                                        alt="loader"
                                        style={{ width: "100%" }}
                                    />
                                </div>
                            </div>
                            <span style={{ fontWeight: "600" }}>
                                Loading Data ...
                            </span>
                        </div>
                    </div>
                ) : null
            ) : null}
            <h4>Good Evening, I am {status ? "Online" : "Offline"} Sir</h4>
            <div className="wrapper_app">
                {/* prettier-ignore */}
                <Routes>
                    <Route path='/' element={
                        <Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
                            <Users user={user} status={status} />
                        </Suspense>
                    } />
                    <Route path='/posts' element={
                        <Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
                            <Posts postData={postData} setPostData={setPostData} userD={userD} status={status} />
                        </Suspense>
                    } />
                </Routes>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        pos: state.posts,
        us: state.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allpos: (val) => {
            dispatch({
                type: "POSTS",
                item: val,
            });
        },
        allusers: (val) => {
            dispatch({
                type: "USERS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
