import {
    Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const columns = [
  { id: "uniqueId", label: "UniqueId", align: "center" },
  { id: "image", label: "Image", align: "center" },
  { id: "name", label: "Name", align: "center" },
  { id: "email", label: "Email", align: "center" },
  { id: "mobileNumber", label: "MobileNumber", align: "Center" },
  { id: "designation", label: "Designation", align: "Center" },
  { id: "gender", label: "Gender", align: "Center" },
  { id: "course", label: "Course", align: "Center" },
  { id: "date", label: "Create Date", align: "Center" },
  { id: "action", label: "Action", align: "Center" },
];

const EmployeeList = ({employees, deleteAction, updateAction, query, setQuery, totalPages}) => {

    
  const handleChangePage = (e, value) => {

    setQuery({...query, page: value + 1 })
  }

  const handleChangeRowsPerPage = (e) => {
      const {value} = e.target;
      setQuery({...query, rowsPerPage: value })
  }

  return (
    <div className="w-full px-5">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
                {employees.map((employee) => {
                    return (
                        <TableRow key={employee._id}>
                            <TableCell  align='center'>{employee._id}</TableCell>
                            <TableCell  align='center'><img src={employee.imageUrl} alt="user" className="w-20 h-20" /></TableCell>
                            <TableCell align='center'>{employee.name}</TableCell>
                            <TableCell align='center'>{employee.email}</TableCell>
                            <TableCell align='center'>{employee.mobileNumber}</TableCell>
                            <TableCell align='center'>{employee.designation}</TableCell>
                            <TableCell align='center'>{employee.gender}</TableCell>
                            <TableCell align='center'>{employee.course.join(',')}</TableCell>
                            <TableCell align='center'>{new Date(employee.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell sx={{display: 'flex', flexDirection: 'column', gap: 1}} align='center'>
                                <Button variant="contained" sx={{backgroundColor: 'gray'}} onClick={() => updateAction(employee)}>Update</Button>
                                <Button variant="contained" sx={{backgroundColor: 'tomato'}} onClick={() => deleteAction(employee._id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[2, 4, 8]}
          component="div"
          count={totalPages}
          rowsPerPage={query.rowsPerPage}
          page={query.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default EmployeeList;
