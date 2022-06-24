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
    const [posts, setPosts] = useState(
        window.desktop ? require("./Data/posts.json") : pos
    );
    const [users] = useState(
        window.desktop ? require("./Data/users.json") : us
    );
    const [userD, setUserD] = useState();
    const [status] = useState(false); // Change it to true for Online Store

    useEffect(() => {
        async function reading() {
            if (status) {
                if (require("./Data/users.json").length === 0) {
                    console.log("it comes here");
                    await axios
                        .get("https://twilio007.herokuapp.com/posts")
                        .then(async (item) => {
                            await window.api.allpostadd(item.data);
                        });
                    await axios
                        .get("https://twilio007.herokuapp.com/users")
                        .then(async (item) => {
                            allusers(item.data);
                            await window.api.allusersadd(item.data);
                        });
                } else {
                    await posts.forEach(async function (post, index) {
                        if (Object.keys(post).includes("userUuid")) {
                            await axios
                                .post("https://twilio007.herokuapp.com/posts", {
                                    userUuid: post.userUuid,
                                    body: post.body,
                                })
                                .then(async (item) => {
                                    var p = {
                                        uuid: item.data.uuid,
                                        body: item.data.body,
                                        createdAt: item.data.createdAt,
                                        updatedAt: item.data.updatedAt,
                                        user: post.user,
                                    };
                                    posts.splice(index, 1);
                                    posts[index] = p;
                                    await window.api.allpostadd(posts);
                                })
                                .catch((err) => {
                                    console.log("Useffect Post Error: ", err);
                                });
                        }
                    });
                    // await axios
                    //     .get("http://localhost:5000/users")
                    //     .then((online_users) => {
                    //         users.forEach(async function (user) {
                    //             let flag = 0;
                    //             online_users.data.forEach(function (item) {
                    //                 if (user.email === item.email) {
                    //                     flag = 1;
                    //                     return;
                    //                 }
                    //             });
                    //             if (flag === 0) {
                    //                 await axios.post(
                    //                     "http://localhost:5000/users",
                    //                     {
                    //                         name: user.name,
                    //                         email: user.email,
                    //                     }
                    //                 );
                    //             }
                    //         });
                    //     });

                    // allpos(posts);
                    // allusers(users);
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
            setPosts(require("./Data/posts.json"));
            allpos(require("./Data/posts.json"));
            if (userD) {
                var p = [];
                for (let i = 0; i < posts.length; i++) {
                    if (posts[i].user.uuid === userD.uuid) {
                        p.push(posts[i]);
                    }
                }
                setPostData(p);
            }
        } else {
            webread();
        }
    }, [userD, posts, status, allpos, pos, users, allusers]);

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
