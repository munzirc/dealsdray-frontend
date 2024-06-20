import React, { useEffect, useRef, useState } from "react";
import HomeNavBar from "../components/HomeNavBar";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import EmployeeList from "../components/EmployeeList";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
};

const EmployeeDetails = () => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState({
    page: 1,
    rowsPerPage: 2,
    searchTerm: "",
  });

  const [totalPages, setTotalPages] = useState(0);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ error: "", success: "" });

  const [empId, setEmpId] = useState(null);

  const [employees, setEmployees] = useState([]);

  const [imagefile, setImageFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [toggle, setToggle] = useState(true);

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    designation: "",
    gender: "",
    course: [],
    imageUrl: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    designation: "",
    gender: "",
    course: "",
    imageUrl: "",
  });

  const validateEmployee = () => {
    let tempErrors = {};
    tempErrors.name = employee.name ? "" : "Name is required.";
    tempErrors.email =
      employee.email && !employee.email.includes("@")
        ? "Please enter valid email address"
        : "";
    tempErrors.email = employee.email ? "" : "Email is required.";
    tempErrors.mobileNumber =
      employee.mobileNumber &&
      (employee.mobileNumber.length > 10 || employee.mobileNumber.length < 10)
        ? "Enter valid mobile number"
        : "";
    tempErrors.mobileNumber = employee.mobileNumber
      ? ""
      : "Mobile Number is required";
    tempErrors.designation = employee.designation
      ? ""
      : "Designation is required";
    tempErrors.gender = employee.gender ? "" : "Gender is required";
    tempErrors.course =
      employee.course.length === 0 ? "Cousrse is required" : "";
    tempErrors.imageUrl = employee.imageUrl ? "" : "Image is requied";

    setErrors(tempErrors);

    console.log(errors);

    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };
  console.log(employee);

  const handleCheckbox = (e) => {
    const course = e.target.name;
    setEmployee((prev) => {
      const newCourses = e.target.checked
        ? [...prev.course, course]
        : prev.course.filter((c) => c !== course);

      return {
        ...prev,
        course: newCourses,
      };
    });
  };

  const handleImageSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imagefile) {
      console.log("started");
      handleImageUpload();
    }
  }, [imagefile]);

  useEffect(() => {
    const getEmployeeDetails = async () => {
      try {
        const params = new URLSearchParams();
        params.set("page", query.page);
        params.set("rowsPerPage", query.rowsPerPage);
        params.set("searchTerm", query.searchTerm);

        const baseuri = import.meta.env.VITE_BASE_URL;
        const response = await fetch(
          `${baseuri}/api/employee/details?${params.toString()}`
        );
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setEmployees(data.employees);
        setTotalPages(data.count);
      } catch (error) {
        setMessage({ ...message, error: error.message });
        setOpenSnackbar(true);
      }
    };
    getEmployeeDetails();
  }, [query]);

  const handleImageUpload = async () => {
    try {
      if (!imagefile) {
        setUploadError("Please select an image");
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + imagefile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imagefile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(Number(progress.toFixed(0)));
        },
        (error) => {
          console.log(error);
          setMessage({ ...message, error: "Image upload failed!" });
          setOpenSnackbar(true);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMessage({ ...message, success: "Image uploaded succesfully" });
            setOpenSnackbar(true);
            setImageUploadProgress(null);
            setEmployee({ ...employee, imageUrl: downloadURL });
          });
        }
      );
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateEmployee()) {
      try {
        setLoading(true);
        const baseuri = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${baseuri}/api/employee/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employee),
        });
        const data = await response.json();
        setLoading(false);
        if (data.error) {
          throw new Error(data.error);
        }
        setEmployees([...employees, data]);
        setImageUrl(null);
        setOpen(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      } finally {
        setEmployee({
          name: "",
          email: "",
          mobileNumber: "",
          designation: "",
          gender: "",
          course: [],
          imageUrl: "",
        });
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (validateEmployee()) {
      try {
        setLoading(true);
        const baseuri = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${baseuri}/api/employee/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employee),
        });
        const data = await response.json();
        setLoading(false);
        if (data.error) {
          throw new Error(data.error);
        }

        const updatedEmployees = employees.map((emp) =>
          emp._id === data._id ? data : emp
        );
        setEmployees(updatedEmployees);

        setImageUrl(null);
        setToggle(true);
        setOpen(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const baseuri = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${baseuri}/api/employee/delete/${empId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setEmployees(employees.filter((emp) => emp._id !== empId));
      setLoading(false);
      setOpenModal(false);
      setMessage({ ...message, success: data.message });
      setOpenSnackbar(true);
    } catch (error) {
      setLoading(false);
      setOpenModal(false);
      setOpenSnackbar(true);
      setMessage({ ...message, error: error.message });
    }
  };

  const updateAction = (employee) => {
    setToggle(false);
    setEmployee(employee);
    setOpen(true);
  };

  const deleteAction = (employeeId) => {
    setEmpId(employeeId);
    setOpenModal(true);
  };

  const handleClose = () => {
    setToggle(true);
    setOpen(false);
    setEmployee({
      name: "",
      email: "",
      mobileNumber: "",
      designation: "",
      gender: "",
      course: [],
      imageUrl: "",
    });
  };

  return (
    <>
      <HomeNavBar currPage={"details"} />

      <div className="flex items-center justify-between gap-10 py-5 px-20">
        <div className="w-64 h-10 flex items-center justify-around border rounded-lg">
          <SearchIcon />
          <input
            type="text"
            className="h-full w-[80%] border-none outline-none focus:outline-none focus:border-none"
            onChange={(e) => setQuery({ ...query, searchTerm: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between gap-10">
          <span>Total Employee's: {totalPages}</span>
          <Button
            variant="contained"
            sx={{ backgroundColor: "black", color: "white" }}
            onClick={() => setOpen(true)}
          >
            Add Employee
          </Button>
        </div>
      </div>

      <EmployeeList
        employees={employees}
        deleteAction={deleteAction}
        updateAction={updateAction}
        query={query}
        setQuery={setQuery}
        totalPages={totalPages}
      />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          noValidate
          onSubmit={toggle ? handleSubmit : handleUpdate}
          sx={{ ...style, width: 800 }}
          className="space-y-5"
        >
          <div className="w-full text-2xl font-bold text-center">
            {toggle ? "Add Employee" : "Update Employee"}
          </div>

          <input
            type="file"
            accept=".jpg, .png"
            onChange={handleImageSelection}
            ref={fileRef}
            hidden
          />

          <div
            onClick={() => fileRef.current.click()}
            className="w-full flex flex-col items-center justify-center cursor-pointer"
          >
            <div
              style={{
                backgroundImage: `url(${
                  imageUrl ? imageUrl : "/addimage.jpg"
                })`,
              }}
              className="w-32 h-32 rounded-full border-4 border-gray-200 flex justify-center items-center bg-center bg-cover"
            >
              <CircularProgress
                variant="determinate"
                value={imageUploadProgress}
              />
            </div>
            <FormHelperText sx={{ color: "red" }}>
              {errors.imageUrl && "Image is required"}
            </FormHelperText>
          </div>

          <div className="flex gap-5">
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              name="name"
              fullWidth
              value={employee.name}
              error={!!Boolean(errors.name)}
              helperText={errors.name}
              onChange={handleChange}
              required
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              variant="outlined"
              name="email"
              fullWidth
              value={employee.email}
              error={!!Boolean(errors.email)}
              helperText={errors.email}
              onChange={handleChange}
              required
              disabled={!toggle}
            />
          </div>
          <div className="flex gap-5">
            <TextField
              id="mobileNumber"
              label="Mobile Number"
              variant="outlined"
              name="mobileNumber"
              fullWidth
              value={employee.mobileNumber}
              error={!!Boolean(errors.mobileNumber)}
              helperText={errors.mobileNumber}
              onChange={handleChange}
              required
              disabled={!toggle}
            />
            <FormControl fullWidth>
              <InputLabel id="designationLabel">Designation</InputLabel>
              <Select
                labelId="designationLabel"
                id="designation"
                value={employee.designation}
                onChange={handleChange}
                fullWidth
                name="designation"
              >
                <MenuItem value={"hr"}>HR</MenuItem>
                <MenuItem value={"manager"}>Manager</MenuItem>
                <MenuItem value={"sales"}>Sales</MenuItem>
              </Select>
              <FormHelperText sx={{ color: "red" }}>
                {errors.designation && "Please select a Designation"}
              </FormHelperText>
            </FormControl>
          </div>

          <div className="flex gap-20">
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
              <RadioGroup
                row
                defaultValue={employee.gender}
                aria-labelledby="demo-radio-buttons-group-label"
                name="gender"
                onChange={handleChange}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
              <FormHelperText sx={{ color: "red" }}>
                {errors.gender && "Please select a Gender"}
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel id="demo-check-group-label">Course</FormLabel>
              <FormGroup row required>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={employee.course.includes("mca")}
                      onChange={handleCheckbox}
                      name="mca"
                    />
                  }
                  label="MCA"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={employee.course.includes("bca")}
                      onChange={handleCheckbox}
                      name="bca"
                    />
                  }
                  label="BCA"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={employee.course.includes("bsc")}
                      onChange={handleCheckbox}
                      name="bsc"
                    />
                  }
                  label="BSC"
                />
              </FormGroup>
              <FormHelperText sx={{ color: "red" }}>
                {errors.course && "Please select atleast on course"}
              </FormHelperText>
            </FormControl>
          </div>

          <div className="w-full flex justify-center">
            <Button variant="contained" type="submit" color="success">
              {loading ? <CircularProgress /> : "Submit"}
            </Button>
          </div>

          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Modal>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: 420 }}>
          {loading ? (
            <div className="flex w-full justify-center p-5">
              <CircularProgress />
            </div>
          ) : (
            <div className="w-full p-1 flex flex-col space-x-3">
              <p>Are you sure you want to delete this Employee?</p>
              <div className="flex justify-end gap-10 pt-5">
                <Button variant="outlined" color="error" onClick={handleDelete}>
                  Yes
                </Button>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => setOpenModal(false)}
                >
                  No
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={message.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message.error ? message.error : message.success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EmployeeDetails;
