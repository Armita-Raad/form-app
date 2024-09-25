import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import CreateQuestion from "./CreateQuestion";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}
    >
      <Stack spacing={2} direction="row" alignItems="baseline">
        <AddCircleOutlineIcon />
        <Button variant="contained">generate form</Button>
      </Stack>
    </div>
  );
}
