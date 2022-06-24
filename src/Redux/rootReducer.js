const initialState = {
    users: [],
    posts: [],
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case "USERS":
            if (typeof action.item === "object") {
                return {
                    ...state,
                    users: action.item,
                };
            }
            return {
                ...state,
                users: [...state.users, action.item],
            };

        case "POSTS":
            if (Array.isArray(action.item)) {
                return {
                    ...state,
                    posts: action.item,
                };
            }
            return {
                ...state,
                posts: [...state.posts, action.item],
            };
        default:
            return state;
    }
};

export default rootReducer;
