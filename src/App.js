import "./App.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { setTodoList } from "./Redux/firstSlice";
import First from "./First";
import { setName } from "./Redux/firstSlice";
import { setDelete, setEdit, setTodo } from "./Redux/TodoSlice";

function App() {
  const [input, setInput] = useState("");
  const [editIndex, setEDitIndex] = useState("");
  const { TodoLidt } = useSelector((store) => store.todo);
  console.log(TodoLidt, "TodoLidt");
  const dispatch = useDispatch();
  const handleSubmit = () => {
    if (editIndex || editIndex === 0) {
      dispatch(
        setEdit({
          editIndex: editIndex,
          editInput: input,
        })
      );
      setEDitIndex("");
      setInput("");
    } else {
      dispatch(setTodo(input));
    }
    setInput("");
  };
  let val = "";
  const handleOnChange = (data) => {
    const value = data.target.value;

    setInput(value);
  };
  console.log(input, "input");

  const handleDelete = (index) => {
    dispatch(setDelete(index));
  };

  const handleEdit = (indx) => {
    setEDitIndex(indx);
    setInput(TodoLidt[indx]);
  };
  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px 24px",
          // width: "250px",
          // height: "250px",
          // border: "1px solid black",
        }}
      >
        <input name="input" value={input} onChange={handleOnChange} />
        {input && (
          <button
            onClick={handleSubmit}
            style={{
              width: "100px",
              height: "30px",
              backgroundColor: "blue",
              border: "none",
              borderRadius: "4px",
              marginLeft: "5px",
              color: "white",
            }}
          >
            submit
          </button>
        )}
      </div>
      <div
        style={{
          // width: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        {TodoLidt.map((item, index) => {
          return (
            <>
              <div
                style={{
                  backgroundColor: "white",
                  // margin: "2px 2px÷ 2px 2px",
                  // padding: "2px",÷
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "30px",
                  border: "1px solid black",
                  padding: "5px 5px",
                  width: "100px",
                  marginBottom: "5px",
                  borderRadius: "4px",
                  // width: "120px",
                  // marginLeft: "auto",
                  // marginRight: "auto",
                  // width: "200px",
                }}
              >
                {item}
              </div>
              <button onClick={() => handleDelete(index)}>delete</button>
              <button onClick={() => handleEdit(index)}>edit</button>
            </>
          );
        })}
      </div>
      {/* <First name={item} /> */}
    </div>
  );
}

export default App;
