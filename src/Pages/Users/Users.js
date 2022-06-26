// import axios from "axios";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "./Users.scss";

function Users({ user, ...props }) {
    const { us, allusers } = props;

    useEffect(() => {
        async function usersData() {
            if (window.desktop) {
                // await window.api
                //     .getAllData("users")
                //     .then((item) => allusers(item));
            }
        }
        usersData();
    }, [us, allusers]);
    return (
        <div className="users">
            {/* prettier-ignore */}
            <div className="container-fluid">
                {
                    us.map((u, i) => (
                        <Link to='/posts' key={i} className="link" onClick={() => user(u)}>
                            <div className="user row border m-2 p-2 rounded">
                                <div className="col-3">
                                    <span style={{ fontWeight: "700" }}>Name</span>
                                </div>
                                <div className="col-9">
                                    <span>{u.name}</span>
                                </div>
                                <div className="col-3">
                                    <span style={{ fontWeight: "700" }}>Email</span>
                                </div>
                                <div className="col-9">
                                    <span>{u.email}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        us: state.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allusers: (val) => {
            dispatch({
                type: "USERS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
