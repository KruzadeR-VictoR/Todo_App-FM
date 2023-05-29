import { useContext, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import style from "../styles/index.module.css";
import moon from "../public/icon-moon.svg";
import sun from "../public/icon-sun.svg";
import bgLightMobile from "../public/bg-mobile-light.jpg";
import bgDarkMobile from "../public/bg-mobile-dark.jpg";
import bgLightDesktop from "../public/bg-desktop-light.jpg";
import bgDarkDesktop from "../public/bg-desktop-dark.jpg";
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
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from "react-beautiful-dnd";
import { db } from "../firebase";
import { query, collection, onSnapshot,doc } from "firebase/firestore";

// type Todo = {
//   id: number;
//   text: string;
//   isComplete: boolean;
// };

export default function Home() {
  const { Theme, setTheme } = useContext(ThemeContext);
  const [isActive, setisActive] = useState(false);
  const [Active, setActive] = useState("All");
  const [CompletedTodos, setCompletedTodos] = useState([])
  const [ActiveTodos, setActiveTodos] = useState([])  
  const [Screen, setScreen] = useState<number>();
  const [Todos, setTodos] = useState<any[]>([]);
  

  const [Current, setCurrent] = useState([]);

  // console.log(Current);

  const todoref = useRef();

  useEffect(() => {
    const q = query(collection(db, "Todos"));
    const getData = onSnapshot(q, (querySnapshot) => {
      let todoArr:any = [];
      querySnapshot.forEach((doc) => {
        todoArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todoArr);
      console.log(todoArr);
    });
  }, []);

  useEffect(() => {
    resetServerContext();
    window.addEventListener("resize", () => {
      setScreen(window.innerWidth);
    });
  }, []);

  // const handleCheckbox = (e: any, index: any) => {
  //   setisActive((prev) => !prev);
  //   console.log(Todos);
    // setisComplete(prev=>!prev)
    // Todos[index].isComplete
    //   ? (Todos[index].isComplete = false)
    //   : (Todos[index].isComplete = true);
    // Todos.splice(index, 1);
    // const complete = Todos.filter((item) => {
    //   return item.isComplete == true;
    // });
    // setCompletedTodos(complete);
  // };

  const handleClose = (e: any, index: any) => {
    setisActive((prev) => !prev);
    console.log(index);
    Todos.splice(index, 1);
  };

  // //> handle All Todos
  // const handleTodos = () => {
  //   setTodoMenu("All");
  //   setCurrent(Todos);
  // };
  //> handle Completed Todos

  useEffect(() => {
    setCompletedTodos(CompletedTodos);
  }, [CompletedTodos]);

 
  //> handle Active Todos
  

  //> Clear Completed todos

  

  // Create a Todo Input
  

  //< handle Theme change

  const handleTheme = () => {
    if (Theme == "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  //> handle DragEnd

  const handleDragEnd = (result: any) => {
    console.log(result);
    if (!result.destination) return;
    const items = Array.from(Todos);
    const [reorderData] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderData);
    setTodos(items);
  };

  const styles={
     //< Utility
     utility: "flex justify-between items-center px-2 pt-5",
     leftText: "text-sm text-gray-400",
     clearBtn: " text-sm text-gray-400",
  }

  return (
    <>
      <Image
        src={
          Screen && Screen <= 600
            ? Theme && Theme == "light"
              ? bgLightMobile
              : bgDarkMobile
            : Theme && Theme == "dark"
            ? bgLightDesktop
            : bgDarkDesktop
        }
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
            <div
              className={`${style.checkbox}`}
              style={
                Theme == "light"
                  ? { border: " 1px solid hsl(237, 14%, 26%)" }
                  : { border: " 1px solid hsl(233, 11%, 84%)" }
              }
            ></div>
            <input
              className={style.createInput}
              type="text"
              placeholder="Create a new todo..."              
              style={
                Theme == "light"
                  ? {
                      background: "hsl(235, 24%, 19%)",
                      color: "hsl(236, 33%, 92%)",
                    }
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
          >
            {/* {Current.map((todo, index) => (
              <div
                className={style.todo}
                style={
                  Theme == "light"
                    ? {
                        borderBottom: " 1px solid hsl(237, 14%, 26%)",
                      }
                    : {
                        borderBottom: " 1px solid hsl(236, 33%, 92%)",
                      }
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
                        ? {
                            border: " 1px solid hsl(237, 14%, 26%)",
                          }
                        : {
                            border: " 1px solid hsl(233, 11%, 84%)",
                          }
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
                        ? { color: "hsl(236, 33%, 92%)" }
                        : { color: "hsl(235, 19%, 35%)" }
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
            ))} */}
            {/* All Todos  */}
            <div className={style.todos}>
          {Todos.map((todo, index) => (
            <div className={style.todo} key={index}>
              <div className={style.todo_left}>
                <input
                  type="checkbox"
                  name="complete"
                  id="checkComplete"
                  // onChange={() => toggleCompleted(todo)}
                  checked={todo.isComplete ? true : false}
                  className="w-[1.3rem] aspect-square"
                />
                <span
                  className={
                    todo.isComplete ? style.todo_text : style.complete
                  }
                >
                  {todo.text}
                </span>
              </div>
              <img
                src="../public/icon-cross.svg"
                alt="delete todo"
                className={style.deleteBtn}
                // onClick={() => deleteTodo(todo.id)}
              />
            </div>
          ))}
          <div className={style.utility}>
            <span className={style.leftText}>{Todos.length} items left</span>
            <button className={style.clearBtn}>Clear Completed</button>
          </div>
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
              className={`${Active == "All" ? `${style.link_active}` : ""}`}              
              style={
                Theme == "light"
                  ? { color: "hsl(234, 11%, 52%)" }
                  : { color: "hsl(236, 9%, 61%)" }
              }
            >
              All
            </span>
            <span
              className={`${
                Active == "Active" ? `${style.link_active}` : ""
              }`}
              style={
                Theme == "light"
                  ? { color: "hsl(234, 11%, 52%)" }
                  : { color: "hsl(236, 9%, 61%)" }
              }              
            >
              Active
            </span>
            <span
              className={`${
                Active == "Completed" ? `${style.link_active}` : ""
              }`}
              style={
                Theme == "light"
                  ? { color: "hsl(234, 11%, 52%)" }
                  : { color: "hsl(236, 9%, 61%)" }
              }              
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
