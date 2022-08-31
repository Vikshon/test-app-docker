import axios from "axios";
export default {
    actions: {
        async fetchComments(ctx) {
            ctx.commit("updateLoading", true);
            const comments = await axios
                .get("/api/comments/")
                .then(res => res.data)
                .catch(err => console.log(err));

            ctx.commit("updateLoading", false);
            ctx.commit("updateComments", comments);
        },
        async deleteComment({ commit, dispatch }, id) {
            commit("updateLoading", true);
            await axios
                .delete(`/api/comments/${id}`)
                .catch(err => console.log(err));

            dispatch("fetchComments");
        },
        async addComment({ commit, dispatch }, { id, name, text, date }) {
            commit("updateLoading", true);
            await axios
                .post("/api/comments/", {
                    id,
                    name,
                    text,
                    date
                })
                .catch(err => {
                    console.log(err);
                });

            dispatch("fetchComments");
        }
    },
    mutations: {
        updateComments(state, comments) {
            state.loading = false;
            state.comments = comments.sort((a, b) =>
                a.id < b.id ? -1 : a.id > b.id ? 1 : 0
            );
            state.pageCount = Math.ceil(comments.length / 3);
        },
        pageIndexManipulation(state, action) {
            state.pageIndex += action;
        },
        updateLoading(state, status) {
            state.loading = status;
        },
        sortByIndex(state) {
            if (state.sortDirection === "reverse") {
                state.comments = state.comments.sort((a, b) =>
                    a.id < b.id ? -1 : a.id > b.id ? 1 : 0
                );
                state.sortDirection = "normal";
            } else if (state.sortDirection === "normal") {
                state.comments = state.comments.sort((a, b) =>
                    a.id < b.id ? 1 : a.id > b.id ? -1 : 0
                );
                state.sortDirection = "reverse";
            }
        },
        sortByDate(state) {
            if (state.sortDirection === "reverse") {
                state.comments = state.comments.sort((a, b) => {
                    const aDate = a.date.split('.').reverse().join('');
                    const bDate = b.date.split('.').reverse().join('');
                    return aDate < bDate ? -1 : aDate > bDate ? 1 : 0;
                });
                state.sortDirection = "normal";
            }
            else if (state.sortDirection === "normal") {
                state.comments = state.comments.sort((a, b) => {
                    const aDate = a.date.split('.').reverse().join('');
                    const bDate = b.date.split('.').reverse().join('');
                    return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
                });
                state.sortDirection = "reverse";
            }
        }
    },
    state: {
        comments: [],
        pageIndex: 1,
        pageCount: 1,
        loading: true,
        sortDirection: "normal"
    },
    getters: {
        allComments(state) {
            return state.comments;
        },
        comments(state) {
            return state.comments.slice(
                state.pageIndex * 3 - 3,
                state.pageIndex * 3
            );
        },
        getPageIndex(state) {
            return state.pageIndex;
        },
        getPageCount(state) {
            return state.pageCount;
        },
        getLastCommentIndex(state) {
            return state.comments.length > 0 ? state.comments[state.comments.length - 1].id + 1 : 1;
        },
        getLoadingState(state) {
            return state.loading;
        },
        getSortDirection(state) {
            return state.sortDirection;
        }
    }
};
