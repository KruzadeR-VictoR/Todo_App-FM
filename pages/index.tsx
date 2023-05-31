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
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Todo = {
  id: number;
  text: string;
  isComplete: boolean;
};

export default function Home() {
  const { Theme, setTheme } = useContext(ThemeContext);
  const [isActive, setisActive] = useState(false);
  const [TodoMenu, setTodoMenu] = useState("All");
  const [Active, setActive] = useState("All");
  const [CompletedTodos, setCompletedTodos] = useState([]);
  const [ActiveTodos, setActiveTodos] = useState([]);
  const [Screen, setScreen] = useState<number>();
  const [Todos, setTodos] = useState<any[]>([]);

  const [Current, setCurrent] = useState([]);

  // console.log(Current);

  const todoref = useRef();

  const getTodos = async () => {
    try {
      const q = query(collection(db, "Todos"));
      const querySnapshot = await getDocs(q);

      let todoArr: any = [];
      querySnapshot.forEach((doc) => {
        todoArr.push({ ...doc.data(), id: doc.id });
      });

      return todoArr;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const { data, isLoading } = useQuery(["todos"], () => getTodos(), {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setTodos(data);
    },
  });

  useEffect(() => {
    resetServerContext();
    window.addEventListener("resize", () => {
      setScreen(window.innerWidth);
    });
  }, []);

  const updateExistingTodo = async (updateParams: any) => {
    // setisActive((prev) => !prev);
    // console.log(Todos);
    // // setisComplete(prev=>!prev)
    // Todos[index].isComplete
    //   ? (Todos[index].isComplete = false)
    //   : (Todos[index].isComplete = true);
    // // Todos.splice(index, 1);
    // const complete = Todos.filter((item: any) => {
    //   return item.isComplete == true;
    // });
    // setCompletedTodos(complete);
    const { id, isComplete } = updateParams;
    const todoDoc = doc(db, "Todos", id);
    const isCompleted = { isComplete: !isComplete };
    // console.log(id,isComplete);
    await updateDoc(todoDoc, isCompleted);
  };

  //> Delete Todo
  const deleteExistingTodo = async (id: any) => {
    await deleteDoc(doc(db, "Todos", id));
  };

  //> handle All Todos
  const handleTodos = () => {
    setTodoMenu("All");
    const all_Todos = data.filter((todo: any) => {
      return todo.text;
    });
    console.log(data);
    setTodos(all_Todos);
  };
  //> handle Completed Todos
  const handleCompleted = () => {
    setTodoMenu("Completed");
    const complete = data.filter((todo: any) => {
      return todo.isComplete == true;
    });
    setTodos(complete);
  };
  //> handle Active Todos
  const handleActive = () => {
    setTodoMenu("Active");

    const activeArr = data.filter((todo: any) => {
      return todo.isComplete != true;
    });

    setTodos(activeArr);
  };
  //> Clear Completed todos

  const clearCompleted = async () => {
    const completedTodos = data.filter((todo: any) => {
      return todo.isComplete == true;
    });

    completedTodos.map(async (todo: any) => {
      await deleteDoc(doc(db, "Todos", todo.id));
    });
  };

  //> Create a Todo Input
  const createTodo = async (newTodo: any) => {
    await addDoc(collection(db, "Todos"), newTodo);
  };

  //| Mutations

  const queryClient = useQueryClient();

  //> create mutation
  const addTodo = useMutation(createTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });
  //> Delete mutation
  const deleteTodo = useMutation(deleteExistingTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });
  //> Update mutation

  const updateTodo = useMutation(updateExistingTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  //> clear Completed

  const clearCompletedTodos = useMutation(clearCompleted, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const handleInput = (e: any) => {
    if (e.key == "Enter" && e.target.value !== "") {
      const newTodo = {
        text: e.target.value,
        isComplete: false,
      };
      addTodo.mutate(newTodo);
      e.target.value = "";
    }
  };
  const handleDelete = (id: any) => {
    deleteTodo.mutate(id);
  };
  const handleUpdate = (id: any, isComplete: boolean) => {
    updateTodo.mutate({ id, isComplete });
  };

  const handleclearCompleted = () => {
    clearCompletedTodos.mutate();
  };
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
    if (!result.destination) return;

    const items = Array.from(Todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items); // Update the state with the sorted array
  };

  const styles = {
    //< Utility
    utility: "flex justify-between items-center px-2 pt-5",
    leftText: "text-sm text-gray-400",
    clearBtn: " text-sm text-gray-400",
  };

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
              onKeyUp={(e) => handleInput(e)}
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
          {isLoading ? (
            "Loading"
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <>
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={style.todos}
                      style={
                        Theme == "light"
                          ? {
                              background: "hsl(235, 24%, 19%)",
                              maxHeight: "30rem",
                              overflowY: "scroll",
                            }
                          : {
                              background: "rgb(250, 250, 250)",
                              maxHeight: "30rem",
                              overflowY: "scroll",
                            }
                      }
                    >
                      <>
                        {Todos &&
                          Todos.map((todo: any, index: number) => (
                            <Draggable
                              key={todo.id}
                              draggableId={todo.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <Box
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  className={style.todo}
                                  sx={
                                    Theme == "light"
                                      ? {
                                          borderBottom:
                                            " 1px solid hsl(237, 14%, 26%)",
                                        }
                                      : {
                                          borderBottom:
                                            " 1px solid hsl(236, 33%, 92%)",
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
                                              border:
                                                " 1px solid hsl(237, 14%, 26%)",
                                            }
                                          : {
                                              border:
                                                " 1px solid hsl(233, 11%, 84%)",
                                            }
                                      }
                                      onClick={() =>
                                        handleUpdate(todo.id, todo.isComplete)
                                      }
                                    >
                                      {todo.isComplete && (
                                        <Image src={check} alt="check" />
                                      )}
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
                                    onClick={() => handleDelete(todo.id)}
                                  />
                                </Box>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </>
                    </Box>
                    <div
                      className={style.items_info}
                      style={
                        Theme == "light"
                          ? { backgroundColor: "hsl(235,24%,19%)" }
                          : { backgroundColor: "hsl(0,0%,98%)" }
                      }
                    >
                      <div
                        className="left"
                        style={
                          Theme == "light"
                            ? { color: "hsl(234, 11%, 52%)" }
                            : { color: "hsl(236, 9%, 61%)" }
                        }
                      >
                        <span>{Todos.length}</span> items left
                      </div>
                      <span
                        className={style.right}
                        onClick={handleclearCompleted}
                        style={
                          Theme == "light"
                            ? { color: "hsl(234, 11%, 52%)" }
                            : { color: "hsl(236, 9%, 61%)" }
                        }
                      >
                        Clear Completed
                      </span>
                    </div>
                  </>
                )}
              </Droppable>
            </DragDropContext>
          )}
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
                  ? { color: "hsl(234, 11%, 52%)" }
                  : { color: "hsl(236, 9%, 61%)" }
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
                  ? { color: "hsl(234, 11%, 52%)" }
                  : { color: "hsl(236, 9%, 61%)" }
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
                  ? { color: "hsl(234, 11%, 52%)" }
                  : { color: "hsl(236, 9%, 61%)" }
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
