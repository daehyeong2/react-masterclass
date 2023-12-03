import { useForm } from "react-hook-form";

interface IForm {
  toDo: string;
}

function ToDoList() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IForm>();
  const onSubmit = (data: IForm) => {
    console.log("add to do", data.toDo);
    setValue("toDo", "");
  };
  return (
    <div>
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
    </div>
  );
}

export default ToDoList;
