import {changeState} from "../../lib/plugins/redux-plugins";
const defaultState = {
	collapsed: false,
	openKeys: [],
	selectedKeys: [],
	unreadMessageList: []
};
export const adminReducer = (state = defaultState, {type, payload}) => changeState(state, [type, payload]);
export default adminReducer;

