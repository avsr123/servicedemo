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
import { createSubscriptionPlan, getAllSubscriptions, getCategories } from "../../api";

const Subscription = () => {
  //meta title
  document.title =
    "Contact User | Skote - Vite React Admin & Dashboard Template";

  const dispatch = useDispatch();
  const [contact, setContact] = useState();
  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: (contact && contact.name) || "",
      price: (contact && contact.price) || "",
      duration: (contact && contact.duration) || "",
      features: (contact && contact.features) ? contact.features.join(', ') : "",
      status: (contact && contact.status) || "active",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Plan Name"),
      price: Yup.number().required("Please Enter Price"),
      duration: Yup.number()
        .required("Please Enter Duration")
        .positive("Duration must be a positive number")
        .integer("Duration must be a whole number"),
      features: Yup.string()
        .required("Please Enter Features")
        .test('is-valid-features', 'Features must be comma-separated values', value => {
          if (!value) return false;
          const features = value.split(',').map(f => f.trim());
          return features.length > 0 && features.every(f => f.length > 0);
        }),
      status: Yup.string().required("Please Select Status"),
    }),
    onSubmit: async (values) => {
      try {
        // Convert comma-separated features string to array
        const featuresArray = values.features.split(',').map(feature => feature.trim());
        
        if (isEdit) {
          await createSubscriptionPlan(
            contact.id,
            values.price,
            values.duration,
            featuresArray, // Send as array
            values.status,
            "admin"
          );
        } else {
          await createSubscriptionPlan(
            values.name,
            values.price,
            values.duration,
            featuresArray, // Send as array
            values.status,
            "admin"
          );
        }
        validation.resetForm();
        toggle();
        fetchCategories(); // Refresh the list
      } catch (error) {
        console.error("Error saving subscription:", error);
      }
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

  const [subscriptions, setSubscriptions] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllSubscriptions();
      setSubscriptions(data.plans); // Assuming the API returns an array of subscriptions
      console.log(data);

    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("An error occurred while fetching categories.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

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
        header: "Duration",
        accessorKey: "duration",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Price",
        accessorKey: "price",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Features",
        accessorKey: "features",
        enableColumnFilter: false,
        enableSorting: true,
        
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
          <Breadcrumbs title="Contacts" breadcrumbItem="Subscription List" />
          {isLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={subscriptions || []}
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
              {!!isEdit ? "Edit Subscription" : "Add Subscription"}
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
                    <div className="mb-3">
                      <Label>Plan Name</Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Enter Plan Name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.name || ""}
                        invalid={
                          validation.touched.name && validation.errors.name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.name && validation.errors.name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.name}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>Price</Label>
                      <Input
                        name="price"
                        type="number"
                        placeholder="Enter Price"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.price || ""}
                        invalid={
                          validation.touched.price && validation.errors.price
                            ? true
                            : false
                        }
                      />
                      {validation.touched.price && validation.errors.price ? (
                        <FormFeedback type="invalid">
                          {validation.errors.price}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>Duration (in days)</Label>
                      <Input
                        name="duration"
                        type="number"
                        min="1"
                        placeholder="Enter number of days (e.g., 30 for 1 month)"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.duration || ""}
                        invalid={
                          validation.touched.duration && validation.errors.duration
                            ? true
                            : false
                        }
                      />
                      {validation.touched.duration && validation.errors.duration ? (
                        <FormFeedback type="invalid">
                          {validation.errors.duration}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>Features</Label>
                      <Input
                        name="features"
                        type="textarea"
                        placeholder="Enter features separated by commas (e.g., Feature 1, Feature 2, Feature 3)"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.features || ""}
                        invalid={
                          validation.touched.features && validation.errors.features
                            ? true
                            : false
                        }
                      />
                      {validation.touched.features && validation.errors.features ? (
                        <FormFeedback type="invalid">
                          {validation.errors.features}
                        </FormFeedback>
                      ) : null}
                      <small className="text-muted">
                        Enter each feature separated by commas
                      </small>
                    </div>

                    <div className="mb-3">
                      <Label>Status</Label>
                      <Input
                        name="status"
                        type="select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.status || ""}
                        invalid={
                          validation.touched.status && validation.errors.status
                            ? true
                            : false
                        }
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Input>
                      {validation.touched.status && validation.errors.status ? (
                        <FormFeedback type="invalid">
                          {validation.errors.status}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-success save-user"
                      >
                        {!!isEdit ? "Update" : "Add"}
                      </button>
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

export default withRouter(Subscription);
