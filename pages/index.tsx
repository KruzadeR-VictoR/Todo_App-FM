import { useContext, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import style from "../styles/index.module.css";
import moon from "../public/icon-moon.svg";
import sun from "../public/icon-sun.svg";
import bgLightMobile from "../public/bg-mobile-light.jpg";
import bgLightDesktop from "../public/bg-desktop-light.jpg";
import check from "../public/icon-check.svg";
import close from "../public/icon-cross.svg";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { ThemeContext } from "./_app";
import { elementAcceptingRef } from "@mui/utils";
import { Paper } from "@mui/material";

type Todo = {
  id: number;
  text: string;
  isComplete: boolean;
};

export default function Home() {
  const { Theme, setTheme } = useContext(ThemeContext);
  const [isActive, setisActive] = useState(false);
  const [TodoMenu, setTodoMenu] = useState("All");
  const [isComplete, setisComplete] = useState(false);
  const [Screen, setScreen] = useState<number>();
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

  useEffect(() => {
    window.addEventListener("resize", () => {
      setScreen(window.innerWidth);
    });
  }, []);

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
    setCompletedTodos(CompletedTodos);
  }, [CompletedTodos]);

  const handleCompleted = () => {
    setisActive((prev) => !prev);
    setTodoMenu("Completed");
    const complete = Todos.filter((item) => {
      return item.isComplete == true;
    });
    setCompletedTodos(complete);
    // setCurrent(complete);
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

  //> Clear Completed todos

  const clearCompleted = () => {
    setisActive((prev) => !prev);
    //< Trick to clear completedtodos while in complete tab
    setCompletedTodos([]);
    setTodos(
      Todos.filter((item, index) => {
        return item.isComplete !== true;
      })
    );
  };

  // Create a Todo Input
  const handleInput = (e: any) => {
    const newTodo = [...Todos];
    if (e.key == "Enter") {
      const neww = {
        id: Todos.length + 1,
        text: e.target.value,
        isComplete: isComplete,
      };
      newTodo.unshift(neww);
      setTodos(newTodo);
      // setTodos({id:1,text:'hello',isComplete:false},...Todos)
    }
    // setTodos({7,'ok',false})
  };

  //< handle Theme change

  const handleTheme = () => {
    if (Theme == "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <>
      <Image
        src={Screen && Screen <= 600 ? bgLightMobile : bgLightDesktop}
        alt="bg-light"
        style={{
          width: "100%",
          height: "15rem",
          position: "absolute",
          top: "0",
          left: "0",
          objectFit: "cover",
          zIndex: "0",
        }}
      />
      <main className={style.App}>
        <Container
          sx={{
            width: "90%",
            maxWidth: "40rem !important",
            margin: "auto",
          }}
        >
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
            <Image
              style={{ cursor: "pointer" }}
              src={Theme == "light" ? moon : sun}
              alt="moon"
              onClick={handleTheme}
            />
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
            style={
              Theme == "light"
                ? { background: "hsl(235, 24%, 19%)" }
                : { background: "rgb(250, 250, 250)" }
            }
          >
            <div className={`${style.checkbox}`} style={
                          Theme == "light"
                            ? { border:' 1px solid hsl(237, 14%, 26%)' }
                            : { border:' 1px solid hsl(233, 11%, 84%)' }
                        }></div>
            <input
              className={style.createInput}
              type="text"
              placeholder="Create a new todo..."
              onKeyUp={(e) => handleInput(e)}
              style={
                Theme == "light"
                  ? { background: "hsl(235, 24%, 19%)",color:'hsl(236, 33%, 92%)' }
                  : { background: "rgb(250, 250, 250)" }
              }
            />
          </Stack>
          {/* All Todos  */}
          <Box
            className={style.todos}
            style={
              Theme == "light"
                ? { background: "hsl(235, 24%, 19%)" }
                : { background: "rgb(250, 250, 250)" }
            }
            ref={todoref}
          >
            {TodoMenu == "Completed" ? (
              <>
                {CompletedTodos.map((todo, index) => (
                  <div
                    key={todo.id}
                    className={style.todo}
                    style={
                      Theme == "light"
                        ? { borderBottom: " 1px solid hsl(237, 14%, 26%)" }
                        : { borderBottom: " 1px solid hsl(236, 33%, 92%)" }
                    }
                  >
                    <div className={style.todo_left}>
                      <div
                        className={`${
                          todo.isComplete
                            ? `${style.checkbox} ${style.checkbox_active}`
                            : `${style.checkbox}`
                        }`}
                        style={
                          Theme == "light"
                            ? { border:' 1px solid hsl(237, 14%, 26%)' }
                            : { border:' 1px solid hsl(233, 11%, 84%)' }
                        }
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
                  <div
                    key={todo.id}
                    className={style.todo}
                    style={
                      Theme == "light"
                        ? { borderBottom: " 1px solid hsl(237, 14%, 26%)" }
                        : { borderBottom: " 1px solid hsl(236, 33%, 92%)" }
                    }
                  >
                    <div className={style.todo_left}>
                      <div
                        className={`${
                          todo.isComplete
                            ? `${style.checkbox} ${style.checkbox_active}`
                            : `${style.checkbox}`
                        }`}
                        style={
                          Theme == "light"
                            ? { border:' 1px solid hsl(237, 14%, 26%)' }
                            : { border:' 1px solid hsl(233, 11%, 84%)' }
                        }
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
                        style={
                          Theme == "light"
                            ? { color:'hsl(236, 33%, 92%)' }
                            : { color:'hsl(235, 19%, 35%)' }
                        }
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
              <div className="left" 
              style={
                Theme == "light"
                  ? { color:'hsl(234, 11%, 52%)' }
                  : { color:'hsl(236, 9%, 61%)' }
              }
              >
                <span >{Todos.length}</span> items left
              </div>
              <span className={style.right} onClick={clearCompleted} style={
                Theme == "light"
                  ? { color:'hsl(234, 11%, 52%)' }
                  : { color:'hsl(236, 9%, 61%)' }
              }>
                Clear Completed
              </span>
            </div>
          </Box>
          {/* TodosMenu Tabs  */}
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
            style={
              Theme == "light"
                ? { background: "hsl(235, 24%, 19%)" }
                : { background: "rgb(250, 250, 250)" }
            }
          >
            <span
              className={`${TodoMenu == "All" ? `${style.link_active}` : ""}`}
              onClick={handleTodos}
              style={
                Theme == "light"
                  ? { color:'hsl(234, 11%, 52%)' }
                  : { color:'hsl(236, 9%, 61%)' }
              }
            >
              All
            </span>
            <span
              className={`${
                TodoMenu == "Active" ? `${style.link_active}` : ""
              }`}
              style={
                Theme == "light"
                  ? { color:'hsl(234, 11%, 52%)' }
                  : { color:'hsl(236, 9%, 61%)' }
              }
              onClick={handleActive}
            >
              Active
            </span>
            <span
              className={`${
                TodoMenu == "Completed" ? `${style.link_active}` : ""
              }`}
              style={
                Theme == "light"
                  ? { color:'hsl(234, 11%, 52%)' }
                  : { color:'hsl(236, 9%, 61%)' }
              }
              onClick={handleCompleted}
            >
              Completed
            </span>
          </Stack>
          <p className={style.Drag_msg}>Drag and drop to reorder list</p>
        </Container>
      </main>
    </>
  );
}
