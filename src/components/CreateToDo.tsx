import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoryState, toDoState } from "../atoms";

interface IForm {
  toDo: string;
}

function CreateToDo() {
  const setToDos = useSetRecoilState(toDoState);
  const category = useRecoilValue(categoryState);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IForm>();
  const onSubmit = ({ toDo }: IForm) => {
    setToDos((oldToDos) => [
      {
        id: Date.now(),
        text: toDo,
        category,
      },
      ...oldToDos,
    ]);
    setValue("toDo", "");
  };
  return (
    <form
      style={{ display: "flex", flexDirection: "column", maxWidth: "300px" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        {...register("toDo", {
          required: "Please write a To Do",
        })}
        placeholder="Write a to do"
      />
      <span>{errors?.toDo?.message}</span>
      <button>Add</button>
    </form>
  );
}

export default CreateToDo;
