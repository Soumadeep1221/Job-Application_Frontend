import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

import {
  Box,
    Card,
    Grid,
    InputAdornment,
    TextField,
    Typography,
  } from "@mui/material";
  import axios from "axios";
  import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [query, setQuery] = useState("");
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

const handleEdit = (id) => {
  navigate("/edit",{state:{id}});
}

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          // Pass exact case to backend - backend is case-sensitive
          const encodedQuery = encodeURIComponent(query);
          console.log("Fetching posts with keyword:", query);
          const response = await axios.get(`http://localhost:8080/JobPost/keyword/${encodedQuery}`);    
          console.log("Response from keyword search:", response.data);
          setPost(response.data);
        } catch (error) {
          console.error("Error fetching posts by keyword:", error);
        }
      };
      
      const fetchInitialPosts = async () => {
        try {
          console.log("Fetching all posts");
          const response = await axios.get(`http://localhost:8080/JobPosts`);
          console.log("Response from initial fetch:", response.data);
          setPost(response.data);
        } catch (error) {
          console.error("Error fetching initial posts:", error);
        }
      }
      
      // Search immediately as user types
      if (query.length === 0) {
        fetchInitialPosts();
      } else if (query.length >= 1) {
        fetchPosts();
      }
    }, [query]);

    const handleDelete = async (id) => {
      try {
        await axios.delete(`http://localhost:8080/JobPost/${id}`);
        // Refresh the data instead of reloading the entire page
        if (query.length === 0) {
          const response = await axios.get(`http://localhost:8080/JobPosts`);
          setPost(response.data);
        } else {
          // Backend is case-sensitive - pass exact case
          const encodedQuery = encodeURIComponent(query);
          const response = await axios.get(`http://localhost:8080/JobPost/keyword/${encodedQuery}`);
          setPost(response.data);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }

  return (
  <>
      <Grid
        container
        spacing={2}
        sx={{ mt: 8, px: 2, pb: 4 }}
      >
      <Grid item xs={12} md={12} lg={12}>
        <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 2 }}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search..."
            sx={{ width: "100%" }}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>
      </Grid>
      {post &&
        post.map((p) => {
          return (
            <Grid key={p.postId} item xs={12} md={6} lg={4}>
              <Card sx={{ padding: "3%", overflow: "hidden", width: "84%", backgroundColor:"#ADD8E6" }}>
                <Typography        
                  variant="h5"
                  sx={{ fontSize: "2rem", fontWeight: "600", fontFamily:"sans-serif" }}
                >
             {p.postProfile}
                </Typography>
                <Typography  sx={{ color: "#585858", marginTop:"2%", fontFamily:"cursive" }} variant="body" >
                  Description: {p.postDesc}
                </Typography>
                <br />
                <br />
                <Typography variant="h6" sx={{ fontFamily:"unset", fontSize:"400"}}>
                  Experience: {p.reqExperience} years
                </Typography>
                <Typography sx={{fontFamily:"serif",fontSize:"400"}} gutterBottom  variant="body">Skills : </Typography>
                {p.postTechStack && p.postTechStack.map((s, i) => {
                  return (
                    <Typography variant="body" gutterBottom key={i}>
                      {s} .
                      {` `}
                    </Typography>
                  );
                })}
               <DeleteIcon onClick={() => handleDelete(p.postId)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                <EditIcon onClick={() => handleEdit(p.postId)} style={{ cursor: 'pointer' }} />
              </Card>
            </Grid>
          );
        })}
    </Grid>
    </>
 
  )
}

export default Search