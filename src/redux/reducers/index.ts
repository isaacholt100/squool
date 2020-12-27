import { combineReducers } from "redux";
import userInfo from "./userInfo";
import classes from "./classes";
import timetable from "./timetable";
import reminders from "./reminders";
import loadError from "./loadError";
import carouselView from "./carouselView";
import contextMenu from "./contextMenu";
import helpDialog from "./helpDialog";
import users from "./users";
import usersDialog from "./usersDialog";
import chats from "./chats";
import books from "./books";
import moreActions from "./moreActions";

export default combineReducers({
    userInfo, classes, timetable, reminders, loadError, carouselView, contextMenu, helpDialog, users, usersDialog, chats, books, moreActions,
});