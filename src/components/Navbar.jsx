import React from 'react'
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    Button,
  } from "@mui/material";
  

const Navbar = () => {
  return (
    <AppBar position="fixed" style={{ background: '#ADD8E6' }}>
      <Toolbar
        variant="dense"
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          align="left"
          component="div"
          sx={{ fontFamily: "revert", fontSize: "500", color: "black" }}
        >
          Job Portal
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="outlined" href="http://localhost:3000">
            Home
          </Button>
          <Button variant="outlined" href="http://localhost:3000/create">
            Add Job
          </Button>
          <Button variant="outlined" href="https://soumadeep-dey-portfolio.vercel.app/">
            Contact Us
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
