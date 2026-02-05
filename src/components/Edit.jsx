import React, { useEffect, useState } from "react";
import { Typography, TextField, Button, Paper, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const initial = {
  postId: "",
  postProfile: "",
  reqExperience: "",
  postTechStack: [],
  postDesc: "",
};

const Edit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [currId] = useState(location.state?.id);
  const [loading, setLoading] = useState(true);

  console.log("Edit component loaded with location state:", location.state);
  console.log("Current ID:", currId);

  useEffect(() => {
    const fetchInitialPosts = async (id) => {  
      try {
        setLoading(true);
        console.log("Fetching job post with ID:", id);
        
        const response = await axios.get(`http://localhost:8080/JobPost/${id}`);
        console.log("Fetched data:", response.data);
        
        // Ensure the data structure matches our form state
        const fetchedData = {
          postId: response.data.postId || "",
          postProfile: response.data.postProfile || "",
          reqExperience: response.data.reqExperience || "",
          postTechStack: response.data.postTechStack || [],
          postDesc: response.data.postDesc || "",
        };
        
        console.log("Setting form data:", fetchedData);
        setForm(fetchedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job post:", error);
        alert("Could not load job post data. Please check if the backend server is running.");
        setLoading(false);
      }
    };
    
    if (currId) {
      fetchInitialPosts(currId);
    } else {
      setLoading(false);
    }
  }, [currId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form data:", form);
    
    axios      
      .put("http://localhost:8080/JobPost", form)
      .then((resp) => {
        console.log("Update response:", resp.data);
        navigate('/');
      })
      .catch((error) => {
        console.log("Update error:", error);
        alert("Error updating job post. Please try again.");
      });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle number fields properly
    if (name === 'reqExperience' || name === 'postId') {
      setForm({ ...form, [name]: value === '' ? '' : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setForm({ ...form, postTechStack: [...form.postTechStack, value] });
    } else {
      setForm({
        ...form,
        postTechStack: form.postTechStack.filter((skill) => skill !== value),
      });
    }
  };

  const skillSet = [
    {
      name: "Javascript",
    },
    {
      name: "Java",
    },
    {
      name: "Python",
    },
    {
      name: "Django",
    },
    {
      name: "Rust",
    },
  ];

  return (
    <Paper sx={{ padding: "1%" }} elevation={0}>
      <Typography sx={{ margin: "3% auto" }} align="center" variant="h5">
        Edit Job Post
      </Typography>
      {!currId ? (
        <Typography align="center" sx={{ margin: "3% auto" }} color="error">
          No job post ID provided. Please go back and try again.
        </Typography>
      ) : loading ? (
        <Typography align="center" sx={{ margin: "3% auto" }}>
          Loading job post data...
        </Typography>
      ) : (
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              min="0"
              type="number"
              sx={{ width: "50%", margin: "2% auto" }}
              name="postId"
              onChange={handleInputChange}
              label="Enter your Post ID"
              variant="outlined"
              value={form.postId}
            />
            <TextField
              type="string"
              sx={{ width: "50%", margin: "2% auto" }}
              required
              name="postProfile"
              onChange={handleInputChange}
              label="Job-Profile"
              variant="outlined"
              value={form.postProfile}
            />
            <TextField
              min="0"
              type="number"
              sx={{ width: "50%", margin: "2% auto" }}
              required
              name="reqExperience"
              onChange={handleInputChange}
              label="Years of Experience"
              variant="outlined"
              value={form.reqExperience}
            />
            <TextField
              type="string"
              sx={{ width: "50%", margin: "2% auto" }}
              required
              multiline
              rows={4}
              name="postDesc"
              onChange={handleInputChange}
              label="Job-desc"
              variant="outlined"
              value={form.postDesc}
            />
            <Box sx={{ margin: "1% auto" }}>
              <h3>Please mention required skills</h3>
              <ul>
                {skillSet.map(({ name }, index) => {
                  return (
                    <li key={index}>
                      <div>
                        <div>
                          <input
                            type="checkbox"
                            id={`custom-checkbox-${index}`}
                            name={name}
                            value={name}
                            onChange={handleChange}
                            checked={form.postTechStack && form.postTechStack.includes(name)}
                          />
                          <label htmlFor={`custom-checkbox-${index}`}>
                            {name}
                          </label>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Box>
            <Button
              sx={{ width: "50%", margin: "2% auto" }}
              variant="contained"
              type="submit"
            >
              Update Post
            </Button>
          </Box>
        </form>
      )}
    </Paper>
  );
};

export default Edit;
