import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import style from "../styles/index.module.css";
import moon from "../public/icon-moon.svg";
import bgLight from "../public/bg-mobile-light.jpg";
import check from "../public/icon-check.svg";
import close from "../public/icon-cross.svg";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

type Todo = {
  id: number;
  text: string;
  isComplete: boolean;
};

export default function Home() {
  const [isActive, setisActive] = useState(false);
  const [TodoMenu, setTodoMenu] = useState("All");
  const [isComplete, setisComplete] = useState(false);
  // const [Screen, setScreen] = useState(window)
  const [Todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: "Complete online javascript course",
      isComplete: isComplete,
    },
    {
      id: 2,
      text: "Jog around the park 3x",
      isComplete: isComplete,
    },
    {
      id: 3,
      text: "10 minutes meditation",
      isComplete: isComplete,
    },
    {
      id: 4,
      text: "Read for 1 hour",
      isComplete: isComplete,
    },
    {
      id: 5,
      text: "Pick up groceries",
      isComplete: isComplete,
    },
    {
      id: 6,
      text: "Complete Todo App on Frontend Mentor",
      isComplete: isComplete,
    },
  ]);

  const [CompletedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const [Current, setCurrent] = useState<Todo[]>(Todos);

  // console.log(Current);

  const todoref = useRef();

  useEffect(() => {
    setTodos(Todos);
    setCurrent(Todos);
  }, [Todos]);

  const handleCheckbox = (e: any, index: any) => {
    setisActive((prev) => !prev);
    console.log(Todos);
    // setisComplete(prev=>!prev)
    Todos[index].isComplete
      ? (Todos[index].isComplete = false)
      : (Todos[index].isComplete = true);
    // Todos.splice(index, 1);
    const complete = Todos.filter((item) => {
      return item.isComplete == true;
    });
    setCompletedTodos(complete);
  };

  const handleClose = (e: any, index: any) => {
    setisActive((prev) => !prev);
    console.log(index);
    Todos.splice(index, 1);
  };

  //> handle All Todos
  const handleTodos = () => {
    setTodoMenu("All");
    setCurrent(Todos);
  };
  //> handle Completed Todos

  useEffect(() => {
    console.log(CompletedTodos);
  });

  const handleCompleted = () => {
    setTodoMenu("Completed");
    const complete = Todos.filter((item) => {
      return item.isComplete == true;
    });
    setCompletedTodos(complete);
    setCurrent(complete);
  };
  //> handle Active Todos
  const handleActive = () => {
    setTodoMenu("Active");
    const complete = Todos.filter((item) => {
      return item.isComplete !== true;
    });
    setCompletedTodos(complete);
    setCurrent(complete);
  };

  useEffect(() => {
    console.log(CompletedTodos);
  }, [CompletedTodos]);

  //> Clear Completed todos

  const clearCompleted = () => {
    // setisActive((prev) => !prev);
    setTodos(
      Todos.filter((item, index) => {
        return item.isComplete !== true;
      })
    );    
  };

  return (
    <main className={style.App}>
      <Image
        src={bgLight}
        alt="bg-light"
        style={{
          width: "100%",
          height: "15rem",
          position: "absolute",
          top: "0",
          left: "0",
          objectFit: "cover",
          zIndex: "-1",
        }}
      />
      <Container sx={{ width: "90%", margin: "auto" }}>
        <Stack
          direction="row"
          sx={{
            paddingTop: "3rem",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            color="White"
            sx={{ letterSpacing: "15px", fontWeight: "700" }}
          >
            TODO
          </Typography>
          <Image src={moon} alt="moon" />
        </Stack>
        {/* Create a new todo input box  */}
        <Stack
          direction="row"
          sx={{
            background: "#fafafa",
            alignItems: "center",
            borderRadius: "5px",
            paddingLeft: "1.5rem",
            overflow: "hidden",
            marginTop: "2.5rem",
          }}
        >
          <div className={`${style.checkbox}`}></div>
          <input
            className={style.createInput}
            type="text"
            placeholder="Create a new todo..."
          />
        </Stack>
        {/* All Todos  */}
        <Box className={style.todos} ref={todoref}>
          {TodoMenu == "Completed" ? (
            <>
              {CompletedTodos.map((todo, index) => (
                <div key={todo.id} className={style.todo}>
                  <div className={style.todo_left}>
                    <div
                      className={`${
                        todo.isComplete
                          ? `${style.checkbox} ${style.checkbox_active}`
                          : `${style.checkbox}`
                      }`}
                      onClick={(e) => handleCheckbox(e, index)}
                    >
                      {todo.isComplete && <Image src={check} alt="check" />}
                    </div>
                    <span
                      className={`${
                        todo.isComplete
                          ? `${style.todo_text} ${style.complete}`
                          : `${style.todo_text}`
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <Image
                    className={style.close_Btn}
                    src={close}
                    alt="close"
                    onClick={(e) => handleClose(e, index)}
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              {Current.map((todo, index) => (
                <div key={todo.id} className={style.todo}>
                  <div className={style.todo_left}>
                    <div
                      className={`${
                        todo.isComplete
                          ? `${style.checkbox} ${style.checkbox_active}`
                          : `${style.checkbox}`
                      }`}
                      onClick={(e) => handleCheckbox(e, index)}
                    >
                      {todo.isComplete && <Image src={check} alt="check" />}
                    </div>
                    <span
                      className={`${
                        todo.isComplete
                          ? `${style.todo_text} ${style.complete}`
                          : `${style.todo_text}`
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <Image
                    className={style.close_Btn}
                    src={close}
                    alt="close"
                    onClick={(e) => handleClose(e, index)}
                  />
                </div>
              ))}
            </>
          )}

          <div className={style.items_info}>
            <div className="left">
              <span>{Todos.length}</span> items left
            </div>
            <span className={style.right} onClick={clearCompleted}>
              Clear Completed
            </span>
          </div>
        </Box>

        <Stack
          className={style.todo_menu}
          direction="row"
          spacing={3}
          sx={{
            justifyContent: "center",
            background: "#fafafa",
            padding: "1.2rem 1.5rem",
            marginTop: "1rem",
            borderRadius: "5px",
          }}
        >
          <span
            className={`${TodoMenu == "All" ? `${style.link_active}` : ""}`}
            onClick={handleTodos}
          >
            All
          </span>
          <span
            className={`${TodoMenu == "Active" ? `${style.link_active}` : ""}`}
            onClick={handleActive}
          >
            Active
          </span>
          <span
            className={`${
              TodoMenu == "Completed" ? `${style.link_active}` : ""
            }`}
            onClick={handleCompleted}
          >
            Completed
          </span>
        </Stack>
        <p className={style.Drag_msg}>Drag and drop to reorder list</p>
      </Container>
    </main>
  );
}

// export const Completed=()=>{
//   return(
//     <>
//     {Compl}
//     </>
//   )
// }
