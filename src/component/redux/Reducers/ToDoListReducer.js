import { GET_TASK_API } from "../contants/ToDoListConst"

const initialState = {
    taskList:[]
}

export default (state = initialState, action) => {
    switch (action.type) {

    case GET_TASK_API:
        return { ...state, ...payload }

    default:
        return state
    }
}
