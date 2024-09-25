"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import DeleteModal from "./DeleteModal";

export default function TableComponent() {
  const [questions, setQuestions] = useState([
    { id: 1, question_text: "What is React?" },
    { id: 2, question_text: "What is the difference between props and state?" },
    { id: 3, question_text: "How do you manage component lifecycle in React?" },
    { id: 4, question_text: "What is the use of useEffect?" },
  ]);

  const [open, setOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const handleOpen = (id) => {
    setSelectedQuestionId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedQuestionId(null);
  };
  const handleDelete = () => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.id !== selectedQuestionId)
    );
    handleClose(); // Close the modal after deletion
  };
  // const [questions, setQuestions] = useState([]);
  // const [error, setError] = useState(null);
  // useEffect(() => {
  //   const fetchQuestions = async () => {
  //     try {
  //       const response = await fetch("/API/v1/route.js");

  //       const data = await response.json();

  //       if (response.ok) {
  //         setQuestions(data);
  //       } else {
  //         // setError(error.message);
  //       }
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   };
  //   fetchQuestions();
  // }, []);

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }
  return (
    <>
    <DeleteModal open={open} onClose={handleClose} onDelete={handleDelete} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell align="right">Delete</TableCell>
              <TableCell align="right">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((q) => (
              <TableRow
                key={q.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {q.question_text}
                </TableCell>
                <TableCell align="right">
                  <DeleteIcon onClick={() => handleOpen(q.id)} />
                </TableCell>
                <TableCell align="right">
                  <EditIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
