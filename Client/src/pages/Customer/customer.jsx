import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MainCard from "../../components/MainCard";
import IconButton from "../../components/@extended/MuiIconButton";
import MuiBackdrop from "../../components/Loader/MuiBackdrop";
import Table from "../../common/table.jsx";
import Avatar from "../../components/@extended/Avatar";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  startLoader,
  stopLoader,
  showAlert,
  showSelfCloseAlert,
  hideSelfCloseAlert,
} from "../../Redux/Counter/commonSlice";
import {
  ALERT_ERROR,
  ALERT_SUCCESS,
  ALERT_WARNING,
} from "../../common/constants";
import { getErrorDetails } from "../../common/utility";
import { Stack, Tooltip } from "@mui/material";
// import CustomersForm from './CustomersForm';

const Customers = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [CustomersList, setCustomersList] = useState([]);
  const [CustomersData, setCustomersData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getCustomers();
    return () => {
      setCustomersList([]);
    };
  }, []);

  const getCustomers = async () => {
    // setShowBackDrop(true);
    // dispatch(startLoader());
    // await requestsApi
    //     .getRequest("api/Customers")
    //     .then(function (response) {
    //         setCustomersList(response.data);
    //         if(response.data.length === 0){
    //             dispatch(
    //                 showSelfCloseAlert({
    //                     type: ALERT_WARNING,
    //                     message: "Customers not found"
    //                 })
    //             );
    //         }else{
    //             dispatch(hideSelfCloseAlert());
    //         }
    //     })
    //     .catch(function (error) {
    //         let { msg } = getErrorDetails(error);
    //         dispatch(
    //             showAlert({
    //                 type: ALERT_ERROR,
    //                 message: msg
    //             })
    //         );
    //     })
    //     .then(function () {
    //         setShowBackDrop(false);
    //         dispatch(stopLoader());
    //     });
  };

  const handleModal = () => {
    setShowModal(!showModal);
    if (CustomersData && !showModal) setCustomersData(null);
  };

  const handleDelete = async (id) => {
    setShowBackDrop(true);
    await requestsApi
      .deleteRequest(`api/Customers/${id}`)
      .then(function (response) {
        getCustomers();
        dispatch(
          showAlert({
            type: ALERT_SUCCESS,
            message: response.message,
          })
        );
      })
      .catch(function (error) {
        let { msg } = getErrorDetails(error);
        dispatch(
          showAlert({
            type: ALERT_ERROR,
            message: msg,
          })
        );
      })
      .then(function () {
        setShowBackDrop(false);
      });
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Customers?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Picture",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <Avatar
              alt="Avatar 1"
              src={`${
                "http://localhost:8000"
              }${original?.imagePath?.replace(/\\/g, "/")}`}
            />
          );
        },
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Phone Number",
        accessor: "phoneNumber",
      },
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Total Purchase",
        accessor: "totalPurchase",
      },
      {
        Header: "Actions",
        className: "cell-center",
        disableSortBy: true,
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={0}
            >
              <Tooltip title="Edit" arrow>
                <IconButton
                  color="primary"
                  onClick={() => {
                    setCustomersData(original);
                    handleModal();
                  }}
                >
                  <EditOutlined color={theme.palette.primary.main} />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Delete" arrow>
                                <IconButton
                                    color="error"
                                    onClick={() => confirmDelete(original.id)}
                                >
                                    <DeleteOutlined color={theme.palette.error.main} />
                                </IconButton>
                            </Tooltip> */}
            </Stack>
          );
        },
      },
    ],
    [theme]
  );

  return (
    <MainCard sx={{ height: "100%", px: 2 }} content={false}>
      {showBackDrop && <MuiBackdrop isLoading={showBackDrop} />}
      <Table
        columns={columns}
        data={CustomersList}
        handleAddModal={handleModal}
        getHeaderProps={(column) => column.getSortByToggleProps()}
        buttonName="Add Customers"
        getList={getCustomers}
        showButtonIcon={true}
        title="Customers"
      />
      {/* {showModal && (
                <CustomersForm
                    size="sm"
                    isPopUpShow={showModal}
                    CustomersData={CustomersData}
                    toggleModal={handleModal}
                    updateList={getCustomers}
                />
            )} */}
    </MainCard>
  );
};

export default Customers;
