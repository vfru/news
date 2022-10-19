
export const CollapsedReducer = (preState = {
    isCollapsed: false
}, action) => {
    // console.log(action.type)
    let { type } = action
    switch (type) {
        case "changeCollapsed":
            let newState = { ...preState }
            newState.isCollapsed = !newState.isCollapsed
            return newState

        default:
            return preState
    }

}