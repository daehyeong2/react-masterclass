import { atom } from "recoil";

const toDos = JSON.parse(localStorage.getItem("toDos") as string);
const boards = JSON.parse(localStorage.getItem("boards") as string);

export interface IToDo {
  id: number;
  text: string;
}
interface IToDoState {
  [key: string]: IToDo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: toDos ?? {},
});

export const boardState = atom<string[]>({
  key: "board",
  default: boards ?? [],
});
