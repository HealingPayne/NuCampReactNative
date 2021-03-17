import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVORITE:
            //If exists
            if (state.includes(action.payload)) {
                return state;
            }
            //Add new Favorite
            return state.concat(action.payload);
        case ActionTypes.DELETE_FAVORITE:
            //Returns all that are not that campsite Favorite
            // this elliminates the favorite campsiteId chosen
            return state.filter(favorite => favorite !== action.payload);
        default:
            return state;
    }
};