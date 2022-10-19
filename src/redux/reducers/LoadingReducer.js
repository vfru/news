
export const LoadingReducer = (preState = {
    isLoading: false
}, action) => {
    // console.log(action.type)
    let { type,value } = action
    switch (type) {
        case "changeLoading":
            let newState = { ...preState }
            newState.isLoading = value
            return newState

        default:
            return preState
    }

}