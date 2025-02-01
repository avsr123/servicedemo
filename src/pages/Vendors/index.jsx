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
import { createCategory, getCategories } from "../../api";

const Vendors = () => {
  //meta title
  document.title =
    "Contact User | Skote - Vite React Admin & Dashboard Template";

  const dispatch = useDispatch();
  const [contact, setContact] = useState();
  // validation
  const categoryValidation = useFormik({
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

  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState();
  const [catLevel, setCatLevel] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [sort, setSort] = useState("");
  const [error, setError] = useState("");
  
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getCategories(page, limit, catLevel, parentCategory, sort);
      console.log(response.categoriesData);

      setCategories(response.categoriesData);

    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("An error occurred while fetching categories.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [page, limit, catLevel, parentCategory, sort]);

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "imageJson.url",
        cell: (cell) => (
          <>
            {!cell.getValue() ? (
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle">
                  {cell.row.original.name.charAt(0)}
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
              <p className="text-muted mb-0">{cell.row.original.description}</p>
            </>
          );
        },
      },
      {
        header: "Category Level",
        accessorKey: "catLevel",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Priority",
        accessorKey: "priority",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell) => new Date(cell.getValue()).toLocaleDateString(),
      },
      {
        header: "Action",
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <Link
                to={"/vendors-detail/" + cellProps.row.original._id}
                className="text-success"
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

  // Add these new state variables
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // Update validation schema
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      description: "",
      catLevel: "",
      imageId: "img_67890", // hardcoded for now
      parentCategory: "", // optional
      createdBy: "671b0860a814f4e9449ba5a5" // hardcoded for now
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Category Name"),
      description: Yup.string().required("Please Enter Category Description"),
      catLevel: Yup.number().required("Please Enter Category Level"),
    }),
    onSubmit: async (values) => {
      try {
        const categoryData = {
          ...values,
          imageJson: {
            url: imageUrl || "https://example.com/image.jpg" // default image if none selected
          },
          parentCategory: values.parentCategory || null
        };
        
        await createCategory(
          categoryData.name,
          categoryData.description,
          categoryData.imageId,
          categoryData.catLevel,
          categoryData.imageJson,
          categoryData.parentCategory,
          categoryData.createdBy
        );

        fetchCategories(); // Refresh the list
        toggle(); // Close modal
        validation.resetForm();
      } catch (error) {
        console.error("Error creating category:", error);
        // Add error handling/notification here
      }
    },
  });

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
          <Breadcrumbs title="Contacts" breadcrumbItem="Vendors List" />
          {isLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={categories || []}
                      isGlobalFilter={true}
                      isPagination={true}
                      SearchPlaceholder="Search..."
                      isCustomPageSize={true}
                      isAddButton={true}
                      handleUserClick={handleUserClicks}
                      buttonClass="btn btn-success btn-rounded waves-effect waves-light addContact-modal mb-2"
                      buttonName="New Category"
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
              {!!isEdit ? "Edit Category" : "Add Category"}
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={validation.handleSubmit}>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <Label>Name</Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Enter Category Name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.name || ""}
                        invalid={validation.touched.name && validation.errors.name}
                      />
                      {validation.touched.name && validation.errors.name && (
                        <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>Description</Label>
                      <Input
                        name="description"
                        type="textarea"
                        placeholder="Enter Description"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.description || ""}
                        invalid={validation.touched.description && validation.errors.description}
                      />
                      {validation.touched.description && validation.errors.description && (
                        <FormFeedback type="invalid">{validation.errors.description}</FormFeedback>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>Category Level</Label>
                      <Input
                        name="catLevel"
                        type="select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.catLevel || ""}
                        invalid={validation.touched.catLevel && validation.errors.catLevel}
                      >
                        <option value="">Select Level</option>
                        <option value="1">Level 1</option>
                        <option value="2">Level 2</option>
                      </Input>
                      {validation.touched.catLevel && validation.errors.catLevel && (
                        <FormFeedback type="invalid">{validation.errors.catLevel}</FormFeedback>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>Parent Category</Label>
                      <Input
                        name="parentCategory"
                        type="text"
                        placeholder="Parent Category ID (Optional)"
                        onChange={validation.handleChange}
                        value={validation.values.parentCategory || ""}
                      />
                    </FormGroup>

                    <div className="text-end mt-3">
                      <Button type="submit" color="primary">
                        {!!isEdit ? "Update Category" : "Create Category"}
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

export default withRouter(Vendors);
