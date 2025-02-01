import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import TableContainer from "../../components/Common/TableContainer";
import Spinners from "../../components/Common/Spinner";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
  Input,
  Form,
  Button,
  UncontrolledTooltip,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Badge,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import DeleteModal from "/src/components/Common/DeleteModal";

import {
  getUsers as onGetUsers,
  addNewUser as onAddNewUser,
  updateUser as onUpdateUser,
  deleteUser as onDeleteUser,
} from "/src/store/contacts/actions";
import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { ToastContainer } from "react-toastify";

const UsersList = () => {
  //meta title
  document.title =
    "Contact User | Skote - Vite React Admin & Dashboard Template";

  const dispatch = useDispatch();
  const [contact, setContact] = useState();
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      fname: (contact && contact.fname) || "",
      lname: (contact && contact.lname) || "",
      mobile: (contact && contact.mobile) || "",
      email: (contact && contact.email) || "",
      password: (contact && contact.password) || "",
    },
    validationSchema: Yup.object({
      fname: Yup.string().required("Please Enter Your First Name"),
      lname: Yup.string().required("Please Enter Your Last Name"),
      mobile: Yup.string().required("Please Enter Your Mobile"),
      email: Yup.string()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please Enter Valid Email")
        .required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateUser = {
          id: contact.id,
          fname: values.fname,
          lname: values.lname,
          mobile: values.mobile,
          email: values.email,
          password: values.password,
        };

        // update user
        dispatch(onUpdateUser(updateUser));
        validation.resetForm();
        setIsEdit(false);
      } else {
        const newUser = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          fname: values["fname"],
          lname: values["lname"],
          mobile: values["mobile"],
          email: values["email"],
          password: values["password"],
        };
        // save new user
        dispatch(onAddNewUser(newUser));
        validation.resetForm();
      }
      toggle();
    },
  });

  const ContactsProperties = createSelector(
    (state) => state.contacts,
    (Contacts) => ({
      users: Contacts.users,
      loading: Contacts.loading,
    })
  );

  const { users, loading } = useSelector(ContactsProperties);

  const [isLoading, setLoading] = useState(loading);

  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (users && !users.length) {
      dispatch(onGetUsers());
      setIsEdit(false);
    }
  }, [dispatch, users]);

  useEffect(() => {
    setContact(users);
    setIsEdit(false);
  }, [users]);

  useEffect(() => {
    if (!isEmpty(users) && !!isEdit) {
      setContact(users);
      setIsEdit(false);
    }
  }, [users]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleUserClick = (arg) => {
    const user = arg;
    setContact({
      id: user.id,
      fname: user.fname,
      lname: user.lname,
      mobile: user.mobile,
      email: user.email,
      password: user.password,
    });
    setIsEdit(true);

    toggle();
  };

  //delete customer
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (users) => {
    setContact(users);
    setDeleteModal(true);
  };

  const handleDeleteUser = () => {
    if (contact && contact.id) {
      dispatch(onDeleteUser(contact.id));
    }
    setContact("");
    setDeleteModal(false);
  };

  const handleUserClicks = () => {
    setContact("");
    setIsEdit(false);
    toggle();
  };

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "img",
        cell: (cell) => (
          <>
            {!cell.getValue() ? (
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle">
                  {cell.row.original.name.charAt(0)}{" "}
                </span>
              </div>
            ) : (
              <div>
                <img
                  className="rounded-circle avatar-xs"
                  src={cell.getValue()}
                  alt=""
                />
              </div>
            )}
          </>
        ),
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell) => {
          return (
            <>
              <h5 className="font-size-14 mb-1">
                <Link to="#" className="text-dark">
                  {cell.getValue()}
                </Link>
              </h5>
              <p className="text-muted mb-0">{cell.row.original.designation}</p>
            </>
          );
        },
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Mobile",
        accessorKey: "mobile",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell) => {
          const colorStatus =
            cell.getValue() == "active"
              ? "badge-soft-success"
              : cell.getValue() == "suspend"
              ? "badge-soft-danger"
              : cell.getValue() == "inactive"
              ? "badge-soft-secondary"
              : "badge-soft-primary";
          return (
            <>
              <Link to="#1" className={`badge ${colorStatus} font-size-11 m-1`}>
                {cell.getValue()}
              </Link>
            </>
          );
        },
      },
      {
        header: "Location",
        accessorKey: "location",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell) => {
          return (
            <>
              <h5 className="font-size-14 mb-1">
                <Link to="#" className="text-secondary">
                  {cell.row.original.city}
                </Link>
              </h5>
              <p className="text-muted mb-0">{cell.row.original.state}</p>
            </>
          );
        },
      },
      //   {
      //     header: 'Tags',
      //     accessorKey: 'tags',
      //     enableColumnFilter: false,
      //     enableSorting: true,
      //     cell: (cell) => {
      //       return (
      //         <div>
      //           {
      //             cell.getValue()?.map((item, index) => (
      //               <Link to="#1" className="badge badge-soft-primary font-size-11 m-1" key={index}>{item}</Link>
      //             ))
      //           }
      //         </div>
      //       );
      //     },
      //   },
      //   {
      //     header: 'Projects',
      //     accessorKey: 'projects',
      //     enableColumnFilter: false,
      //     enableSorting: true,
      //   },
      {
        header: "Action",
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <Link
                to={"/users-detail/" + cellProps.row.original.id}
                className="text-success"
                // onClick={() => {
                //   const userData = cellProps.row.original;
                //   handleUserClick(userData);
                // }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
              </Link>
              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  const userData = cellProps.row.original;
                  onClickDelete(userData);
                }}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
              </Link>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUser}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="Users List" />
          {isLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={users || []}
                      isGlobalFilter={true}
                      isPagination={true}
                      SearchPlaceholder="Search..."
                      isCustomPageSize={true}
                      isAddButton={true}
                      handleUserClick={handleUserClicks}
                      buttonClass="btn btn-success btn-rounded waves-effect waves-light addContact-modal mb-2"
                      buttonName="New Contact"
                      tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                      theadClass="table-light"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                      pagination="pagination"
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} tag="h4">
              {" "}
              {!!isEdit ? "Edit Vendor" : "Add Vendor"}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col xs={12}>
                    <Row xs={12}>
                      <div className="mb-3">
                        <Label>First Name</Label>
                        <Input
                          name="fname"
                          type="text"
                          placeholder="Enter First Name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.fname || ""}
                          invalid={
                            validation.touched.fname && validation.errors.fname
                              ? true
                              : false
                          }
                        />
                        {validation.touched.fname && validation.errors.fname ? (
                          <FormFeedback type="invalid">
                            {validation.errors.fname}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label>Last Name</Label>
                        <Input
                          name="lname"
                          type="text"
                          placeholder="Enter Last Name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.lname || ""}
                          invalid={
                            validation.touched.lname && validation.errors.lname
                              ? true
                              : false
                          }
                        />
                        {validation.touched.lname && validation.errors.lname ? (
                          <FormFeedback type="invalid">
                            {validation.errors.lname}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </Row>
                    <div className="mb-3">
                      <Label>Email</Label>
                      <Input
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Enter E-mail"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email
                            ? true
                            : false
                        }
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid">
                          {" "}
                          {validation.errors.email}{" "}
                        </FormFeedback>
                      ) : null}
                    </div>
                    {/* <div className="mb-3">
                      <Label>Option</Label>
                      <Input
                        type="select"
                        name="tags"
                        className="form-select"
                        multiple={true}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tags || []}
                        invalid={
                          validation.touched.tags && validation.errors.tags
                            ? true
                            : false
                        }
                      >
                        <option>Photoshop</option>
                        <option>illustrator</option>
                        <option>Html</option>
                        <option>Php</option>
                        <option>Java</option>
                        <option>Python</option>
                        <option>UI/UX Designer</option>
                        <option>Ruby</option>
                        <option>Css</option>
                      </Input>
                      {validation.touched.tags && validation.errors.tags ? (
                        <FormFeedback type="invalid">
                          {" "}
                          {validation.errors.tags}{" "}
                        </FormFeedback>
                      ) : null}
                    </div> */}
                    <div className="mb-3">
                      <Label className="form-label">Password</Label>
                      <Input
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.password || ""}
                        invalid={
                          validation.touched.password &&
                          validation.errors.password
                            ? true
                            : false
                        }
                      />
                      {validation.touched.password &&
                      validation.errors.password ? (
                        <FormFeedback type="invalid">
                          {validation.errors.password}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label>Mobile</Label>
                      <Input
                        name="mobile"
                        label="Mobile"
                        type="text"
                        placeholder="Enter Mobile"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mobile || ""}
                        invalid={
                          validation.touched.mobile && validation.errors.mobile
                            ? true
                            : false
                        }
                      />
                      {validation.touched.mobile && validation.errors.mobile ? (
                        <FormFeedback type="invalid">
                          {" "}
                          {validation.errors.mobile}{" "}
                        </FormFeedback>
                      ) : null}
                    </div>
                    {/* <div className="mb-3">
                      <Label>Designation</Label>
                      <Input
                        type="select"
                        name="designation"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.designation || ""}
                        invalid={
                          validation.touched.designation &&
                          validation.errors.designation
                            ? true
                            : false
                        }
                      >
                        <option>Frontend Developer</option>
                        <option>UI/UX Designer</option>
                        <option>Backend Developer</option>
                        <option>Full Stack Developer</option>
                      </Input>
                      {validation.touched.designation &&
                      validation.errors.designation ? (
                        <FormFeedback type="invalid">
                          {" "}
                          {validation.errors.designation}{" "}
                        </FormFeedback>
                      ) : null}
                    </div> */}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      <Button
                        type="submit"
                        color="success"
                        className="save-user"
                      >
                        {" "}
                        {!!isEdit ? "Update" : "Add"}{" "}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default withRouter(UsersList);
