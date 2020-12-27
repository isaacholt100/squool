export default interface ITimetable {
    periods: string[];
    lessons: ILesson[][];
}
export interface ILesson {
    s: string; // Subject
    t: string; // Teacher
    r: string; // String
}